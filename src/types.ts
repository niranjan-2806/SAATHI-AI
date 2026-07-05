export type PersonaType = 'student' | 'professional' | 'senior';
export type LanguageType = 'en' | 'hi' | 'ta' | 'te';

export interface FinancialHealthBreakdown {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: 'bike' | 'education' | 'emergency' | 'general';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  completed: boolean;
}

export interface NextBestAction {
  id: string;
  title: string;
  description: string;
  actionText: string;
  category: 'investment' | 'insurance' | 'upi' | 'security' | 'bills';
  whyReason: string;
  triggerType: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'salary' | 'dining' | 'groceries' | 'fees' | 'upi' | 'rent' | 'investment' | 'insurance' | 'travel';
  isUnusual?: boolean;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  type: 'health' | 'travel' | 'accident' | 'life';
  coverage: number;
  premium: number;
  expiry: string;
  status: 'active' | 'expired' | 'pending';
}

export interface UserProfile {
  name: string;
  avatar: string;
  accountNo: string;
  balance: number;
  branch: string;
  financialScore: number;
  scoreExplanation: string;
  healthBreakdown: FinancialHealthBreakdown;
  goals: Goal[];
  badges: Badge[];
  actions: NextBestAction[];
  transactions: Transaction[];
  policies: InsurancePolicy[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saarthi';
  text: string;
  timestamp: string;
  actions?: Array<{ label: string; payload: string }>;
}
