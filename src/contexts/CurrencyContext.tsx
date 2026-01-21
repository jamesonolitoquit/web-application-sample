'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyContextType {
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  exchangeRates: ExchangeRates;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  refreshRates: () => Promise<void>;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  formatCurrency: (amount: number, currency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc' },
  PHP: { symbol: '₱', name: 'Philippine Peso' }
};

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate.host/latest?base=USD';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedBaseCurrency = localStorage.getItem('baseCurrency');
    const savedRates = localStorage.getItem('exchangeRates');
    const savedLastUpdated = localStorage.getItem('exchangeRatesLastUpdated');

    if (savedBaseCurrency) {
      setBaseCurrency(savedBaseCurrency);
    }

    if (savedRates && savedLastUpdated) {
      try {
        const rates = JSON.parse(savedRates);
        const lastUpdatedDate = new Date(savedLastUpdated);
        setExchangeRates(rates);
        setLastUpdated(lastUpdatedDate);
      } catch (e) {
        console.error('Error loading cached exchange rates:', e);
      }
    }

    // Fetch rates on initial load
    refreshRates();
  }, []);

  // Save base currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('baseCurrency', baseCurrency);
  }, [baseCurrency]);

  const fetchExchangeRates = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(EXCHANGE_RATE_API_URL);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.rates) {
        throw new Error('Invalid API response format');
      }

      // Add PHP if not present (using approximate rate)
      const rates = { ...data.rates };
      if (!rates.PHP) {
        rates.PHP = 56.0; // Approximate USD to PHP rate
      }

      setExchangeRates(rates);
      setLastUpdated(new Date());

      // Cache rates
      localStorage.setItem('exchangeRates', JSON.stringify(rates));
      localStorage.setItem('exchangeRatesLastUpdated', new Date().toISOString());

    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');

      // Try to use cached rates if available
      const cachedRates = localStorage.getItem('exchangeRates');
      const cachedLastUpdated = localStorage.getItem('exchangeRatesLastUpdated');

      if (cachedRates && cachedLastUpdated) {
        try {
          const rates = JSON.parse(cachedRates);
          const lastUpdatedDate = new Date(cachedLastUpdated);
          setExchangeRates(rates);
          setLastUpdated(lastUpdatedDate);
          setError('Using cached exchange rates (API unavailable)');
        } catch (cacheErr) {
          setError('Exchange rates unavailable - please check your connection');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRates = async (): Promise<void> => {
    await fetchExchangeRates();
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount;

    // Convert to USD first, then to target currency
    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];

    return convertedAmount;
  };

  const formatCurrency = (amount: number, currency: string = baseCurrency): string => {
    const currencyInfo = CURRENCIES[currency as keyof typeof CURRENCIES];
    if (!currencyInfo) return `${amount.toFixed(2)} ${currency}`;

    return `${currencyInfo.symbol}${amount.toFixed(2)}`;
  };

  const value: CurrencyContextType = {
    baseCurrency,
    setBaseCurrency,
    exchangeRates,
    lastUpdated,
    isLoading,
    error,
    refreshRates,
    convertAmount,
    formatCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export { CURRENCIES };