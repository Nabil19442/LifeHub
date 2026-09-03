export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  location?: string;
  category: 'Meeting' | 'Personal' | 'Deadline' | 'Birthday' | 'Holiday' | 'Other';
  color: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export interface Expense {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  targetFrequencyPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD array
  streak: number;
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'SHORT_TERM' | 'LONG_TERM';
  category: string;
  progress: number; // 0 - 100
  deadline: string; // YYYY-MM-DD
  milestones: GoalMilestone[];
  isCompleted: boolean;
  createdAt: string;
}

export type MoodType = 'GREAT' | 'GOOD' | 'NEUTRAL' | 'STRESSED' | 'TIRED';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  createdAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  type: 'POMODORO' | 'STOPWATCH' | 'COUNTDOWN';
  completedAt: string;
  taskTitle?: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  rememberMe: boolean;
  bio?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'midnight' | 'glass';
  fontSize: 'small' | 'normal' | 'large';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  pomodoroWorkDuration: number; // minutes
  pomodoroBreakDuration: number; // minutes
  autoSaveInterval: number; // seconds
}

export interface ProductivityMetrics {
  score: number; // 0 - 100
  badge: string;
  tasksCompletedToday: number;
  totalTasksToday: number;
  habitsCompletedToday: number;
  totalHabitsToday: number;
  focusMinutesToday: number;
  goalsAchieved: number;
  journalWrittenToday: boolean;
}

export type ActiveModule =
  | 'dashboard'
  | 'tasks'
  | 'notes'
  | 'calendar'
  | 'expenses'
  | 'habits'
  | 'goals'
  | 'journal'
  | 'focus'
  | 'settings';
