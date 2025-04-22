import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { FilterOptions } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, RefreshCw } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { state, filterTransactions, clearFilters } = useTransactions();
  const { categories } = state;
  
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: '',
    endDate: '',
    type: 'all',
    category: '',
    minAmount: undefined,
    maxAmount: undefined,
    searchTerm: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'minAmount' || name === 'maxAmount') {
      parsedValue = value === '' ? undefined : parseFloat(value);
    }
    
    setFilters((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    filterTransactions(filters);
    onClose();
  };
  
  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      category: '',
      minAmount: undefined,
      maxAmount: undefined,
      searchTerm: '',
    });
    clearFilters();
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <Input
            label="End Date"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            label="Min Amount"
            type="number"
            name="minAmount"
            value={filters.minAmount === undefined ? '' : filters.minAmount}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <Input
            label="Max Amount"
            type="number"
            name="maxAmount"
            value={filters.maxAmount === undefined ? '' : filters.maxAmount}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <Input
          label="Search"
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleChange}
          placeholder="Search by description or category"
          leftIcon={<Search size={16} />}
        />
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          leftIcon={<RefreshCw size={16} />}
        >
          Reset
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
};