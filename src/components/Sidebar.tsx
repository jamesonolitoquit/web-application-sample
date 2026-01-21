'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency, CURRENCIES } from '@/contexts/CurrencyContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { baseCurrency, setBaseCurrency, lastUpdated, isLoading, error, refreshRates } = useCurrency();
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const tools = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Expense Tracker', href: '/expense-tracker', icon: '💰' },
    { name: 'Budget Planner', href: '/budget-planner', icon: '📊' },
    { name: 'Loan Calculator', href: '/loan-calculator', icon: '🏦' },
    { name: 'Savings Goal', href: '/savings-goal', icon: '🎯' },
    { name: 'Currency Converter', href: '/currency-converter', icon: '💱' },
    { name: 'Investment Calc', href: '/investment-calculator', icon: '📈' }
  ];

  const currencies = Object.keys(CURRENCIES);

  const handleCurrencyChange = (currency: string) => {
    setBaseCurrency(currency);
    setIsCurrencyMenuOpen(false);
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Financial Tools
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    onClick={onClose}
                    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl mr-3">{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h3>

            {/* Theme Toggle */}
            <div className="mb-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Currency Selection */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Base Currency
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                  className="w-full px-3 py-2 text-left bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{CURRENCIES[baseCurrency as keyof typeof CURRENCIES]?.symbol}</span>
                    <span>{baseCurrency}</span>
                  </span>
                  <span className="text-gray-400">▼</span>
                </button>

                {isCurrencyMenuOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                    {currencies.map((currency) => (
                      <button
                        key={currency}
                        onClick={() => handleCurrencyChange(currency)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="mr-2">{CURRENCIES[currency as keyof typeof CURRENCIES]?.symbol}</span>
                        <span>{currency} - {CURRENCIES[currency as keyof typeof CURRENCIES]?.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Exchange Rate Status */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <div className="mb-2">
                <span className="font-medium">Exchange Rates:</span>
              </div>
              <div className="mb-1">
                Last Updated: {formatLastUpdated(lastUpdated)}
              </div>
              {isLoading && (
                <div className="text-blue-600 dark:text-blue-400">Updating...</div>
              )}
              {error && (
                <div className="text-red-600 dark:text-red-400">{error}</div>
              )}
              <button
                onClick={refreshRates}
                disabled={isLoading}
                className="mt-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Refresh Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}