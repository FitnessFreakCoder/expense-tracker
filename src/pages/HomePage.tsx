import React from 'react';
import { Layout } from '../components/layout/Layout';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { IncomeVsExpenseChart } from '../components/dashboard/IncomeVsExpenseChart';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { Button } from '../components/ui/Button';
import { Plus, RefreshCw } from 'lucide-react';
import { useTransactions } from '../context/TransactionContext';

export const HomePage: React.FC = () => {
  const { fetchTransactions } = useTransactions();
  const [isAddingTransaction, setIsAddingTransaction] = React.useState(false);
  
  const handleRefresh = () => {
    fetchTransactions();
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your financial activities
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            leftIcon={<RefreshCw size={16} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsAddingTransaction(true)}
          >
            Add Transaction
          </Button>
        </div>
      </div>
      
      {isAddingTransaction ? (
        <TransactionForm 
          onCancel={() => setIsAddingTransaction(false)}
          onSuccess={() => setIsAddingTransaction(false)}
        />
      ) : (
        <>
          <div className="mb-6">
            <DashboardStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RecentTransactions />
            <ExpenseChart />
          </div>
          
          <div className="mb-6">
            <IncomeVsExpenseChart />
          </div>
        </>
      )}
    </Layout>
  );
};