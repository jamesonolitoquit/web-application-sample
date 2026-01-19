'use client';

import React, { useState, useEffect } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import Summary from '@/components/Summary';
import ThemeToggle from '@/components/ThemeToggle';
import { Expense } from '@/types/expense';

/**
 * Main page component for the Expense Tracker app.
 * @returns {JSX.Element} The rendered page.
 */
export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
          <p className="text-gray-800 dark:text-gray-200 mt-2 font-medium">Sample Website - Designed by Jameson A. Olitoquit</p>
        </header>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About This App</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to the Expense Tracker! This application helps you manage your personal finances by tracking daily expenses.
            Easily add, view, and delete expenses with persistent storage that works offline. Features include categorization,
            date tracking, and summary calculations to help you stay on top of your spending habits.
          </p>
        </div>
        <Summary expenses={expenses} />
        <ExpenseForm onAddExpense={addExpense} />
        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
      </div>
    </div>
  );
}
