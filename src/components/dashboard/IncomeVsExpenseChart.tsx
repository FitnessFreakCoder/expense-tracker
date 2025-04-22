import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export const IncomeVsExpenseChart: React.FC = () => {
  const { state } = useTransactions();
  const { filteredTransactions } = state;
  
  const monthlyData = useMemo(() => {
    // Get the last 6 months
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      return {
        name: format(date, 'MMM yyyy'),
        start: monthStart,
        end: monthEnd,
      };
    }).reverse();
    
    // Calculate income and expense for each month
    return months.map(month => {
      const monthTransactions = filteredTransactions.filter(
        t => new Date(t.date) >= month.start && new Date(t.date) <= month.end
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: month.name,
        income,
        expense,
        balance: income - expense,
      };
    });
  }, [filteredTransactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex justify-between">
              <span style={{ color: entry.color }} className="font-medium mr-4">
                {entry.name}:
              </span>
              <span style={{ color: entry.color }} className="font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          {payload.length >= 2 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Balance:</span>
                <span className={`font-medium ${
                  payload[0].value - payload[1].value >= 0 
                    ? 'text-success-500' 
                    : 'text-danger-500'
                }`}>
                  {formatCurrency(payload[0].value - payload[1].value)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {monthlyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};