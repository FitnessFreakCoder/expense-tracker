import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const DashboardStats: React.FC = () => {
  const { state } = useTransactions();
  const { filteredTransactions } = state;
  
  const stats = useMemo(() => {
    // Calculate total income, expense, and balance
    let totalIncome = 0;
    let totalExpense = 0;
    
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });
    
    const balance = totalIncome - totalExpense;
    
    // Get current date for showing month summary
    const currentMonth = format(new Date(), 'MMMM yyyy');
    
    return {
      balance,
      totalIncome,
      totalExpense,
      currentMonth,
    };
  }, [filteredTransactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-primary-50 to-white dark:from-primary-900/50 dark:to-gray-800 dark:text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</p>
              <h3 className={`mt-2 text-2xl font-bold ${
                stats.balance >= 0 
                  ? 'text-success-600 dark:text-success-400' 
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                {formatCurrency(stats.balance)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${
              stats.balance >= 0 
                ? 'bg-success-100 text-success-600 dark:bg-success-900/50 dark:text-success-400' 
                : 'bg-danger-100 text-danger-600 dark:bg-danger-900/50 dark:text-danger-400'
            }`}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            <span>As of {format(new Date(), 'MMM dd, yyyy')}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-success-50 to-white dark:from-success-900/50 dark:to-gray-800 dark:text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
              <h3 className="mt-2 text-2xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(stats.totalIncome)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-success-100 text-success-600 dark:bg-success-900/50 dark:text-success-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            <span>For {stats.currentMonth}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-danger-50 to-white dark:from-danger-900/50 dark:to-gray-800 dark:text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
              <h3 className="mt-2 text-2xl font-bold text-danger-600 dark:text-danger-400">
                {formatCurrency(stats.totalExpense)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-danger-100 text-danger-600 dark:bg-danger-900/50 dark:text-danger-400">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            <span>For {stats.currentMonth}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-warning-50 to-white dark:from-warning-900/50 dark:to-gray-800 dark:text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</p>
              <h3 className="mt-2 text-2xl font-bold text-warning-600 dark:text-warning-400">
                {stats.totalIncome > 0 
                  ? `${Math.round((stats.balance / stats.totalIncome) * 100)}%` 
                  : '0%'}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-warning-100 text-warning-600 dark:bg-warning-900/50 dark:text-warning-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            <span>For {stats.currentMonth}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};