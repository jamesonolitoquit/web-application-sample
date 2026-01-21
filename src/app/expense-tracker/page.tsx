'use client';

import React, { useState, useEffect } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Summary from '@/components/Summary';
import { Expense } from '@/types/expense';
import Link from 'next/link';

/**
 * Expense Tracker page component.
 * @returns {JSX.Element} The rendered page.
 */
export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      // Load example data if no stored expenses
      loadExampleData();
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  /**
   * Loads example expense data for demonstration.
   */
  const loadExampleData = () => {
    const exampleExpenses: Expense[] = [
      {
        id: '1',
        amount: 45.99,
        description: 'Grocery shopping',
        category: 'Food',
        date: new Date('2024-01-15').toISOString().split('T')[0]
      },
      {
        id: '2',
        amount: 12.50,
        description: 'Coffee and pastry',
        category: 'Food',
        date: new Date('2024-01-14').toISOString().split('T')[0]
      },
      {
        id: '3',
        amount: 89.99,
        description: 'Gas station',
        category: 'Transportation',
        date: new Date('2024-01-13').toISOString().split('T')[0]
      },
      {
        id: '4',
        amount: 25.00,
        description: 'Movie tickets',
        category: 'Entertainment',
        date: new Date('2024-01-12').toISOString().split('T')[0]
      }
    ];
    setExpenses(exampleExpenses);
  };

  /**
   * Adds a new expense to the list.
   * @param {Omit<Expense, 'id'>} expenseData - The expense data without id.
   */
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  /**
   * Deletes an expense by id.
   * @param {string} id - The id of the expense to delete.
   */
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-800 mt-2 font-medium">Track your daily expenses with ease</p>
        </header>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={loadExampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Example Data
          </button>
        </div>

        <Summary expenses={expenses} />
        <ExpenseForm onAddExpense={addExpense} />
        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Expense Tracker</h2>
          <p className="text-gray-800 leading-relaxed">
            Welcome to the Expense Tracker! This application helps you manage your personal finances by tracking daily expenses.
            Easily add, view, and delete expenses with persistent storage that works offline. Features include categorization,
            date tracking, and summary calculations to help you stay on top of your spending habits.
          </p>
        </div>
      </div>
    </div>
  );
}