import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TransactionsState, Transaction, FilterOptions, Category } from '../types';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Define action types
type TransactionAction =
  | { type: 'FETCH_TRANSACTIONS_START' }
  | { type: 'FETCH_TRANSACTIONS_SUCCESS'; payload: Transaction[] }
  | { type: 'FETCH_TRANSACTIONS_FAILURE'; payload: string }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
  | { type: 'ADD_TRANSACTION_SUCCESS'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION_SUCCESS'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION_SUCCESS'; payload: number }
  | { type: 'FILTER_TRANSACTIONS'; payload: FilterOptions }
  | { type: 'CLEAR_FILTERS' };

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', color: '#10B981' },
  { id: '2', name: 'Bonus', type: 'income', color: '#3B82F6' },
  { id: '3', name: 'Investments', type: 'income', color: '#8B5CF6' },
  { id: '4', name: 'Other Income', type: 'income', color: '#EC4899' },
  { id: '5', name: 'Food', type: 'expense', color: '#EF4444' },
  { id: '6', name: 'Transport', type: 'expense', color: '#F59E0B' },
  { id: '7', name: 'Housing', type: 'expense', color: '#6366F1' },
  { id: '8', name: 'Entertainment', type: 'expense', color: '#8B5CF6' },
  { id: '9', name: 'Shopping', type: 'expense', color: '#EC4899' },
  { id: '10', name: 'Utilities', type: 'expense', color: '#14B8A6' },
  { id: '11', name: 'Health', type: 'expense', color: '#10B981' },
  { id: '12', name: 'Education', type: 'expense', color: '#3B82F6' },
  { id: '13', name: 'Other', type: 'expense', color: '#6B7280' },
];

// Define initial state
const initialState: TransactionsState = {
  transactions: [],
  filteredTransactions: [],
  categories: defaultCategories,
  isLoading: false,
  error: null,
};

// Create context
const TransactionContext = createContext<{
  state: TransactionsState;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => Promise<void>;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  filterTransactions: (options: FilterOptions) => void;
  clearFilters: () => void;
}>({
  state: initialState,
  fetchTransactions: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  filterTransactions: () => {},
  clearFilters: () => {},
});

// Create reducer
const transactionReducer = (state: TransactionsState, action: TransactionAction): TransactionsState => {
  switch (action.type) {
    case 'FETCH_TRANSACTIONS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_TRANSACTIONS_SUCCESS':
      return {
        ...state,
        transactions: action.payload,
        filteredTransactions: action.payload,
        isLoading: false,
      };
    case 'FETCH_TRANSACTIONS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'FETCH_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload,
      };
    case 'ADD_TRANSACTION_SUCCESS':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        filteredTransactions: [...state.transactions, action.payload],
      };
    case 'UPDATE_TRANSACTION_SUCCESS':
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
        filteredTransactions: state.filteredTransactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION_SUCCESS':
      return {
        ...state,
        transactions: state.transactions.filter((transaction) => transaction.id !== action.payload),
        filteredTransactions: state.filteredTransactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case 'FILTER_TRANSACTIONS': {
      const { startDate, endDate, type, category, minAmount, maxAmount, searchTerm } = action.payload;
      
      let filtered = [...state.transactions];
      
      if (startDate) {
        filtered = filtered.filter((t) => new Date(t.date) >= new Date(startDate));
      }
      
      if (endDate) {
        filtered = filtered.filter((t) => new Date(t.date) <= new Date(endDate));
      }
      
      if (type && type !== 'all') {
        filtered = filtered.filter((t) => t.type === type);
      }
      
      if (category) {
        filtered = filtered.filter((t) => t.category === category);
      }
      
      if (minAmount !== undefined) {
        filtered = filtered.filter((t) => t.amount >= minAmount);
      }
      
      if (maxAmount !== undefined) {
        filtered = filtered.filter((t) => t.amount <= maxAmount);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (t) => t.description.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
        );
      }
      
      return {
        ...state,
        filteredTransactions: filtered,
      };
    }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filteredTransactions: state.transactions,
      };
    default:
      return state;
  }
};

// Create provider component
export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { state: authState } = useAuth();

  // Fetch transactions when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchTransactions();
    }
  }, [authState.isAuthenticated]);

  // Fetch all transactions
  const fetchTransactions = async () => {
    dispatch({ type: 'FETCH_TRANSACTIONS_START' });
    try {
      const res = await axios.get('/api/transactions');
      dispatch({
        type: 'FETCH_TRANSACTIONS_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'FETCH_TRANSACTIONS_FAILURE',
        payload: err instanceof Error ? err.message : 'Failed to fetch transactions',
      });
    }
  };

  // Add new transaction
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      const res = await axios.post('/api/transactions', transaction);
      dispatch({
        type: 'ADD_TRANSACTION_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  // Update transaction
  const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
    try {
      const res = await axios.put(`/api/transactions/${id}`, transaction);
      dispatch({
        type: 'UPDATE_TRANSACTION_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      dispatch({
        type: 'DELETE_TRANSACTION_SUCCESS',
        payload: id,
      });
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  // Filter transactions
  const filterTransactions = (options: FilterOptions) => {
    dispatch({ type: 'FILTER_TRANSACTIONS', payload: options });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filterTransactions,
        clearFilters,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);