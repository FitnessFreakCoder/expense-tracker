import React, { useState } from 'react';
import { format } from 'date-fns';
import { Transaction } from '../../types';
import { useTransactions } from '../../context/TransactionContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Edit, Trash2, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { FilterPanel } from './FilterPanel';

export const TransactionList: React.FC = () => {
  const { state, deleteTransaction } = useTransactions();
  const { filteredTransactions, categories } = state;
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const toggleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };
  
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortColumn === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortColumn === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortColumn === 'category' || sortColumn === 'description') {
      return sortDirection === 'asc'
        ? a[sortColumn].localeCompare(b[sortColumn])
        : b[sortColumn].localeCompare(a[sortColumn]);
    } else if (sortColumn === 'type') {
      return sortDirection === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    return 0;
  });
  
  const getTypeColor = (type: string, category: string) => {
    if (type === 'income') {
      return 'text-success-500 bg-success-50 dark:text-success-400 dark:bg-success-900/30';
    } else {
      return 'text-danger-500 bg-danger-50 dark:text-danger-400 dark:bg-danger-900/30';
    }
  };
  
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
    <div>
      {editingTransaction ? (
        <TransactionForm 
          transaction={editingTransaction}
          onCancel={() => setEditingTransaction(null)}
          onSuccess={() => setEditingTransaction(null)}
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle>Transactions</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                leftIcon={<Filter size={14} />}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                Filter
              </Button>
            </div>
          </CardHeader>
          
          {isFilterOpen && (
            <div className="px-6 pb-4">
              <FilterPanel onClose={() => setIsFilterOpen(false)} />
            </div>
          )}
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('date')}>
                      <div className="flex items-center">
                        Date
                        {sortColumn === 'date' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('type')}>
                      <div className="flex items-center">
                        Type
                        {sortColumn === 'type' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('amount')}>
                      <div className="flex items-center">
                        Amount
                        {sortColumn === 'amount' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('category')}>
                      <div className="flex items-center">
                        Category
                        {sortColumn === 'category' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('description')}>
                      <div className="flex items-center">
                        Description
                        {sortColumn === 'description' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.length === 0 ? (
                    <tr className="bg-white dark:bg-gray-800">
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    sortedTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id} 
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getTypeColor(transaction.type, transaction.category)
                          }`}>
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 font-medium ${
                          transaction.type === 'income' 
                            ? 'text-success-500 dark:text-success-400' 
                            : 'text-danger-500 dark:text-danger-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: getCategoryColor(transaction.category) }}
                            ></span>
                            {transaction.category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingTransaction(transaction)}
                              className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction.id)}
                              className="text-danger-500 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};