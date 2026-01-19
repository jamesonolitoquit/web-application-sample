import React, { useState } from 'react';
import { Expense } from '@/types/expense';

/**
 * Props for the ExpenseForm component.
 * @interface ExpenseFormProps
 */
interface ExpenseFormProps {
  /**
   * Callback function to handle adding a new expense.
   * @param {Omit<Expense, 'id'>} expense - The expense data without id.
   * @returns {void}
   */
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

/**
 * Component for adding new expenses.
 * @param {ExpenseFormProps} props - The props for the component.
 * @returns {JSX.Element} The rendered form component.
 */
const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<string>('');

  /**
   * Handles form submission to add a new expense.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date) return;

    onAddExpense({
      amount: parseFloat(amount),
      description,
      date,
      category: category || undefined,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Add Expense</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Category (Optional)</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;