export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  userId: number;
}

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
};

export interface TransactionsState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense' | 'all';
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  categoryTotals: {
    category: string;
    total: number;
    color: string;
  }[];
}