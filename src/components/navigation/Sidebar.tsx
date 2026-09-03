import React from 'react';
import { ActiveModule } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  Wallet,
  Flame,
  Target,
  BookOpen,
  Timer,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface Props {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingTasksCount: number;
  productivityScore: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  pendingTasksCount,
  productivityScore,
  onLogout,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveModule, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks' as ActiveModule, label: 'Task Manager', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'notes' as ActiveModule, label: 'Notes', icon: FileText },
    { id: 'calendar' as ActiveModule, label: 'Calendar', icon: Calendar },
    { id: 'expenses' as ActiveModule, label: 'Expense Tracker', icon: Wallet },
    { id: 'habits' as ActiveModule, label: 'Habit Tracker', icon: Flame },
    { id: 'goals' as ActiveModule, label: 'Goal Tracker', icon: Target },
    { id: 'journal' as ActiveModule, label: 'Daily Journal', icon: BookOpen },
    { id: 'focus' as ActiveModule, label: 'Focus Timer', icon: Timer },
    { id: 'settings' as ActiveModule, label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-900/95 border-r border-slate-800/80 transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight tracking-wide">LifeHub</h2>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Smart Dashboard</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-950 text-indigo-200 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Productivity Score Quick Status */}
      {!isCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Productivity Score</span>
            <span className="text-emerald-400 font-bold">{productivityScore}%</span>
          </div>
          <div className="w-full bg-slate-700/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Logout / User Footer */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors text-sm font-medium"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
