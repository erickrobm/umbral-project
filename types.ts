export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Envelope {
  id: string;
  icon: string;
  color: string;
  title: string;
  type: string;
  val: number;
  tot: number;
  currency: Currency; // Moneda específica del sobre (MXN o USD)
  msg: string;
  warn?: boolean;
  dueDate?: string; // Format: YYYY-MM-DD
}

export type AccountType = 'Nomina' | 'Inversion';
export type AssetType = 'MXN' | 'USD' | 'BTC' | 'ETH'; // Los activos posibles

export interface Account {
  id: string;
  name: string;
  balance: number; 
  assetType: AssetType; // Replaces currency/cryptoToken logic
  type: AccountType;
  apy?: number; // Annual Percentage Yield
  color: string;
  label: string; // Initials or Icon char
  subtitle?: string; // Description: Storage type, "Disponible", etc.
  lastUpdated: string;
}

export interface Goal {
  icon: string;
  color: string;
  title: string;
  targetYear: string;
  status: string;
  statusColor?: string;
  saved: number;
  targetAmount: number;
  isFocused?: boolean;
}

export type Currency = 'MXN' | 'USD'; // For Profile and Envelopes (Fiat only)

export interface UserPreferences {
  aiNotifications: boolean;
  emailSummary: boolean;
}

export interface UserProfile {
  name: string;
  avatar?: string; // Base64 or URL
  currency: Currency;
  netWorth: number; // Calculated dynamically
  monthlyIncome: number;
  // monthlySavings is now calculated derived from Income - Envelopes
  firstMillionGoal: number;
  preferences?: UserPreferences;
}