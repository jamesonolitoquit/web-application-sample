'use client';

import React from 'react';
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';

export default function Dashboard() {
  const tools = [
    {
      name: 'Expense Tracker',
      description: 'Track your daily expenses with categories and summaries',
      href: '/expense-tracker',
      icon: '💰',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Budget Planner',
      description: 'Create and manage monthly budgets with PDF export',
      href: '/budget-planner',
      icon: '📊',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Loan Calculator',
      description: 'Calculate loan payments and amortization schedules',
      href: '/loan-calculator',
      icon: '🏦',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Savings Goal Tracker',
      description: 'Track progress toward your savings goals',
      href: '/savings-goal',
      icon: '🎯',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Currency Converter',
      description: 'Convert between different currencies',
      href: '/currency-converter',
      icon: '💱',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Investment Calculator',
      description: 'Calculate investment returns and growth',
      href: '/investment-calculator',
      icon: '📈',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <LayoutWithSidebar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Financial Tools Suite</h1>
            <p className="text-xl text-gray-700 mb-2">Comprehensive financial management tools for personal finance</p>
            <p className="text-gray-600">Built with React, TypeScript, and Next.js</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-200"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm group-hover:text-blue-700">
                  Get Started →
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Suite</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              This comprehensive financial tools suite demonstrates modern web development skills using React, TypeScript, and Next.js.
              Each tool is designed to be functional, user-friendly, and includes features like PDF export, example data, and responsive design.
              Perfect for managing personal finances, planning budgets, and making informed financial decisions.
            </p>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}
