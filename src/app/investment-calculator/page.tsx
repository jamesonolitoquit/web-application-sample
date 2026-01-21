'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface InvestmentResult {
  principal: number;
  years: number;
  annualReturn: number;
  monthlyContribution: number;
  totalContributions: number;
  totalInterest: number;
  finalAmount: number;
  yearByYear: Array<{
    year: number;
    contributions: number;
    interest: number;
    balance: number;
  }>;
}

export default function InvestmentCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [years, setYears] = useState('30');
  const [result, setResult] = useState<InvestmentResult | null>(null);

  // Calculate investment when inputs change
  useEffect(() => {
    calculateInvestment();
  }, [principal, monthlyContribution, annualReturn, years]);

  /**
   * Loads example investment data for demonstration.
   */
  const loadExampleData = () => {
    setPrincipal('10000');
    setMonthlyContribution('500');
    setAnnualReturn('7');
    setYears('30');
  };

  /**
   * Calculates investment growth with compound interest.
   */
  const calculateInvestment = () => {
    const P = parseFloat(principal) || 0;
    const PMT = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(annualReturn) || 0) / 100;
    const n = parseFloat(years) || 0;

    if (n === 0) {
      setResult(null);
      return;
    }

    const months = n * 12;
    const monthlyRate = r / 12;

    // Calculate future value of principal
    const principalFutureValue = P * Math.pow(1 + monthlyRate, months);

    // Calculate future value of monthly contributions
    let contributionsFutureValue = 0;
    if (PMT > 0 && monthlyRate > 0) {
      contributionsFutureValue = PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (PMT > 0) {
      contributionsFutureValue = PMT * months;
    }

    const finalAmount = principalFutureValue + contributionsFutureValue;
    const totalContributions = P + (PMT * months);
    const totalInterest = finalAmount - totalContributions;

    // Generate year-by-year breakdown
    const yearByYear = [];
    let currentBalance = P;
    let totalContributed = P;

    for (let year = 1; year <= n; year++) {
      let yearlyContributions = PMT * 12;
      let yearlyInterest = 0;

      // Calculate interest for each month in the year
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = currentBalance * monthlyRate;
        yearlyInterest += monthlyInterest;
        currentBalance += monthlyInterest + PMT;
      }

      totalContributed += yearlyContributions;

      yearByYear.push({
        year,
        contributions: yearlyContributions,
        interest: yearlyInterest,
        balance: currentBalance
      });
    }

    const investmentResult: InvestmentResult = {
      principal: P,
      years: n,
      annualReturn: parseFloat(annualReturn),
      monthlyContribution: PMT,
      totalContributions,
      totalInterest,
      finalAmount,
      yearByYear
    };

    setResult(investmentResult);
  };

  /**
   * Generates and downloads a PDF report of the investment calculation.
   */
  const generatePDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text('Investment Growth Report', 20, 30);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 20, 45);

    // Investment Details
    doc.setFontSize(14);
    doc.text('Investment Details:', 20, 65);
    doc.setFontSize(12);
    doc.text(`Initial Investment: $${result.principal.toLocaleString()}`, 20, 80);
    doc.text(`Monthly Contribution: $${result.monthlyContribution.toFixed(2)}`, 20, 90);
    doc.text(`Annual Return: ${result.annualReturn}%`, 20, 100);
    doc.text(`Time Period: ${result.years} years`, 20, 110);

    // Results Summary
    doc.setFontSize(14);
    doc.text('Results Summary:', 20, 130);
    doc.setFontSize(12);
    doc.text(`Final Amount: $${result.finalAmount.toLocaleString()}`, 20, 145);
    doc.text(`Total Contributions: $${result.totalContributions.toLocaleString()}`, 20, 155);
    doc.text(`Total Interest Earned: $${result.totalInterest.toLocaleString()}`, 20, 165);

    // Year-by-Year Breakdown (first 10 years)
    doc.setFontSize(14);
    doc.text('Year-by-Year Growth (First 10 Years):', 20, 185);

    let yPosition = 200;
    doc.setFontSize(10);
    doc.text('Year', 20, yPosition);
    doc.text('Contributions', 50, yPosition);
    doc.text('Interest', 100, yPosition);
    doc.text('Balance', 140, yPosition);
    yPosition += 10;

    result.yearByYear.slice(0, 10).forEach((yearData) => {
      doc.text(yearData.year.toString(), 20, yPosition);
      doc.text(`$${yearData.contributions.toFixed(2)}`, 50, yPosition);
      doc.text(`$${yearData.interest.toFixed(2)}`, 100, yPosition);
      doc.text(`$${yearData.balance.toFixed(2)}`, 140, yPosition);
      yPosition += 8;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;
      }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Generated by Financial Tools Suite - Jameson A. Olitoquit', 20, 280);

    doc.save('investment-growth-report.pdf');
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
          <h1 className="text-4xl font-bold text-gray-900">Investment Calculator</h1>
          <p className="text-gray-800 mt-2 font-medium">Calculate the growth of your investments over time</p>
        </header>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={loadExampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Example Data
          </button>
          {result && (
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF Report
            </button>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Return (%)</label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Amount</h3>
                <p className="text-2xl font-bold text-green-600">${result.finalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Contributions</h3>
                <p className="text-2xl font-bold text-blue-600">${result.totalContributions.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Interest</h3>
                <p className="text-2xl font-bold text-purple-600">${result.totalInterest.toLocaleString()}</p>
              </div>
            </div>

            {/* Year-by-Year Breakdown */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Year-by-Year Growth</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Year</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Contributions</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Interest</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((yearData) => (
                      <tr key={yearData.year} className="border-b border-gray-100">
                        <td className="py-2 px-4">{yearData.year}</td>
                        <td className="py-2 px-4">${yearData.contributions.toFixed(2)}</td>
                        <td className="py-2 px-4">${yearData.interest.toFixed(2)}</td>
                        <td className="py-2 px-4 font-semibold">${yearData.balance.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}