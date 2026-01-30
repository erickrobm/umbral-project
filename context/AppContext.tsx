
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { UserProfile, Currency, Envelope, Account, AssetType, AccountType } from '../types';
import { fetchMarketRates } from '../services/marketService';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface AppContextType {
  profile: UserProfile;
  calculatedMonthlySavings: number;
  updateProfile: (data: Partial<UserProfile>) => void;
  formatCurrency: (amount: number, specificCurrency?: Currency) => string;
  toggleCurrency: () => void;
  exchangeRate: number;
  cryptoPrices: { BTC: number; ETH: number };
  totalNetWorth: number;
  envelopes: Envelope[];
  updateEnvelope: (id: string, data: Partial<Envelope>) => void;
  addEnvelope: () => void;
  deleteEnvelope: (id: string) => void;
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'lastUpdated'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  loadingData: boolean;
  isProfileLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Helpers
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Estado del Mercado
  const [exchangeRate, setExchangeRate] = useState<number>(18.50);
  const [cryptoPrices, setCryptoPrices] = useState<{ BTC: number; ETH: number }>({ BTC: 65000, ETH: 3500 });
  const [loadingData, setLoadingData] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  // Efecto para obtener datos del mercado (independiente del usuario)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMarketRates();
      if (data) {
        setExchangeRate(data.usdRate);
        setCryptoPrices({ BTC: data.btcUsd, ETH: data.ethUsd });
      }
    };
    fetchData();
  }, []);

  // Estado inicial (Base Profile always in MXN for amounts)
  const [baseProfile, setBaseProfile] = useState<UserProfile>({
    name: 'Usuario',
    currency: 'MXN',
    netWorth: 0,
    monthlyIncome: 0, // Always MXN
    firstMillionGoal: 1000000, // Always MXN
    preferences: {
      aiNotifications: true,
      emailSummary: false
    }
  });

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load Data from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setEnvelopes([]);
      setAccounts([]);
      return;
    }

    const loadData = async () => {
      setLoadingData(true);
      // Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (profileData) {
        setBaseProfile({
          name: profileData.name || user.email?.split('@')[0] || 'User',
          avatar: profileData.avatar, // Load avatar from DB
          currency: (profileData.currency as Currency) || 'MXN',
          netWorth: Number(profileData.net_worth) || 0,
          monthlyIncome: Number(profileData.monthly_income) || 0,
          firstMillionGoal: Number(profileData.first_million_goal) || 1000000,
          preferences: profileData.preferences || { aiNotifications: true, emailSummary: false }
        });
      }
      setIsProfileLoaded(true);

      // Envelopes
      const { data: envData } = await supabase.from('envelopes').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (envData) {
        setEnvelopes(envData.map(e => ({
          id: e.id,
          icon: e.icon,
          color: e.color,
          title: e.title,
          type: e.type,
          val: Number(e.val),
          tot: Number(e.tot),
          currency: e.currency as Currency,
          msg: e.msg,
          warn: e.warn,
          dueDate: e.due_date
        })));
      }

      // Accounts
      const { data: accData } = await supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (accData) {
        setAccounts(accData.map(a => ({
          id: a.id,
          name: a.name,
          balance: Number(a.balance),
          assetType: a.asset_type as AssetType,
          type: a.type as AccountType,
          apy: a.apy ? Number(a.apy) : undefined,
          color: a.color,
          label: a.label,
          subtitle: a.subtitle,
          lastUpdated: new Date(a.last_updated).toLocaleDateString()
        })));
      }
      setLoadingData(false);
    };

    loadData();
  }, [user]);

  // Derived Profile for UI (handles view conversions)
  const profile = useMemo(() => {
    if (baseProfile.currency === 'MXN') return baseProfile;

    return {
      ...baseProfile,
      monthlyIncome: baseProfile.monthlyIncome / exchangeRate,
      firstMillionGoal: baseProfile.firstMillionGoal / exchangeRate
    };
  }, [baseProfile, exchangeRate]);

  // 1. Cálculo del Ahorro Mensual (Ahora representa 'Disponible por Asignar' basado en valores reales)
  const calculatedMonthlySavings = useMemo(() => {
    // Calculamos todo en MXN primero (Base Logic)
    const totalEnvelopesCostMXN = envelopes.reduce((acc, env) => {
      let val = env.val; // Changed to use 'val' (assigned) instead of 'tot' (limit) as per user request
      if (env.currency === 'USD') val = val * exchangeRate;
      return acc + val;
    }, 0);

    const savingsMXN = Math.max(0, baseProfile.monthlyIncome - totalEnvelopesCostMXN);

    // Si la vista es USD, convertimos el resultado final
    if (baseProfile.currency === 'USD') {
      return savingsMXN / exchangeRate;
    }
    return savingsMXN;
  }, [baseProfile.monthlyIncome, baseProfile.currency, envelopes, exchangeRate]);

  // 2. Cálculo Dinámico del Patrimonio Neto
  const totalNetWorth = useMemo(() => {
    return accounts.reduce((total, acc) => {
      let balanceInUSD = 0;

      switch (acc.assetType) {
        case 'MXN':
          balanceInUSD = acc.balance / exchangeRate;
          break;
        case 'USD':
          balanceInUSD = acc.balance;
          break;
        case 'BTC':
          balanceInUSD = acc.balance * cryptoPrices.BTC;
          break;
        case 'ETH':
          balanceInUSD = acc.balance * cryptoPrices.ETH;
          break;
      }

      let finalValue = 0;
      if (profile.currency === 'MXN') {
        finalValue = balanceInUSD * exchangeRate;
      } else {
        finalValue = balanceInUSD;
      }

      return total + finalValue;
    }, 0);
  }, [accounts, profile.currency, exchangeRate, cryptoPrices]);

  // Update Profile (converts input back to MXN storage if needed)
  const updateProfile = async (data: Partial<UserProfile>) => {
    const isUSDMode = baseProfile.currency === 'USD';

    // Preparar datos para DB (siempre MXN)
    const contentToSave: Partial<UserProfile> = { ...data };

    if (isUSDMode) {
      if (data.monthlyIncome !== undefined) {
        contentToSave.monthlyIncome = data.monthlyIncome * exchangeRate;
      }
      if (data.firstMillionGoal !== undefined) {
        contentToSave.firstMillionGoal = data.firstMillionGoal * exchangeRate;
      }
    }

    setBaseProfile(prev => ({ ...prev, ...contentToSave }));

    if (user) {
      const dbData: any = {};

      // Update Name/Currency/Prefs normally
      if (contentToSave.name !== undefined) dbData.name = contentToSave.name;
      if (contentToSave.avatar !== undefined) dbData.avatar = contentToSave.avatar; // Save avatar
      if (contentToSave.currency !== undefined) dbData.currency = contentToSave.currency;
      if (contentToSave.preferences !== undefined) dbData.preferences = contentToSave.preferences;

      // Update Financials (Ensure they are the MXN values)
      if (contentToSave.monthlyIncome !== undefined) dbData.monthly_income = contentToSave.monthlyIncome;
      if (contentToSave.firstMillionGoal !== undefined) dbData.first_million_goal = contentToSave.firstMillionGoal;
      if (contentToSave.netWorth !== undefined) dbData.net_worth = contentToSave.netWorth;

      if (Object.keys(dbData).length > 0) {
        await supabase.from('profiles').upsert({
          id: user.id,
          ...dbData,
          updated_at: new Date().toISOString()
        });
      }
    }
  }

  // Update Envelope
  const updateEnvelope = async (id: string, data: Partial<Envelope>) => {
    setEnvelopes(prev => prev.map(env => env.id === id ? { ...env, ...data } : env));

    if (user) {
      const dbData: any = {};
      if (data.icon !== undefined) dbData.icon = data.icon;
      if (data.color !== undefined) dbData.color = data.color;
      if (data.title !== undefined) dbData.title = data.title;
      if (data.type !== undefined) dbData.type = data.type;
      if (data.val !== undefined) dbData.val = data.val;
      if (data.tot !== undefined) dbData.tot = data.tot;
      if (data.currency !== undefined) dbData.currency = data.currency;
      if (data.msg !== undefined) dbData.msg = data.msg;
      if (data.warn !== undefined) dbData.warn = data.warn;
      if (data.dueDate !== undefined) dbData.due_date = data.dueDate;

      await supabase.from('envelopes').update(dbData).eq('id', id);
    }
  };

  // Add Envelope
  const addEnvelope = async () => {
    if (!user) return;

    const newEnv = {
      user_id: user.id,
      icon: 'category',
      color: 'gray',
      title: 'Nuevo Sobre',
      type: 'General',
      val: 0,
      tot: 1000,
      currency: profile.currency, // Use derived 'profile' which is in scope
      msg: 'Recién creado',
    };

    const { data } = await supabase.from('envelopes').insert(newEnv).select().single();

    if (data) {
      setEnvelopes(prev => [...prev, {
        id: data.id,
        icon: data.icon,
        color: data.color,
        title: data.title,
        type: data.type,
        val: Number(data.val),
        tot: Number(data.tot),
        currency: data.currency as Currency,
        msg: data.msg,
        warn: data.warn,
        dueDate: data.due_date
      }]);
    }
  };

  // Delete Envelope
  const deleteEnvelope = async (id: string) => {
    setEnvelopes(prev => prev.filter(env => env.id !== id));
    if (user) {
      await supabase.from('envelopes').delete().eq('id', id);
    }
  };

  // Add Account
  const addAccount = async (accountData: Omit<Account, 'id' | 'lastUpdated'>) => {
    if (!user) return;

    const newAcc = {
      user_id: user.id,
      name: accountData.name,
      balance: accountData.balance,
      asset_type: accountData.assetType,
      type: accountData.type,
      apy: accountData.apy,
      color: accountData.color,
      label: accountData.label,
      subtitle: accountData.subtitle
    };

    const { data } = await supabase.from('accounts').insert(newAcc).select().single();

    if (data) {
      setAccounts(prev => [...prev, {
        id: data.id,
        name: data.name,
        balance: Number(data.balance),
        assetType: data.asset_type as AssetType,
        type: data.type as AccountType,
        apy: data.apy ? Number(data.apy) : undefined,
        color: data.color,
        label: data.label,
        subtitle: data.subtitle,
        lastUpdated: new Date(data.last_updated).toLocaleDateString()
      }]);
    }
  };

  // Update Account
  const updateAccount = async (id: string, data: Partial<Account>) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...data } : acc));

    if (user) {
      const dbData: any = {};
      if (data.name !== undefined) dbData.name = data.name;
      if (data.balance !== undefined) dbData.balance = data.balance;
      if (data.assetType !== undefined) dbData.asset_type = data.assetType;
      if (data.type !== undefined) dbData.type = data.type;
      if (data.apy !== undefined) dbData.apy = data.apy;
      if (data.color !== undefined) dbData.color = data.color;
      if (data.label !== undefined) dbData.label = data.label;
      if (data.subtitle !== undefined) dbData.subtitle = data.subtitle;

      dbData.last_updated = new Date().toISOString();

      await supabase.from('accounts').update(dbData).eq('id', id);
    }
  };

  // Delete Account
  const deleteAccount = async (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    if (user) {
      await supabase.from('accounts').delete().eq('id', id);
    }
  };

  // Toggle Currency
  const toggleCurrency = () => {
    const isToUSD = baseProfile.currency === 'MXN';
    updateProfile({ currency: isToUSD ? 'USD' : 'MXN' });
  };



  const formatCurrency = (amount: number, specificCurrency?: Currency) => {
    const currencyToUse = specificCurrency || profile.currency;
    return new Intl.NumberFormat(currencyToUse === 'MXN' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: currencyToUse,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppContext.Provider value={{
      profile, updateProfile, formatCurrency, toggleCurrency, exchangeRate, cryptoPrices,
      totalNetWorth, calculatedMonthlySavings,
      envelopes, updateEnvelope, addEnvelope, deleteEnvelope,
      accounts, addAccount, updateAccount, deleteAccount,
      loadingData, isProfileLoaded
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe usarse dentro de AppProvider");
  return context;
};