import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { TransactionList } from '../components/transaction/TransactionList';
import { TransactionForm } from '../components/transaction/TransactionForm';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your income and expenses
          </p>
        </div>
        <Button 
          leftIcon={<Plus size={16} />}
          onClick={() => setIsAddingTransaction(true)}
        >
          Add Transaction
        </Button>
      </div>
      
      {isAddingTransaction ? (
        <TransactionForm 
          onCancel={() => setIsAddingTransaction(false)}
          onSuccess={() => setIsAddingTransaction(false)}
        />
      ) : (
        <TransactionList />
      )}
    </Layout>
  );
};