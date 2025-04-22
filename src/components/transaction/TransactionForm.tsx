import React from 'react';
import { useForm } from 'react-hook-form';
import { Transaction, Category } from '../../types';
import { useTransactions } from '../../context/TransactionContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { CalendarIcon, DollarSign, Tag, FileText } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  onCancel: () => void;
  onSuccess: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  transaction, 
  onCancel,
  onSuccess
}) => {
  const { state, addTransaction, updateTransaction } = useTransactions();
  const { categories } = state;
  
  const isEditMode = !!transaction;
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Transaction, 'id' | 'userId'>>({
    defaultValues: transaction 
      ? { 
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
        }
      : {
          amount: 0,
          type: 'expense',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        }
  });
  
  const watchType = watch('type');
  
  const filteredCategories = categories.filter(category => category.type === watchType);
  
  const onSubmit = async (data: Omit<Transaction, 'id' | 'userId'>) => {
    try {
      if (isEditMode && transaction) {
        await updateTransaction(transaction.id, data);
      } else {
        await addTransaction(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Transaction form error:', error);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                  watchType === 'income' 
                    ? 'bg-success-100 border-success-500 text-success-700 dark:bg-success-900 dark:text-success-300' 
                    : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                }`}>
                  <input 
                    type="radio" 
                    value="income" 
                    className="sr-only" 
                    {...register('type', { required: 'Type is required' })}
                  />
                  <DollarSign size={16} className="mr-1" />
                  Income
                </label>
                <label className={`flex items-center justify-center p-2 border rounded-md cursor-pointer ${
                  watchType === 'expense' 
                    ? 'bg-danger-100 border-danger-500 text-danger-700 dark:bg-danger-900 dark:text-danger-300' 
                    : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                }`}>
                  <input 
                    type="radio" 
                    value="expense" 
                    className="sr-only" 
                    {...register('type', { required: 'Type is required' })}
                  />
                  <DollarSign size={16} className="mr-1" />
                  Expense
                </label>
              </div>
              {errors.type && (
                <p className="mt-1 text-xs text-danger-500">{errors.type.message}</p>
              )}
            </div>
            <div className="flex-1">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                leftIcon={<DollarSign size={16} />}
                error={errors.amount?.message}
                fullWidth
                {...register('amount', {
                  required: 'Amount is required',
                  min: {
                    value: 0.01,
                    message: 'Amount must be greater than 0',
                  },
                })}
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full py-2 pl-10 pr-4 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select a category</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                <Tag size={16} />
              </div>
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-danger-500">{errors.category.message}</p>
            )}
          </div>
          
          <Input
            label="Date"
            type="date"
            leftIcon={<CalendarIcon size={16} />}
            error={errors.date?.message}
            fullWidth
            {...register('date', { required: 'Date is required' })}
          />
          
          <Input
            label="Description"
            leftIcon={<FileText size={16} />}
            error={errors.description?.message}
            fullWidth
            {...register('description', {
              required: 'Description is required',
              minLength: {
                value: 3,
                message: 'Description must be at least 3 characters',
              },
            })}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            variant={watchType === 'income' ? 'success' : 'primary'}
            type="submit"
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Update' : 'Add'} {watchType === 'income' ? 'Income' : 'Expense'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};