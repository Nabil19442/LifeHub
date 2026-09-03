import React, { useState } from 'react';
import { Expense, TransactionType } from '../../types';
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Trash2,
  PieChart,
  X,
} from 'lucide-react';

interface Props {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTrackerView: React.FC<Props> = ({ expenses, onAddExpense, onDeleteExpense }) => {
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    onAddExpense({
      title: title.trim(),
      amount: numAmount,
      type,
      category,
      date,
      note: note.trim() || undefined,
    });

    setTitle('');
    setAmount('');
    setNote('');
    setShowModal(false);
  };

  // Summary Metrics
  const totalIncome = expenses.filter((e) => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenses.filter((e) => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // Category Breakdown for expenses
  const categoryTotals: Record<string, number> = {};
  expenses
    .filter((e) => e.type === 'EXPENSE')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Expense Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor stipends, textbooks, and monthly budgets stored in <span className="font-mono text-emerald-400">expenses.dat</span>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Total Income</span>
            <span className="text-2xl font-extrabold text-emerald-400">+${totalIncome.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">Total Expenses</span>
            <span className="text-2xl font-extrabold text-rose-400">-${totalExpense.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/30 p-6 rounded-3xl shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-indigo-300 block font-medium uppercase tracking-wider">Net Remaining Balance</span>
            <span className="text-2xl font-extrabold text-white">${netBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Recent Transactions</h3>

          {expenses.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No transaction logs recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 transition-colors flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        {item.category} • {item.date} {item.note && `(${item.note})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-sm font-bold ${
                        item.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.type === 'INCOME' ? '+' : '-'}${item.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Spending Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <h3>Spending Categories</h3>
          </div>

          <div className="space-y-3">
            {Object.keys(categoryTotals).length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No expense categories logged.</p>
            ) : (
              Object.entries(categoryTotals).map(([cat, amt]) => {
                const ratio = totalExpense > 0 ? (amt / totalExpense) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cat}</span>
                      <span className="text-slate-400">${amt.toFixed(2)} ({ratio.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CREATE TRANSACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Financial Transaction</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Transaction Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Textbooks or Grocery stipend"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="45.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="EXPENSE">Expense (-)</option>
                    <option value="INCOME">Income (+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Food">Food</option>
                    <option value="Study">Study</option>
                    <option value="Salary">Salary / Stipend</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Note / Reference
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional memo..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  Save Log (expenses.dat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
