import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useTransactions } from '../../context/TransactionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const ExpenseChart: React.FC = () => {
  const { state } = useTransactions();
  const { filteredTransactions, categories } = state;
  
  const expenseData = useMemo(() => {
    // Get all expense transactions
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    // Group expenses by category and sum up amounts
    const categoryMap = new Map<string, { total: number; color: string }>();
    
    expenses.forEach(expense => {
      const category = expense.category;
      const categoryObj = categoryMap.get(category);
      const categoryColor = categories.find(c => c.name === category)?.color || '#6B7280';
      
      if (categoryObj) {
        categoryObj.total += expense.amount;
      } else {
        categoryMap.set(category, { total: expense.amount, color: categoryColor });
      }
    });
    
    // Convert map to array format needed for the chart
    return Array.from(categoryMap.entries()).map(([name, { total, color }]) => ({
      name,
      value: total,
      color,
    }));
  }, [filteredTransactions, categories]);
  
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary-500 font-medium">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {Math.round((data.value / totalExpenses) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {expenseData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No expense data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};