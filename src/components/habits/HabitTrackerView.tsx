import React, { useState } from 'react';
import { Habit } from '../../types';
import { Plus, Flame, Check, Trash2, X } from 'lucide-react';

interface Props {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (id: string) => void;
}

export const HabitTrackerView: React.FC<Props> = ({
  habits,
  onAddHabit,
  onToggleHabitDay,
  onDeleteHabit,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [targetFrequency, setTargetFrequency] = useState(7);
  const [color, setColor] = useState('#3b82f6');

  const todayStr = new Date().toISOString().split('T')[0];

  // Past 7 days date strings
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: d.toISOString().split('T')[0] === todayStr,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      name: name.trim(),
      category,
      icon: 'Flame',
      color,
      targetFrequencyPerWeek: targetFrequency,
    });

    setName('');
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Habit Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build consistency with daily streaks saved to <span className="font-mono text-rose-400">habits.dat</span>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits Matrix */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Flame className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No habits tracked yet.</p>
            <p className="text-xs text-slate-500 mt-1">Add a habit like morning study or hydration to start your streak!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white font-bold"
                  style={{ backgroundColor: habit.color || '#ec4899' }}
                >
                  <Flame className="w-5 h-5 fill-white" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white truncate">{habit.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Category: {habit.category} • Target: {habit.targetFrequencyPerWeek} days/week
                  </p>
                </div>
              </div>

              {/* 7-Day Matrix + Streak Counter */}
              <div className="flex items-center justify-between md:justify-end space-x-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex items-center space-x-2">
                  {last7Days.map((day) => {
                    const isDone = habit.completedDates.includes(day.dateStr);
                    return (
                      <div key={day.dateStr} className="flex flex-col items-center space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold">{day.dayName}</span>
                        <button
                          onClick={() => onToggleHabitDay(habit.id, day.dateStr)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                              : day.isToday
                              ? 'bg-slate-800 border-2 border-rose-500/50 text-slate-400 hover:border-rose-400'
                              : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                  <div className="text-center">
                    <span className="text-xs text-amber-400 font-extrabold flex items-center space-x-1">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      <span>{habit.streak}d</span>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">Streak</span>
                  </div>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE HABIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add New Habit</h3>
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
                  Habit Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning 30m OOP Coding Practice"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
                  required
                />
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
                    <option value="Health">Health</option>
                    <option value="Study">Study</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Frequency (Days/Week)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={targetFrequency}
                    onChange={(e) => setTargetFrequency(parseInt(e.target.value) || 7)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Theme Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-9 bg-slate-800 border border-slate-700 rounded-xl p-1 cursor-pointer"
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
                  className="bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  Save Habit (habits.dat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
