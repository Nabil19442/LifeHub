import React, { useState, useEffect } from 'react';
import { UserProfile, ActiveModule } from '../../types';
import {
  Search,
  Bell,
  Plus,
  Moon,
  Sun,
  Clock,
  CheckSquare,
  FileText,
  Calendar as CalendarIcon,
  Wallet,
} from 'lucide-react';

interface Props {
  activeModule: ActiveModule;
  user: UserProfile;
  theme: string;
  onToggleTheme: () => void;
  onOpenGlobalSearch: () => void;
  onQuickAction: (action: 'task' | 'note' | 'event' | 'expense') => void;
  onSelectModule: (m: ActiveModule) => void;
}

export const Topbar: React.FC<Props> = ({
  activeModule,
  user,
  theme,
  onToggleTheme,
  onOpenGlobalSearch,
  onQuickAction,
  onSelectModule,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getModuleTitle = (m: ActiveModule) => {
    switch (m) {
      case 'dashboard': return 'Personal Dashboard';
      case 'tasks': return 'Task Manager';
      case 'notes': return 'Quick Notes';
      case 'calendar': return 'Calendar & Events';
      case 'expenses': return 'Expense Tracker';
      case 'habits': return 'Habit Tracker';
      case 'goals': return 'Goal Tracker';
      case 'journal': return 'Daily Journal & Mood';
      case 'focus': return 'Focus Timer & Pomodoro';
      case 'settings': return 'System Settings';
      default: return 'LifeHub';
    }
  };

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Path */}
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-bold text-white tracking-tight">{getModuleTitle(activeModule)}</h1>
        <span className="text-slate-600 font-medium">/</span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
          {dateStr}
        </span>
      </div>

      {/* Center Live Clock */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs font-mono text-indigo-300">
        <Clock className="w-3.5 h-3.5 text-indigo-400" />
        <span>{timeStr}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenGlobalSearch}
          className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs text-slate-300 transition-all"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline bg-slate-900 border border-slate-700 text-[10px] px-1.5 py-0.5 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center space-x-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-xl text-xs font-medium shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-scale-up">
              <button
                onClick={() => {
                  onQuickAction('task');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
              >
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>New Task</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('note');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>New Note</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('event');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
              >
                <CalendarIcon className="w-4 h-4 text-purple-400" />
                <span>New Calendar Event</span>
              </button>
              <button
                onClick={() => {
                  onQuickAction('expense');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>Log Expense</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700/60 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 z-50">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Notifications</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <p className="text-slate-200 font-medium">OOP Project Presentation</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Scheduled for today at 14:30</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <p className="text-slate-200 font-medium">Daily Habit Reminder</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Don't forget your morning study session!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <button
          onClick={() => onSelectModule('settings')}
          className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-800 transition-colors"
          title="View Settings & Profile"
        >
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
          />
        </button>
      </div>
    </header>
  );
};
