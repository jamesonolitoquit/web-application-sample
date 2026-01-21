'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

interface LoanData {
  principal: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('300000');
  const [interestRate, setInterestRate] = useState('4.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);

  // Calculate loan when inputs change
  useEffect(() => {
    calculateLoan();
  }, [principal, interestRate, loanTerm]);

  /**
   * Loads example loan data for demonstration.
   */
  const loadExampleData = () => {
    setPrincipal('300000');
    setInterestRate('4.5');
    setLoanTerm('30');
  };

  /**
   * Calculates loan payment and amortization schedule.
   */
  const calculateLoan = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = (parseFloat(loanTerm) || 0) * 12; // Total number of payments

    if (P === 0 || r === 0 || n === 0) {
      setLoanData(null);
      setAmortizationSchedule([]);
      return;
    }

    // Monthly payment calculation using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    const data: LoanData = {
      principal: P,
      interestRate: parseFloat(interestRate),
      loanTerm: parseFloat(loanTerm),
      monthlyPayment,
      totalPayment,
      totalInterest
    };

    setLoanData(data);

    // Generate amortization schedule (first 12 months + last payment)
    const schedule: AmortizationRow[] = [];
    let balance = P;

    for (let month = 1; month <= Math.min(n, 13); month++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });

      if (month === 12 && n > 12) {
        // Add ellipsis for middle payments
        schedule.push({
          month: -1, // Special marker for ellipsis
          payment: 0,
          principal: 0,
          interest: 0,
          balance: 0
        });
      }

      if (month === n) break;
    }

    // Add final payment if not already included
    if (n > 12) {
      const finalMonth = n;
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: finalMonth,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setAmortizationSchedule(schedule);
  };

  /**
   * Generates and downloads a PDF report of the loan calculation.
   */
  const generatePDF = () => {
    if (!loanData) return;

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text('Loan Calculation Report', 20, 30);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, 20, 45);

    // Loan Details
    doc.setFontSize(14);
    doc.text('Loan Details:', 20, 65);
    doc.setFontSize(12);
    doc.text(`Principal Amount: $${loanData.principal.toLocaleString()}`, 20, 80);
    doc.text(`Interest Rate: ${loanData.interestRate}%`, 20, 90);
    doc.text(`Loan Term: ${loanData.loanTerm} years`, 20, 100);

    // Payment Summary
    doc.setFontSize(14);
    doc.text('Payment Summary:', 20, 120);
    doc.setFontSize(12);
    doc.text(`Monthly Payment: $${loanData.monthlyPayment.toFixed(2)}`, 20, 135);
    doc.text(`Total Payment: $${loanData.totalPayment.toFixed(2)}`, 20, 145);
    doc.text(`Total Interest: $${loanData.totalInterest.toFixed(2)}`, 20, 155);

    // Amortization Schedule (first few payments)
    doc.setFontSize(14);
    doc.text('Amortization Schedule (First 12 Payments):', 20, 175);

    let yPosition = 190;
    doc.setFontSize(10);
    doc.text('Month', 20, yPosition);
    doc.text('Payment', 50, yPosition);
    doc.text('Principal', 90, yPosition);
    doc.text('Interest', 130, yPosition);
    doc.text('Balance', 160, yPosition);

    yPosition += 10;

    amortizationSchedule.slice(0, 12).forEach((row) => {
      if (row.month === -1) {
        doc.text('...', 20, yPosition);
        doc.text('...', 50, yPosition);
        doc.text('...', 90, yPosition);
        doc.text('...', 130, yPosition);
        doc.text('...', 160, yPosition);
      } else {
        doc.text(row.month.toString(), 20, yPosition);
        doc.text(`$${row.payment.toFixed(2)}`, 50, yPosition);
        doc.text(`$${row.principal.toFixed(2)}`, 90, yPosition);
        doc.text(`$${row.interest.toFixed(2)}`, 130, yPosition);
        doc.text(`$${row.balance.toFixed(2)}`, 160, yPosition);
      }
      yPosition += 8;
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Generated by Financial Tools Suite - Jameson A. Olitoquit', 20, 280);

    doc.save('loan-calculation-report.pdf');
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
          <h1 className="text-4xl font-bold text-gray-900">Loan Calculator</h1>
          <p className="text-gray-800 mt-2 font-medium">Calculate loan payments and view amortization schedules</p>
        </header>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={loadExampleData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Example Data
          </button>
          {loanData && (
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="300000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="4.5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loanData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Payment</h3>
                <p className="text-2xl font-bold text-blue-600">${loanData.monthlyPayment.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Payment</h3>
                <p className="text-2xl font-bold text-green-600">${loanData.totalPayment.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Interest</h3>
                <p className="text-2xl font-bold text-red-600">${loanData.totalInterest.toFixed(2)}</p>
              </div>
            </div>

            {/* Amortization Schedule */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amortization Schedule</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Month</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Payment</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Principal</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Interest</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-900">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        {row.month === -1 ? (
                          <td colSpan={5} className="py-2 px-4 text-center text-gray-500">...</td>
                        ) : (
                          <>
                            <td className="py-2 px-4">{row.month}</td>
                            <td className="py-2 px-4">${row.payment.toFixed(2)}</td>
                            <td className="py-2 px-4">${row.principal.toFixed(2)}</td>
                            <td className="py-2 px-4">${row.interest.toFixed(2)}</td>
                            <td className="py-2 px-4">${row.balance.toFixed(2)}</td>
                          </>
                        )}
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