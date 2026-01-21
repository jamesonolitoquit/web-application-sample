'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
}

export default function SavingsGoalTracker() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    monthlyContribution: ''
  });

  // Load goals from localStorage on mount
  useEffect(() => {
    const storedGoals = localStorage.getItem('savingsGoals');
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      // Load example data if no stored goals
      loadExampleData();
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  /**
   * Loads example savings goals for demonstration.
   */
  const loadExampleData = () => {
    const exampleGoals: SavingsGoal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 2500,
        targetDate: '2025-12-31',
        monthlyContribution: 500
      },
      {
        id: '2',
        name: 'Vacation to Europe',
        targetAmount: 5000,
        currentAmount: 1200,
        targetDate: '2025-06-15',
        monthlyContribution: 300
      },
      {
        id: '3',
        name: 'New Car Down Payment',
        targetAmount: 8000,
        currentAmount: 3200,
        targetDate: '2025-09-01',
        monthlyContribution: 400
      }
    ];
    setGoals(exampleGoals);
  };

  /**
   * Adds a new savings goal.
   */
  const addGoal = () => {
    if (!newGoal.name.trim() || !newGoal.targetAmount || !newGoal.targetDate) return;

    const goal: SavingsGoal = {
      id: Date.now().toString(),
      name: newGoal.name.trim(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate,
      monthlyContribution: parseFloat(newGoal.monthlyContribution) || 0
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      monthlyContribution: ''
    });
  };

  /**
   * Updates the current amount for a savings goal.
   */
  const updateCurrentAmount = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, currentAmount: amount } : goal
      )
    );
  };

  /**
   * Deletes a savings goal.
   */
  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  /**
   * Calculates progress and time remaining for a goal.
   */
  const calculateGoalStats = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const monthsRemaining = Math.ceil(daysRemaining / 30);

    // Calculate required monthly contribution to reach goal
    const requiredMonthly = remaining / monthsRemaining;

    return {
      progress: Math.min(progress, 100),
      remaining,
      daysRemaining: Math.max(0, daysRemaining),
      monthsRemaining: Math.max(0, monthsRemaining),
      requiredMonthly: Math.max(0, requiredMonthly),
      isOnTrack: goal.monthlyContribution >= requiredMonthly
    };
  };

  /**
   * Generates and downloads a PDF report of savings goals.
   */
  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text('Savings Goals Report', 20, 30);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 20, 45);

    let yPosition = 65;

    goals.forEach((goal, index) => {
      const stats = calculateGoalStats(goal);

      // Goal header
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${goal.name}`, 20, yPosition);
      yPosition += 15;

      // Goal details
      doc.setFontSize(12);
      doc.text(`Target Amount: $${goal.targetAmount.toLocaleString()}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Current Amount: $${goal.currentAmount.toLocaleString()}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Progress: ${stats.progress.toFixed(1)}%`, 30, yPosition);
      yPosition += 10;
      doc.text(`Remaining: $${stats.remaining.toLocaleString()}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Target Date: ${new Date(goal.targetDate).toLocaleDateString()}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Monthly Contribution: $${goal.monthlyContribution.toFixed(2)}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Required Monthly: $${stats.requiredMonthly.toFixed(2)}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Status: ${stats.isOnTrack ? 'On Track' : 'Behind Schedule'}`, 30, yPosition);
      yPosition += 20;

      // Add new page if needed
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Generated by Financial Tools Suite - Jameson A. Olitoquit', 20, 280);

    doc.save('savings-goals-report.pdf');
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
          <h1 className="text-4xl font-bold text-gray-900">Savings Goal Tracker</h1>
          <p className="text-gray-800 mt-2 font-medium">Track progress toward your savings goals</p>
        </header>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={loadExampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Example Data
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download PDF Report
          </button>
        </div>

        {/* Add New Goal */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Savings Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Current amount"
              value={newGoal.currentAmount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
            <input
              type="date"
              placeholder="Target date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Monthly contribution"
              value={newGoal.monthlyContribution}
              onChange={(e) => setNewGoal(prev => ({ ...prev, monthlyContribution: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Goal
            </button>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600">No savings goals added yet. Add your first goal above.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const stats = calculateGoalStats(goal);

              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{goal.name}</h3>
                      <p className="text-gray-600">Target: ${goal.targetAmount.toLocaleString()} by {new Date(goal.targetDate).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
                      <input
                        type="number"
                        value={goal.currentAmount}
                        onChange={(e) => updateCurrentAmount(goal.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
                      <p className="text-lg font-semibold text-blue-600">${goal.monthlyContribution.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remaining</label>
                      <p className="text-lg font-semibold text-red-600">${stats.remaining.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Months Left</label>
                      <p className="text-lg font-semibold text-purple-600">{stats.monthsRemaining}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress: {stats.progress.toFixed(1)}%</span>
                      <span>${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stats.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Required Monthly:</span>
                      <span className="ml-2 text-blue-600">${stats.requiredMonthly.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 font-semibold ${stats.isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.isOnTrack ? 'On Track' : 'Behind Schedule'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}