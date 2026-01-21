import React from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </ThemeProvider>
  );
}