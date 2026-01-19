import React from 'react';
import { Expense } from '@/types/expense';

/**
 * Props for the Summary component.
 * @interface SummaryProps
 */
interface SummaryProps {
  /**
   * Array of expenses to summarize.
   * @type {Expense[]}
   */
  expenses: Expense[];
}

/**
 * Component for displaying a summary of expenses.
 * @param {SummaryProps} props - The props for the component.
 * @returns {JSX.Element} The rendered summary component.
 */
const Summary: React.FC<SummaryProps> = ({ expenses }) => {
  /**
   * Calculates the total amount of all expenses.
   * @returns {number} The total amount.
   */
  const getTotal = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const total = getTotal();

  return (
    <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Summary</h2>
      <p className="text-lg text-gray-800 dark:text-gray-200">Total Expenses: <span className="font-semibold text-gray-900 dark:text-white">${total.toFixed(2)}</span></p>
      <p className="text-gray-800 dark:text-gray-200">Number of Expenses: {expenses.length}</p>
    </div>
  );
};

export default Summary;