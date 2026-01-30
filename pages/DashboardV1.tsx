import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Currency, AccountType, AssetType, Account } from '../types';
import { getInvestmentInsight } from '../services/geminiService';

const COLORS = {
    blue: { bg: 'bg-blue-500', bg50: 'bg-blue-50', bg900: 'dark:bg-blue-900/20', text600: 'text-blue-600', text400: 'dark:text-blue-400' },
    purple: { bg: 'bg-purple-500', bg50: 'bg-purple-50', bg900: 'dark:bg-purple-900/20', text600: 'text-purple-600', text400: 'dark:text-purple-400' },
    green: { bg: 'bg-green-500', bg50: 'bg-green-50', bg900: 'dark:bg-green-900/20', text600: 'text-green-600', text400: 'dark:text-green-400' },
    orange: { bg: 'bg-orange-500', bg50: 'bg-orange-50', bg900: 'dark:bg-orange-900/20', text600: 'text-orange-600', text400: 'dark:text-orange-400' },
    red: { bg: 'bg-red-500', bg50: 'bg-red-50', bg900: 'dark:bg-red-900/20', text600: 'text-red-600', text400: 'dark:text-red-400' },
    teal: { bg: 'bg-teal-500', bg50: 'bg-teal-50', bg900: 'dark:bg-teal-900/20', text600: 'text-teal-600', text400: 'dark:text-teal-400' },
    yellow: { bg: 'bg-yellow-500', bg50: 'bg-yellow-50', bg900: 'dark:bg-yellow-900/20', text600: 'text-yellow-600', text400: 'dark:text-yellow-400' },
    indigo: { bg: 'bg-indigo-500', bg50: 'bg-indigo-50', bg900: 'dark:bg-indigo-900/20', text600: 'text-indigo-600', text400: 'dark:text-indigo-400' },
    pink: { bg: 'bg-pink-500', bg50: 'bg-pink-50', bg900: 'dark:bg-pink-900/20', text600: 'text-pink-600', text400: 'dark:text-pink-400' },
    gray: { bg: 'bg-gray-500', bg50: 'bg-gray-50', bg900: 'dark:bg-gray-900/20', text600: 'text-gray-600', text400: 'dark:text-gray-400' },
};

type ColorKey = keyof typeof COLORS;


import { OnboardingModal } from '../components/OnboardingModal';

