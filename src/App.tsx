import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { storageService, AppDataStore } from './services/storageService';
import { calculateProductivityScore } from './services/productivityService';
import { audioService } from './services/audioService';
import {
  ActiveModule,
  UserProfile,
  Task,
  Note,
  CalendarEvent,
  Expense,
  Habit,
  Goal,
  JournalEntry,
  FocusSession,
  AppSettings,
} from './types';

// Components
import { AuthModal } from './components/auth/AuthModal';
import { Sidebar } from './components/navigation/Sidebar';
import { Topbar } from './components/navigation/Topbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskManagerView } from './components/tasks/TaskManagerView';
import { NotesView } from './components/notes/NotesView';
import { CalendarView } from './components/calendar/CalendarView';
import { ExpenseTrackerView } from './components/expenses/ExpenseTrackerView';
import { HabitTrackerView } from './components/habits/HabitTrackerView';
import { GoalTrackerView } from './components/goals/GoalTrackerView';
import { JournalView } from './components/journal/JournalView';
import { FocusTimerView } from './components/focus/FocusTimerView';
import { SettingsView } from './components/settings/SettingsView';
import { ToastContainer, ToastMessage } from './components/common/ToastNotification';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

export default function App() {
  // App Store State
  const [store, setStore] = useState<AppDataStore>(() => storageService.loadData());
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('lifehub_is_authenticated');
    return saved !== null ? saved === 'true' : true;
  });
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Toast Helper
  const showToast = useCallback(
    (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-Save whenever store changes
  useEffect(() => {
    storageService.saveData(store);
  }, [store]);

  // Apply Theme to Document Element and Body
  useEffect(() => {
    if (store.settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [store.settings.theme]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Productivity Metrics
  const productivityMetrics = useMemo(() => {
    return calculateProductivityScore(
      store.tasks,
      store.habits,
      store.goals,
      store.journal,
      store.focusSessions
    );
  }, [store]);

  // Task Actions
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStore((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
    showToast('Task Created', `Saved "${task.title}" to tasks.dat`, 'success');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setStore((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
    showToast('Task Updated', 'Task changes saved.', 'info');
  };

  const handleDeleteTask = (id: string) => {
    setStore((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    showToast('Task Deleted', 'Removed from tasks.dat', 'info');
  };

  const handleToggleTask = (id: string) => {
    setStore((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'COMPLETED';
          const newStatus = isDone ? 'PENDING' : 'COMPLETED';
          if (!isDone) audioService.playChime('success');
          return {
            ...t,
            status: newStatus,
            completedAt: !isDone ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return t;
      }),
    }));
  };

  // Notes Actions
  const handleAddNote = (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const note: Note = {
      ...newNote,
      id: `n-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };
    setStore((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    showToast('Note Saved', `Saved "${note.title}" to notes.dat`, 'success');
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
    }));
    showToast('Note Updated', 'Note saved to notes.dat', 'info');
  };

  const handleDeleteNote = (id: string) => {
    setStore((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
    showToast('Note Deleted', 'Removed from notes.dat', 'info');
  };

  const handleToggleNotePin = (id: string) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }));
  };

  const handleToggleNoteFavorite = (id: string) => {
    setStore((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)),
    }));
  };

  // Calendar Events Actions
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = { ...newEvent, id: `e-${Date.now()}` };
    setStore((prev) => ({ ...prev, events: [event, ...prev.events] }));
    showToast('Event Added', `Saved "${event.title}" to events.dat`, 'success');
  };

  const handleDeleteEvent = (id: string) => {
    setStore((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
    showToast('Event Deleted', 'Removed from events.dat', 'info');
  };

  // Expense Actions
  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = { ...newExpense, id: `ex-${Date.now()}` };
    setStore((prev) => ({ ...prev, expenses: [expense, ...prev.expenses] }));
    showToast('Expense Logged', `Recorded $${expense.amount} in expenses.dat`, 'success');
  };

  const handleDeleteExpense = (id: string) => {
    setStore((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }));
    showToast('Transaction Removed', 'Removed from expenses.dat', 'info');
  };

  // Habit Actions
  const handleAddHabit = (newHabit: Omit<Habit, 'id' | 'completedDates' | 'streak' | 'createdAt'>) => {
    const habit: Habit = {
      ...newHabit,
      id: `h-${Date.now()}`,
      completedDates: [],
      streak: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStore((prev) => ({ ...prev, habits: [...prev.habits, habit] }));
    showToast('Habit Created', `Saved "${habit.name}" to habits.dat`, 'success');
  };

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setStore((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates.includes(dateStr);
          const newDates = isDone
            ? h.completedDates.filter((d) => d !== dateStr)
            : [...h.completedDates, dateStr];
          const newStreak = newDates.length;
          if (!isDone) audioService.playChime('success');
          return { ...h, completedDates: newDates, streak: newStreak };
        }
        return h;
      }),
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setStore((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));
    showToast('Habit Removed', 'Removed from habits.dat', 'info');
  };

  // Goal Actions
  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'isCompleted' | 'createdAt'>) => {
    const goal: Goal = {
      ...newGoal,
      id: `g-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStore((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
    showToast('Goal Set', `Saved "${goal.title}" to goals.dat`, 'success');
  };

  const handleUpdateGoalProgress = (goalId: string, progress: number, milestones?: Goal['milestones']) => {
    setStore((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id === goalId) {
          const isComp = progress >= 100;
          return {
            ...g,
            progress,
            isCompleted: isComp,
            milestones: milestones || g.milestones,
          };
        }
        return g;
      }),
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setStore((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }));
    showToast('Goal Deleted', 'Removed from goals.dat', 'info');
  };

  // Journal Actions
  const handleAddJournalEntry = (newEntry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const entry: JournalEntry = {
      ...newEntry,
      id: `j-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStore((prev) => ({ ...prev, journal: [entry, ...prev.journal] }));
    showToast('Journal Entry Saved', `Recorded in journal.dat`, 'success');
  };

  const handleDeleteJournalEntry = (id: string) => {
    setStore((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) }));
    showToast('Entry Deleted', 'Removed from journal.dat', 'info');
  };

  // Focus Session Logging
  const handleLogFocusSession = (newSession: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const session: FocusSession = {
      ...newSession,
      id: `f-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setStore((prev) => ({ ...prev, focusSessions: [session, ...prev.focusSessions] }));
    showToast('Focus Session Logged!', `+${session.durationMinutes} minutes added to your productivity score.`, 'success');
  };

  // User & Settings Actions
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setStore((prev) => ({ ...prev, user: updatedUser }));
  };

  const handleUpdateSettings = (updatedSettings: AppSettings) => {
    setStore((prev) => ({ ...prev, settings: updatedSettings }));
    showToast('Settings Saved', 'Application preferences updated.', 'info');
  };

  const handleResetData = () => {
    const defaultData = storageService.resetData();
    setStore(defaultData);
  };

  // Quick Action Handler from Topbar
  const handleQuickAction = (action: 'task' | 'note' | 'event' | 'expense') => {
    if (action === 'task') setActiveModule('tasks');
    else if (action === 'note') setActiveModule('notes');
    else if (action === 'event') setActiveModule('calendar');
    else if (action === 'expense') setActiveModule('expenses');
  };

  // Pending Tasks Count
  const pendingTasksCount = store.tasks.filter((t) => t.status === 'PENDING').length;

  return (
    <div className={`min-h-screen font-sans flex overflow-hidden ${store.settings.theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'dark bg-slate-950 text-slate-100'}`}>
      {/* Auth Modal overlay if not logged in */}
      {!isAuthenticated && (
        <AuthModal
          currentUser={store.user}
          onLoginSuccess={(usr) => {
            handleUpdateUser(usr);
            setIsAuthenticated(true);
            localStorage.setItem('lifehub_is_authenticated', 'true');
          }}
          showToast={showToast}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        pendingTasksCount={pendingTasksCount}
        productivityScore={productivityMetrics.score}
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.setItem('lifehub_is_authenticated', 'false');
          showToast('Signed Out', 'Signed out of LifeHub desktop.', 'info');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar
          activeModule={activeModule}
          user={store.user}
          theme={store.settings.theme}
          onToggleTheme={() =>
            handleUpdateSettings({
              ...store.settings,
              theme: store.settings.theme === 'dark' ? 'light' : 'dark',
            })
          }
          onOpenGlobalSearch={() => setShowGlobalSearch(true)}
          onQuickAction={handleQuickAction}
          onSelectModule={setActiveModule}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {activeModule === 'dashboard' && (
            <DashboardView
              store={store}
              metrics={productivityMetrics}
              onSelectModule={setActiveModule}
              onToggleTask={handleToggleTask}
              onQuickAddNote={(title, content) =>
                handleAddNote({
                  title,
                  content,
                  category: 'Personal',
                  color: '#f59e0b',
                  isPinned: false,
                  isFavorite: false,
                })
              }
              onQuickAction={handleQuickAction}
            />
          )}

          {activeModule === 'tasks' && (
            <TaskManagerView
              tasks={store.tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeModule === 'notes' && (
            <NotesView
              notes={store.notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleToggleNotePin}
              onToggleFavorite={handleToggleNoteFavorite}
            />
          )}

          {activeModule === 'calendar' && (
            <CalendarView
              events={store.events}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeModule === 'expenses' && (
            <ExpenseTrackerView
              expenses={store.expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeModule === 'habits' && (
            <HabitTrackerView
              habits={store.habits}
              onAddHabit={handleAddHabit}
              onToggleHabitDay={handleToggleHabitDay}
              onDeleteHabit={handleDeleteHabit}
            />
          )}

          {activeModule === 'goals' && (
            <GoalTrackerView
              goals={store.goals}
              onAddGoal={handleAddGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onDeleteGoal={handleDeleteGoal}
              onTriggerConfetti={() => audioService.playChime('completion')}
            />
          )}

          {activeModule === 'journal' && (
            <JournalView
              journalEntries={store.journal}
              onAddEntry={handleAddJournalEntry}
              onDeleteEntry={handleDeleteJournalEntry}
            />
          )}

          {activeModule === 'focus' && (
            <FocusTimerView onLogFocusSession={handleLogFocusSession} />
          )}

          {activeModule === 'settings' && (
            <SettingsView
              user={store.user}
              settings={store.settings}
              store={store}
              onUpdateUser={handleUpdateUser}
              onUpdateSettings={handleUpdateSettings}
              onResetData={handleResetData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      {showGlobalSearch && (
        <GlobalSearchModal
          store={store}
          onSelectModule={setActiveModule}
          onClose={() => setShowGlobalSearch(false)}
        />
      )}

      {/* Toast Messages Overlay */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
