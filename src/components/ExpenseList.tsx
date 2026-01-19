import React from 'react';
import { Expense } from '@/types/expense';

/**
 * Props for the ExpenseList component.
 * @interface ExpenseListProps
 */
interface ExpenseListProps {
  /**
   * Array of expenses to display.
   * @type {Expense[]}
   */
  expenses: Expense[];

  /**
   * Callback function to handle deleting an expense.
   * @param {string} id - The id of the expense to delete.
   * @returns {void}
   */
  onDeleteExpense: (id: string) => void;
}

/**
 * Component for displaying a list of expenses.
 * @param {ExpenseListProps} props - The props for the component.
 * @returns {JSX.Element} The rendered list component.
 */
const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No expenses yet.</p>
      ) : (
        <ul className="space-y-2">
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{expense.description}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  ${expense.amount.toFixed(2)} - {new Date(expense.date).toLocaleDateString()}
                  {expense.category && ` - ${expense.category}`}
                </p>
              </div>
              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;