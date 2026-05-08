export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  isEmailVerified: boolean;
  settings?: Settings;
  createdAt: string;
}

export interface Settings {
  theme: string;
  currency: string;
  notificationEmail: boolean;
  notificationPush: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  user?: User;
  data?: {
    user: User;
  };
}

export interface Transaction {
  id: string;
  amount: string | number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  date: string;
  note?: string;
  paymentMethod?: string;
  recurring: boolean;
  recurringType?: string;
  tags: string[];
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Budget {
  id: string;
  category: string;
  limit: string | number;
  period: string;
  startDate: string;
  endDate: string;
  spent?: number;
  remaining?: number;
  usagePercentage?: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: string | number;
  currentAmount: string | number;
  deadline?: string;
  category?: string;
  icon?: string;
  status: string;
  progressPercentage?: number;
}

export interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  actionableUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  charts: any;
  insights: Insight[];
  recentTransactions: Transaction[];
  goals: Goal[];
}

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  spendingRatio: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
