import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const RecentTransactions: React.FC = () => {
  const { state } = useTransactions();
  const { filteredTransactions, categories } = state;
  
  // Get the 5 most recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6B7280';
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link to="/transactions">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p>No transactions found</p>
            <p className="text-sm mt-1">Add some transactions to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center">
                  <div 
                    className={`p-2 rounded-full mr-4 ${
                      transaction.type === 'income' 
                        ? 'bg-success-100 text-success-600 dark:bg-success-900/50 dark:text-success-400' 
                        : 'bg-danger-100 text-danger-600 dark:bg-danger-900/50 dark:text-danger-400'
                    }`}
                  >
                    {transaction.type === 'income' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                      <div className="mx-2 w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex items-center">
                        <span 
                          className="w-2 h-2 rounded-full mr-1" 
                          style={{ backgroundColor: getCategoryColor(transaction.category) }}
                        ></span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-danger-600 dark:text-danger-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};