export const DashboardV1: React.FC = () => {
    const { profile, updateProfile, formatCurrency, toggleCurrency, envelopes, accounts, addAccount, updateAccount, deleteAccount, exchangeRate, cryptoPrices, totalNetWorth, calculatedMonthlySavings, loadingData, isProfileLoaded } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);

    // Edit Mode State for Accounts
    const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

    // New Account Form State
    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountBalance, setNewAccountBalance] = useState('');
    const [newAccountColor, setNewAccountColor] = useState('blue');
    const [newAccountLabel, setNewAccountLabel] = useState('B');
    const [newAccountType, setNewAccountType] = useState<AccountType>('Nomina');
    const [newAccountAsset, setNewAccountAsset] = useState<AssetType>('MXN');
    const [newAccountAPY, setNewAccountAPY] = useState('');

    // Descripciones de almacenamiento (Custodia)
    const [storageDescription, setStorageDescription] = useState('Disponible');
    const [customDescription, setCustomDescription] = useState('');

    // AI Insight State
    const [aiInsight, setAiInsight] = useState<string>("Analizando tu portafolio y el mercado...");
    const [loadingInsight, setLoadingInsight] = useState(false);

    // Generar Insight cuando cambian las cuentas o precios
    useEffect(() => {
        const fetchInsight = async () => {
            setLoadingInsight(true);
            // Resumen simple del portafolio para la IA
            const portfolioSummary = accounts.map(a => `${a.name}: ${a.balance} ${a.assetType} (${a.type})`).join('\n');

            const insight = await getInvestmentInsight(portfolioSummary, {
                usdRate: exchangeRate,
                btcUsd: cryptoPrices.BTC,
                ethUsd: cryptoPrices.ETH
            });
            setAiInsight(insight);
            setLoadingInsight(false);
        };

        if (accounts.length > 0) {
            fetchInsight();
        }
    }, [accounts.length, exchangeRate]);

    // Local state for income editing to prevent DB spam
    const [tempIncome, setTempIncome] = useState<string>('');

    useEffect(() => {
        setTempIncome(profile.monthlyIncome.toString());
    }, [profile.monthlyIncome]);

    // Handlers para editar valores directamente
    const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempIncome(e.target.value);
    };

    const saveIncome = () => {
        const val = Number(tempIncome);
        if (!isNaN(val)) {
            updateProfile({ monthlyIncome: val });
        }
        setIsEditing(false);
    };

    const handleStartEditAccount = (acc: Account) => {
        setEditingAccountId(acc.id);
        setNewAccountName(acc.name);
        setNewAccountBalance(acc.balance.toString());
        setNewAccountColor(acc.color);
        setNewAccountLabel(acc.label);
        setNewAccountType(acc.type);
        setNewAccountAsset(acc.assetType);
        setNewAccountAPY(acc.apy ? acc.apy.toString() : '');

        const options = getStorageOptions(acc.assetType);
        const isStandardOption = options.includes(acc.subtitle || '');

        if (isStandardOption) {
            setStorageDescription(acc.subtitle || 'Disponible');
            setCustomDescription('');
        } else {
            setStorageDescription('Otro');
            setCustomDescription(acc.subtitle || '');
        }
        setIsAccountsModalOpen(true);
    };

    const resetForm = () => {
        setEditingAccountId(null);
        setNewAccountName('');
        setNewAccountBalance('');
        setNewAccountAsset('MXN');
        setNewAccountType('Nomina');
        setNewAccountAPY('');
        setStorageDescription('Disponible');
        setCustomDescription('');
        setNewAccountLabel('B');
        setNewAccountColor('blue');
    };

    const handleAccountSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAccountName && newAccountBalance) {
            let finalSubtitle = storageDescription;
            if (storageDescription === 'Otro') finalSubtitle = customDescription;
            if (newAccountType === 'Nomina' && storageDescription === 'Disponible') finalSubtitle = 'Disponible (Nómina)';
            if (newAccountType === 'Inversion' && newAccountAPY && !finalSubtitle.includes('APY')) {
                finalSubtitle = `${finalSubtitle} • +${newAccountAPY}% APY`;
            }

            const accountData = {
                name: newAccountName,
                balance: Number(newAccountBalance),
                color: newAccountColor,
                label: newAccountLabel,
                assetType: newAccountAsset,
                type: newAccountType,
                apy: newAccountAPY ? Number(newAccountAPY) : undefined,
                subtitle: finalSubtitle
            };

            if (editingAccountId) {
                updateAccount(editingAccountId, accountData);
            } else {
                addAccount(accountData);
            }

            resetForm();
            setIsAccountsModalOpen(false); // Close modal on submit
        }
    };

    const getCryptoPriceInMXN = (tokenPriceInUSD: number) => {
        return tokenPriceInUSD * exchangeRate;
    };

    const getConvertedBalance = (acc: Account) => {
        let valInUSD = 0;
        switch (acc.assetType) {
            case 'BTC': valInUSD = acc.balance * cryptoPrices.BTC; break;
            case 'ETH': valInUSD = acc.balance * cryptoPrices.ETH; break;
            case 'MXN': valInUSD = acc.balance / exchangeRate; break;
            case 'USD': valInUSD = acc.balance; break;
        }
        if (profile.currency === 'MXN') return valInUSD * exchangeRate;
        return valInUSD;
    };

    const getStorageOptions = (asset: AssetType = newAccountAsset) => {
        if (asset === 'BTC' || asset === 'ETH') {
            return ["Cold Wallet (Ledger/Trezor)", "Hot Wallet (Metamask/Phantom)", "Exchange (Binance/Bitso)", "DeFi Protocol", "HODL", "Otro"];
        }
        return ["Disponible", "Cuenta de Ahorro", "Plazo Fijo", "CETES / Bonos", "Acciones / Bolsa", "Caja de Ahorro", "Bajo el colchón", "Otro"];
    };

    // Cálculos visuales para barras de progreso
    const goalProgress = Math.min((totalNetWorth / profile.firstMillionGoal) * 100, 100);
    const totalEnvelopesCost = profile.monthlyIncome - calculatedMonthlySavings;
    const envelopesProgress = Math.min((totalEnvelopesCost / profile.monthlyIncome) * 100, 100);

    return (
        <div className="flex-1 flex flex-col font-display">
            {/* Onboarding Modal */}
            {isProfileLoaded && (profile.monthlyIncome === 0 || profile.name === 'Usuario' || profile.name === 'User') && (
                <OnboardingModal onComplete={() => { /* State updates automatically via context */ }} />
            )}

            {/* --- HEADER --- */}
            <header className="px-4 py-6 md:px-6 lg:px-10 shrink-0 z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Hola, {profile.name.split(' ')[0]}</h2>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Aquí está tu resumen financiero de hoy.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Market Pills (Hidden on very small screens, visible on md) */}
                        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-700 pr-3">
                                <span className="material-symbols-outlined text-[16px] text-green-600">currency_exchange</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${exchangeRate.toFixed(2)} MXN</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-700 pr-3">
                                <span className="material-symbols-outlined text-[16px] text-orange-500">currency_bitcoin</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${(cryptoPrices.BTC / 1000).toFixed(1)}k USD</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-purple-500">token</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${cryptoPrices.ETH.toFixed(0)} USD</span>
                            </div>
                        </div>

                        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => profile.currency !== 'MXN' && toggleCurrency()}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.currency === 'MXN' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                MXN
                            </button>
                            <button
                                onClick={() => profile.currency !== 'USD' && toggleCurrency()}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${profile.currency === 'USD' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                USD
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-visible px-4 md:px-6 lg:px-10 pb-24">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* AI Insight Card */}
                    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-0.5 shadow-lg shadow-indigo-500/20">
                        <div className="bg-white dark:bg-surface-dark rounded-[14px] p-4 md:p-5 relative overflow-hidden group">
                            {/* Background Decorative Blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors"></div>

                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center relative z-10">
                                <div className="flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 animate-pulse">auto_awesome</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-2">
                                        Umbral AI Insight
                                        {loadingInsight && <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>}
                                    </h3>
                                    <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {aiInsight}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TOP ROW: NET WORTH & MONTHLY FLOW --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* 1. NET WORTH CARD */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                                        Patrimonio Neto
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mt-2">
                                        {formatCurrency(totalNetWorth)}
                                    </h3>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                            </div>

                            {/* Goal Progress Bar */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Progreso a Meta Principal</span>
                                    <span>{goalProgress.toFixed(1)}%</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-1000 ease-out relative"
                                        style={{ width: `${goalProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                                <div className="text-right text-[10px] text-slate-400 font-mono mt-1">
                                    Meta: {formatCurrency(profile.firstMillionGoal)}
                                </div>
                            </div>
                        </div>

                        {/* 2. MONTHLY FLOW CARD */}
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    Flujo Mensual
                                </span>
                                {isEditing ? (
                                    <button onClick={saveIncome} className="text-xs font-bold text-primary">Guardar</button>
                                ) : (
                                    <button onClick={() => { setTempIncome(profile.monthlyIncome.toString()); setIsEditing(true); }} className="text-xs font-bold text-slate-400 hover:text-primary">Editar Ingreso</button>
                                )}
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Income Input/Display */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Ingreso Neto</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={tempIncome}
                                                    onChange={handleIncomeChange}
                                                    onBlur={saveIncome}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveIncome()}
                                                    autoFocus
                                                    className="w-32 bg-slate-50 dark:bg-slate-800 border-none rounded py-0 px-2 text-lg font-bold focus:ring-1 focus:ring-primary"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(profile.monthlyIncome)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Connector */}
                                <div className="h-px w-full bg-slate-100 dark:bg-slate-800 relative flex justify-center">
                                    <span className="absolute -top-3 bg-white dark:bg-surface-dark px-2 text-slate-300">
                                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                    </span>
                                </div>

                                {/* Envelopes & Savings Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Envelopes Expenses */}
                                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                        <span className="text-[10px] font-bold uppercase text-slate-400">Asignado a Sobres</span>
                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                            {formatCurrency(totalEnvelopesCost)}
                                        </span>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                                            <div className={`h-full rounded-full ${envelopesProgress > 100 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${Math.min(envelopesProgress, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Available to Save */}
                                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                                        <span className="text-[10px] font-bold uppercase text-primary-dark">Disponible</span>
                                        <span className="text-lg font-bold text-primary">
                                            {formatCurrency(calculatedMonthlySavings)}
                                        </span>
                                        <div className="w-full bg-primary/20 h-1.5 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- ACCOUNTS SECTION --- */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">account_balance</span>
                                Cuentas & Activos
                            </h3>
                            <button
                                onClick={() => { resetForm(); setIsAccountsModalOpen(true); }}
                                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-slate-900/10"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_card</span>
                                <span className="hidden sm:inline">Agregar Cuenta</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {accounts.map((acc) => {
                                const convertedBalance = getConvertedBalance(acc);

                                return (
                                    <div key={acc.id} onClick={() => handleStartEditAccount(acc)} className="group bg-white dark:bg-surface-dark rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                                        {/* Color Tag */}
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${COLORS[acc.color as ColorKey]?.bg || COLORS['blue'].bg}`}></div>

                                        <div className="flex justify-between items-start mb-3 pl-3 pr-8">
                                            <div className={`w-10 h-10 rounded-xl ${COLORS[acc.color as ColorKey]?.bg50 || COLORS['blue'].bg50} ${COLORS[acc.color as ColorKey]?.bg900 || COLORS['blue'].bg900} flex items-center justify-center ${COLORS[acc.color as ColorKey]?.text600 || COLORS['blue'].text600} ${COLORS[acc.color as ColorKey]?.text400 || COLORS['blue'].text400} font-bold text-lg`}>
                                                {acc.label}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                    {acc.assetType}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pl-3">
                                            <h4 className="font-bold text-slate-700 dark:text-slate-200 truncate pr-4">{acc.name}</h4>
                                            <p className="text-xs text-slate-400 mb-3 truncate">{acc.subtitle}</p>

                                            <div className="flex flex-col">
                                                {/* Original Balance if not same currency */}
                                                {acc.assetType !== profile.currency && (
                                                    <span className="text-xs font-mono text-slate-400">
                                                        {acc.assetType === 'BTC' || acc.assetType === 'ETH' ? (
                                                            `${acc.balance} ${acc.assetType}`
                                                        ) : (
                                                            formatCurrency(acc.balance, acc.assetType as Currency)
                                                        )}
                                                    </span>
                                                )}
                                                {/* Converted Balance (Main Display) */}
                                                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                                    {formatCurrency(convertedBalance)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete Button (visible on hover) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteAccount(acc.id); }}
                                            className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                )
                            })}

                            {/* Empty State / Add New */}
                            {accounts.length === 0 && (
                                <div onClick={() => setIsAccountsModalOpen(true)} className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all min-h-[180px]">
                                    <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">account_balance_wallet</span>
                                    <p className="font-bold text-slate-500">No tienes cuentas</p>
                                    <p className="text-xs text-slate-400">Agrega una para ver tu patrimonio</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* --- ADD/EDIT ACCOUNT MODAL --- */}
            {isAccountsModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">
                                    {editingAccountId ? 'edit' : 'add_card'}
                                </span>
                                {editingAccountId ? 'Editar Cuenta' : 'Nueva Cuenta'}
                            </h3>
                            <button onClick={() => { setIsAccountsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Scrollable Form */}
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleAccountSubmit} className="flex flex-col gap-5">

                                {/* Tipo de Activo */}
                                <div className="grid grid-cols-4 gap-2">
                                    {['MXN', 'USD', 'BTC', 'ETH'].map(asset => (
                                        <button
                                            key={asset}
                                            type="button"
                                            onClick={() => { setNewAccountAsset(asset as AssetType); setStorageDescription('Disponible'); }}
                                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${newAccountAsset === asset ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                                        >
                                            {asset}
                                        </button>
                                    ))}
                                </div>

                                {/* Nombre y Etiqueta */}
                                <div className="flex gap-3">
                                    <div className="w-16 flex-shrink-0">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Icono</label>
                                        <input
                                            type="text"
                                            maxLength={1}
                                            value={newAccountLabel}
                                            onChange={(e) => setNewAccountLabel(e.target.value.toUpperCase())}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-0 text-center py-3 font-bold text-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase placeholder-slate-300"
                                            placeholder="B"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Nombre de la Institución / Wallet</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAccountName}
                                            onChange={(e) => setNewAccountName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400"
                                            placeholder={newAccountAsset === 'BTC' ? "Ledger Nano X" : "BBVA"}
                                        />
                                    </div>
                                </div>

                                {/* Balance */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Saldo Actual</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                            {newAccountAsset === 'BTC' ? '₿' : newAccountAsset === 'ETH' ? 'Ξ' : '$'}
                                        </span>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={newAccountBalance}
                                            onChange={(e) => setNewAccountBalance(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 font-mono font-bold text-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Clasificación (Nómina vs Inversión) */}
                                <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accType"
                                            checked={newAccountType === 'Nomina'}
                                            onChange={() => setNewAccountType('Nomina')}
                                            className="text-primary focus:ring-primary bg-white dark:bg-slate-900 border-slate-300"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Liquidez / Nómina</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accType"
                                            checked={newAccountType === 'Inversion'}
                                            onChange={() => setNewAccountType('Inversion')}
                                            className="text-primary focus:ring-primary bg-white dark:bg-slate-900 border-slate-300"
                                        />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Ahorro / Inversión</span>
                                    </label>
                                </div>

                                {/* Detalles de Inversión / Custodia */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Ubicación / Tipo</label>
                                        <select
                                            value={storageDescription}
                                            onChange={(e) => setStorageDescription(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                                        >
                                            {getStorageOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>

                                    {/* Campo condicional: APY o Descripción Personalizada */}
                                    {storageDescription === 'Otro' ? (
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Especifique</label>
                                            <input
                                                type="text"
                                                value={customDescription}
                                                onChange={(e) => setCustomDescription(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                                                placeholder="Ej. Préstamo"
                                            />
                                        </div>
                                    ) : newAccountType === 'Inversion' && (newAccountAsset === 'MXN' || newAccountAsset === 'USD') ? (
                                        <div>
                                            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Rendimiento Anual (%)</label>
                                            <input
                                                type="number"
                                                value={newAccountAPY}
                                                onChange={(e) => setNewAccountAPY(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                                                placeholder="Ej. 11.00"
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                {/* Color Picker */}
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Color Identificador</label>
                                    <div className="flex gap-3 overflow-x-auto p-3">
                                        <div className="flex gap-3 overflow-x-auto p-3">
                                            {(Object.keys(COLORS) as ColorKey[]).map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setNewAccountColor(color)}
                                                    className={`w-8 h-8 rounded-full flex-shrink-0 ${COLORS[color].bg} transition-all ${newAccountColor === color ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-40 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-slate-900 dark:bg-primary text-white dark:text-slate-900 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all mt-2">
                                    {editingAccountId ? 'Guardar Cambios' : 'Crear Cuenta'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};