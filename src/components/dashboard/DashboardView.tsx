import React, { useState } from 'react';
import { AppDataStore } from '../../services/storageService';
import { ProductivityMetrics, ActiveModule } from '../../types';
import { DAILY_QUOTES } from '../../services/productivityService';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  TrendingUp,
  Wallet,
  FileText,
  Calendar,
  Flame,
  ArrowRight,
  Plus,
  Quote,
} from 'lucide-react';

interface Props {
  store: AppDataStore;
  metrics: ProductivityMetrics;
  onSelectModule: (m: ActiveModule) => void;
  onToggleTask: (taskId: string) => void;
  onQuickAddNote: (title: string, content: string) => void;
  onQuickAction: (action: 'task' | 'note' | 'event' | 'expense') => void;
}

export const DashboardView: React.FC<Props> = ({
  store,
  metrics,
  onSelectModule,
  onToggleTask,
  onQuickAddNote,
  onQuickAction,
}) => {
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');
  const [quoteIdx] = useState(() => Math.floor(Math.random() * DAILY_QUOTES.length));

  const quote = DAILY_QUOTES[quoteIdx];
  const todayStr = new Date().toISOString().split('T')[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filter today's tasks
  const todayTasks = store.tasks.filter((t) => t.dueDate === todayStr || t.status === 'PENDING');
  // Filter today's events
  const todayEvents = store.events.filter((e) => e.startDate === todayStr);

  // Financial summary
  const totalIncome = store.expenses.filter((e) => e.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
  const totalExpense = store.expenses.filter((e) => e.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
  const remainingBalance = totalIncome - totalExpense;

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteTitle.trim() || !quickNoteContent.trim()) return;
    onQuickAddNote(quickNoteTitle.trim(), quickNoteContent.trim());
    setQuickNoteTitle('');
    setQuickNoteContent('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-950/90 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personal Command Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">{store.user.fullName}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              You have <span className="text-indigo-300 font-bold">{metrics.totalTasksToday - metrics.tasksCompletedToday} tasks</span> pending today. Your daily productivity score is currently at <span className="text-emerald-400 font-bold">{metrics.score}%</span>.
            </p>
          </div>

          {/* Quick Quote Widget */}
          <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl max-w-sm shrink-0 backdrop-blur-md">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <Quote className="w-3.5 h-3.5" />
              <span>Daily Thought</span>
            </div>
            <p className="text-xs text-slate-200 italic line-clamp-2">"{quote.text}"</p>
            <p className="text-[10px] text-slate-400 text-right mt-1.5 font-medium">— {quote.author}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Score, Tasks, Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productivity Score Banner Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Productivity Score Engine</h3>
                  <p className="text-xs text-slate-400">Calculated from Tasks, Habits, Focus & Goals</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                {metrics.badge}
              </span>
            </div>

            {/* Score Progress Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center my-4">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                  {metrics.score}%
                </span>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1">Today's Score</span>
              </div>

              <div className="md:col-span-3 space-y-2.5">
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${metrics.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800/50">
                    <span className="block font-bold text-slate-200">{metrics.tasksCompletedToday}/{metrics.totalTasksToday}</span>
                    <span className="text-[10px] text-slate-400">Tasks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/50">
                    <span className="block font-bold text-slate-200">{metrics.habitsCompletedToday}/{metrics.totalHabitsToday}</span>
                    <span className="text-[10px] text-slate-400">Habits</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/50">
                    <span className="block font-bold text-slate-200">{metrics.focusMinutesToday}m</span>
                    <span className="text-[10px] text-slate-400">Focus Time</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/50">
                    <span className="block font-bold text-slate-200">{metrics.journalWrittenToday ? 'Done' : 'Pending'}</span>
                    <span className="text-[10px] text-slate-400">Journal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Today's Tasks</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onQuickAction('task')}
                  className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => onSelectModule('tasks')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No tasks due for today. Great job!
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                      >
                        {task.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ml-3 ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Calendar Events */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">Today's Calendar Schedule</h3>
              </div>
              <button
                onClick={() => onSelectModule('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todayEvents.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
                No meetings or events scheduled for today.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                          {evt.category}
                        </span>
                        <span className="text-xs font-mono text-indigo-300">{evt.startTime} - {evt.endTime}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-1">{evt.title}</h4>
                      {evt.location && <p className="text-xs text-slate-400 mt-1">{evt.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Focus Timer Quick Launcher, Expense Summary, Quick Scratchpad */}
        <div className="space-y-6">
          {/* Quick Focus Launcher */}
          <div className="bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Focus Session</h3>
              </div>
              <span className="text-xs font-mono text-indigo-300">{metrics.focusMinutesToday}m Logged</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Boost your productivity score by launching a 25-minute Pomodoro study block.
            </p>
            <button
              onClick={() => onSelectModule('focus')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Launch Focus Timer</span>
            </button>
          </div>

          {/* Expense Summary Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Monthly Finances</h3>
              </div>
              <button
                onClick={() => onSelectModule('expenses')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Details
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Income</span>
                <span className="text-sm font-bold text-emerald-400">+${totalIncome.toFixed(2)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Expenses</span>
                <span className="text-sm font-bold text-rose-400">-${totalExpense.toFixed(2)}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-800 to-indigo-950 border border-indigo-500/30 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-200">Net Balance</span>
                <span className="text-base font-extrabold text-indigo-300">${remainingBalance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick Notes Scratchpad Widget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Quick Scratchpad</h3>
              </div>
              <button
                onClick={() => onSelectModule('notes')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                All Notes
              </button>
            </div>

            <form onSubmit={handleSaveQuickNote} className="space-y-3">
              <input
                type="text"
                value={quickNoteTitle}
                onChange={(e) => setQuickNoteTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <textarea
                value={quickNoteContent}
                onChange={(e) => setQuickNoteContent(e.target.value)}
                placeholder="Write quick ideas, links, or reminders..."
                rows={3}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              />
              <button
                type="submit"
                disabled={!quickNoteTitle.trim() || !quickNoteContent.trim()}
                className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold py-2 rounded-xl transition-colors disabled:opacity-40"
              >
                Save to notes.dat
              </button>
            </form>
          </div>

          {/* Habit Tracker Quick Status */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Daily Habit Streak</h3>
              </div>
              <button
                onClick={() => onSelectModule('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {store.habits.slice(0, 3).map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50">
                  <span className="text-xs text-slate-300 font-medium truncate">{habit.name}</span>
                  <span className="text-xs font-bold text-amber-400 flex items-center space-x-1 shrink-0">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{habit.streak}d</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
