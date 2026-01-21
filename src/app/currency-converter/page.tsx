'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);

  // Static exchange rates (as of January 2025 - for demonstration)
  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, CAD: 1.47, AUD: 1.59, CHF: 1.08 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 150.5, CAD: 1.71, AUD: 1.85, CHF: 1.26 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, CAD: 0.0113, AUD: 0.0122, CHF: 0.0083 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.0, AUD: 1.08, CHF: 0.74 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, CAD: 0.93, CHF: 0.68 },
    CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 119.5, CAD: 1.35, AUD: 1.47 }
  };

  const currencies = Object.keys(exchangeRates);

  // Load conversion history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('conversionHistory');
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      setConversionHistory(history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    } else {
      // Load example data if no stored history
      loadExampleData();
    }
  }, []);

  // Save conversion history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]);

  /**
   * Loads example conversion data for demonstration.
   */
  const loadExampleData = () => {
    const exampleConversions: ConversionResult[] = [
      {
        fromAmount: 1000,
        fromCurrency: 'USD',
        toAmount: 850,
        toCurrency: 'EUR',
        rate: 0.85,
        timestamp: new Date('2025-01-20T10:30:00')
      },
      {
        fromAmount: 500,
        fromCurrency: 'EUR',
        toAmount: 590,
        toCurrency: 'USD',
        rate: 1.18,
        timestamp: new Date('2025-01-19T14:15:00')
      },
      {
        fromAmount: 10000,
        fromCurrency: 'JPY',
        toAmount: 91,
        toCurrency: 'USD',
        rate: 0.0091,
        timestamp: new Date('2025-01-18T09:45:00')
      }
    ];
    setConversionHistory(exampleConversions);
  };

  /**
   * Converts currency using the exchange rates.
   */
  const convertCurrency = () => {
    const fromAmount = parseFloat(amount);
    if (isNaN(fromAmount) || fromAmount <= 0) return;

    if (fromCurrency === toCurrency) {
      const result: ConversionResult = {
        fromAmount,
        fromCurrency,
        toAmount: fromAmount,
        toCurrency,
        rate: 1,
        timestamp: new Date()
      };
      setResult(result);
      setConversionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 conversions
      return;
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      alert('Exchange rate not available for this currency pair');
      return;
    }

    const toAmount = fromAmount * rate;
    const result: ConversionResult = {
      fromAmount,
      fromCurrency,
      toAmount,
      toCurrency,
      rate,
      timestamp: new Date()
    };

    setResult(result);
    setConversionHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 conversions
  };

  /**
   * Swaps the from and to currencies.
   */
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  /**
   * Generates and downloads a PDF report of conversion history.
   */
  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text('Currency Conversion Report', 20, 30);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 20, 45);

    // Current Rates
    doc.setFontSize(14);
    doc.text('Exchange Rates (USD Base):', 20, 65);

    let yPosition = 80;
    doc.setFontSize(12);
    Object.entries(exchangeRates.USD).forEach(([currency, rate]) => {
      doc.text(`1 USD = ${rate} ${currency}`, 20, yPosition);
      yPosition += 10;
    });

    // Conversion History
    doc.setFontSize(14);
    doc.text('Recent Conversions:', 20, yPosition + 10);
    yPosition += 25;

    doc.setFontSize(10);
    doc.text('Date/Time', 20, yPosition);
    doc.text('From', 70, yPosition);
    doc.text('To', 120, yPosition);
    doc.text('Rate', 160, yPosition);
    yPosition += 10;

    conversionHistory.slice(0, 8).forEach((conversion) => {
      const dateStr = conversion.timestamp.toLocaleString();
      const fromStr = `${conversion.fromAmount.toFixed(2)} ${conversion.fromCurrency}`;
      const toStr = `${conversion.toAmount.toFixed(2)} ${conversion.toCurrency}`;
      const rateStr = conversion.rate.toFixed(4);

      doc.text(dateStr, 20, yPosition);
      doc.text(fromStr, 70, yPosition);
      doc.text(toStr, 120, yPosition);
      doc.text(rateStr, 160, yPosition);
      yPosition += 8;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Generated by Financial Tools Suite - Jameson A. Olitoquit', 20, 280);

    doc.save('currency-conversion-report.pdf');
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
          <h1 className="text-4xl font-bold text-gray-900">Currency Converter</h1>
          <p className="text-gray-800 mt-2 font-medium">Convert between different currencies with real-time rates</p>
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

        {/* Converter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={swapCurrencies}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Swap currencies"
              >
                ⇄
              </button>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <button
                onClick={convertCurrency}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Convert
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Result</h3>
              <div className="text-xl font-bold text-blue-600">
                {result.fromAmount.toLocaleString()} {result.fromCurrency} = {result.toAmount.toFixed(2)} {result.toCurrency}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Exchange Rate: 1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
              </div>
            </div>
          )}
        </div>

        {/* Conversion History */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Conversions</h2>
          {conversionHistory.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No conversions yet. Make your first conversion above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Date/Time</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">From</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">To</th>
                    <th className="text-left py-2 px-4 font-medium text-gray-900">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionHistory.map((conversion, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-4">{conversion.timestamp.toLocaleString()}</td>
                      <td className="py-2 px-4">{conversion.fromAmount.toFixed(2)} {conversion.fromCurrency}</td>
                      <td className="py-2 px-4">{conversion.toAmount.toFixed(2)} {conversion.toCurrency}</td>
                      <td className="py-2 px-4">{conversion.rate.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}