import {
  Task,
  Note,
  CalendarEvent,
  Expense,
  Habit,
  Goal,
  JournalEntry,
  FocusSession,
  UserProfile,
  AppSettings,
} from '../types';

export interface AppDataStore {
  user: UserProfile;
  settings: AppSettings;
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  expenses: Expense[];
  habits: Habit[];
  goals: Goal[];
  journal: JournalEntry[];
  focusSessions: FocusSession[];
}

const STORAGE_KEY = 'lifehub_app_data_v2';

const getTodayDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_USER: UserProfile = {
  username: 'alex_dev',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@lifehub.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  rememberMe: true,
  bio: 'Computer Science Student & Tech Enthusiast building smart productivity tools.',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  fontSize: 'normal',
  notificationsEnabled: true,
  soundEnabled: true,
  pomodoroWorkDuration: 25,
  pomodoroBreakDuration: 5,
  autoSaveInterval: 5,
};

export const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Complete JavaFX LifeHub OOP Architecture Diagram',
    description: 'Ensure MVC patterns, Class Diagrams, and .dat File Handlers adhere to Java 21 standards.',
    dueDate: getTodayDateStr(0),
    priority: 'HIGH',
    category: 'Study',
    status: 'IN_PROGRESS',
    createdAt: getTodayDateStr(-2),
  },
  {
    id: 't-2',
    title: 'Prepare Midterm Presentation Slides',
    description: 'Design key UI mockups and showcase habit streak algorithm.',
    dueDate: getTodayDateStr(0),
    priority: 'HIGH',
    category: 'Study',
    status: 'COMPLETED',
    createdAt: getTodayDateStr(-1),
    completedAt: getTodayDateStr(0),
  },
  {
    id: 't-3',
    title: 'Review Monthly Budget & Spending Targets',
    description: 'Categorize recent grocery and study material expenses.',
    dueDate: getTodayDateStr(1),
    priority: 'MEDIUM',
    category: 'Finance',
    status: 'PENDING',
    createdAt: getTodayDateStr(0),
  },
  {
    id: 't-4',
    title: '30-Minute Evening Focus Reading',
    description: 'Read Chapter 4 on Clean Code Architecture and SOLID principles.',
    dueDate: getTodayDateStr(0),
    priority: 'LOW',
    category: 'Personal',
    status: 'PENDING',
    createdAt: getTodayDateStr(0),
  },
];

export const DEFAULT_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'OOP Design Principles Cheat Sheet',
    content: '1. Encapsulation: Keep state private using getters/setters.\n2. Inheritance: Extend reusable behavior.\n3. Polymorphism: Override methods cleanly.\n4. Abstraction: Use Interfaces (Searchable, Validatable).\n5. Composition: Has-A relationship over Is-A.',
    category: 'Study',
    color: '#3b82f6',
    isPinned: true,
    isFavorite: true,
    createdAt: getTodayDateStr(-5),
    updatedAt: getTodayDateStr(0),
  },
  {
    id: 'n-2',
    title: 'Weekly Workout & Wellness Plan',
    content: '- Mon: Lower body & Core\n- Wed: Upper body & Cardio\n- Fri: Full body HIIT\n- Sun: Rest, Stretching & Journaling',
    category: 'Health',
    color: '#10b981',
    isPinned: false,
    isFavorite: true,
    createdAt: getTodayDateStr(-3),
    updatedAt: getTodayDateStr(-1),
  },
  {
    id: 'n-3',
    title: 'Project Ideas for Next Semester',
    content: '- AI-assisted Code Review Tool\n- Smart Expense Splitter with OCR receipts\n- Cross-platform Focus Synth Ambient Generator',
    category: 'Work',
    color: '#8b5cf6',
    isPinned: false,
    isFavorite: false,
    createdAt: getTodayDateStr(-2),
    updatedAt: getTodayDateStr(-2),
  },
];

export const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: 'e-1',
    title: 'OOP Project Code Review Sync',
    description: 'Review Java object serialization implementation with project team.',
    startDate: getTodayDateStr(0),
    startTime: '14:30',
    endTime: '15:30',
    location: 'Lab Room 304 / Zoom',
    category: 'Meeting',
    color: '#3b82f6',
  },
  {
    id: 'e-2',
    title: 'Data Structures Midterm Quiz',
    description: 'Topics: Trees, Graphs, Hash Maps, Binary Heaps.',
    startDate: getTodayDateStr(2),
    startTime: '10:00',
    endTime: '11:30',
    location: 'Main Auditorium B',
    category: 'Deadline',
    color: '#ef4444',
  },
  {
    id: 'e-3',
    title: 'Weekend Hackathon Orientation',
    description: 'Team formation and project prompt release.',
    startDate: getTodayDateStr(4),
    startTime: '18:00',
    endTime: '20:00',
    location: 'Innovation Hub',
    category: 'Personal',
    color: '#10b981',
  },
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'ex-1',
    title: 'Monthly Scholarship Stipend',
    amount: 1200,
    type: 'INCOME',
    category: 'Salary',
    date: getTodayDateStr(-5),
    note: 'Direct deposit',
  },
  {
    id: 'ex-2',
    title: 'JavaFX & Software Architecture Textbooks',
    amount: 85.50,
    type: 'EXPENSE',
    category: 'Study',
    date: getTodayDateStr(-3),
    note: 'University bookstore',
  },
  {
    id: 'ex-3',
    title: 'Weekly Healthy Groceries',
    amount: 64.20,
    type: 'EXPENSE',
    category: 'Food',
    date: getTodayDateStr(-1),
    note: 'Organic market',
  },
  {
    id: 'ex-4',
    title: 'High-speed Fiber Internet Bill',
    amount: 45.00,
    type: 'EXPENSE',
    category: 'Utilities',
    date: getTodayDateStr(-4),
    note: 'Auto pay',
  },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Hydration & Stretches',
    category: 'Health',
    icon: 'Droplet',
    color: '#3b82f6',
    targetFrequencyPerWeek: 7,
    completedDates: [getTodayDateStr(-3), getTodayDateStr(-2), getTodayDateStr(-1), getTodayDateStr(0)],
    streak: 4,
    createdAt: getTodayDateStr(-10),
  },
  {
    id: 'h-2',
    name: 'Focus Coding / Study Session',
    category: 'Study',
    icon: 'Code',
    color: '#6366f1',
    targetFrequencyPerWeek: 5,
    completedDates: [getTodayDateStr(-2), getTodayDateStr(-1), getTodayDateStr(0)],
    streak: 3,
    createdAt: getTodayDateStr(-10),
  },
  {
    id: 'h-3',
    name: 'Evening Reflection & Gratitude',
    category: 'Mindfulness',
    icon: 'BookOpen',
    color: '#ec4899',
    targetFrequencyPerWeek: 7,
    completedDates: [getTodayDateStr(-1)],
    streak: 1,
    createdAt: getTodayDateStr(-10),
  },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Achieve 4.0 GPA in Object-Oriented Programming',
    description: 'Master Java 21, JavaFX desktop UI construction, multithreading, and OOP design patterns.',
    type: 'SHORT_TERM',
    category: 'Academics',
    progress: 85,
    deadline: getTodayDateStr(30),
    isCompleted: false,
    milestones: [
      { id: 'm-1', title: 'Submit LifeHub Architecture Document', isCompleted: true },
      { id: 'm-2', title: 'Implement Data Serialization Services (.dat)', isCompleted: true },
      { id: 'm-3', title: 'Complete Midterm Defense', isCompleted: true },
      { id: 'm-4', title: 'Final Code Optimization & Clean up', isCompleted: false },
    ],
    createdAt: getTodayDateStr(-20),
  },
  {
    id: 'g-2',
    title: 'Build & Deploy Full Stack Portfolio App',
    description: 'Construct a commercial-grade SaaS dashboard highlighting desktop & web expertise.',
    type: 'LONG_TERM',
    category: 'Career',
    progress: 60,
    deadline: getTodayDateStr(90),
    isCompleted: false,
    milestones: [
      { id: 'm-21', title: 'Finalize UI Component System', isCompleted: true },
      { id: 'm-22', title: 'Add Focus Timer & Audio Engine', isCompleted: true },
      { id: 'm-23', title: 'Cross Platform Desktop Installer', isCompleted: false },
    ],
    createdAt: getTodayDateStr(-40),
  },
];

export const DEFAULT_JOURNAL: JournalEntry[] = [
  {
    id: 'j-1',
    date: getTodayDateStr(0),
    title: 'Productive Breakthroughs on Desktop UI Architecture',
    content: 'Today was highly rewarding. Solved clean UI card nesting and structured the JavaFX serialization logic. Feeling confident about the upcoming project review.',
    mood: 'GREAT',
    tags: ['Coding', 'Milestone', 'Focus'],
    createdAt: getTodayDateStr(0),
  },
  {
    id: 'j-2',
    date: getTodayDateStr(-1),
    title: 'Steady Progress and Balanced Workouts',
    content: 'Maintained a good focus streak in the morning and followed up with an energizing gym session.',
    mood: 'GOOD',
    tags: ['Fitness', 'Productivity'],
    createdAt: getTodayDateStr(-1),
  },
];

export const DEFAULT_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'f-1',
    durationMinutes: 25,
    type: 'POMODORO',
    completedAt: `${getTodayDateStr(0)}T11:30:00`,
    taskTitle: 'Complete JavaFX LifeHub OOP Architecture Diagram',
  },
  {
    id: 'f-2',
    durationMinutes: 25,
    type: 'POMODORO',
    completedAt: `${getTodayDateStr(0)}T10:00:00`,
    taskTitle: 'Prepare Midterm Presentation Slides',
  },
];

class StorageService {
  loadData(): AppDataStore {
    let savedUser = DEFAULT_USER;
    try {
      const currentUsrStr = localStorage.getItem('lifehub_current_user');
      if (currentUsrStr) {
        savedUser = JSON.parse(currentUsrStr);
      }
    } catch (e) {
      console.error('Failed to parse saved current user:', e);
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppDataStore;
        return {
          user: parsed.user || savedUser,
          settings: parsed.settings || DEFAULT_SETTINGS,
          tasks: parsed.tasks || DEFAULT_TASKS,
          notes: parsed.notes || DEFAULT_NOTES,
          events: parsed.events || DEFAULT_EVENTS,
          expenses: parsed.expenses || DEFAULT_EXPENSES,
          habits: parsed.habits || DEFAULT_HABITS,
          goals: parsed.goals || DEFAULT_GOALS,
          journal: parsed.journal || DEFAULT_JOURNAL,
          focusSessions: parsed.focusSessions || DEFAULT_FOCUS_SESSIONS,
        };
      }
    } catch (e) {
      console.error('Failed to parse stored data, using defaults:', e);
    }

    const defaultData: AppDataStore = {
      user: savedUser,
      settings: DEFAULT_SETTINGS,
      tasks: DEFAULT_TASKS,
      notes: DEFAULT_NOTES,
      events: DEFAULT_EVENTS,
      expenses: DEFAULT_EXPENSES,
      habits: DEFAULT_HABITS,
      goals: DEFAULT_GOALS,
      journal: DEFAULT_JOURNAL,
      focusSessions: DEFAULT_FOCUS_SESSIONS,
    };
    this.saveData(defaultData);
    return defaultData;
  }

  saveData(data: AppDataStore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  resetData(): AppDataStore {
    const fresh: AppDataStore = {
      user: DEFAULT_USER,
      settings: DEFAULT_SETTINGS,
      tasks: DEFAULT_TASKS,
      notes: DEFAULT_NOTES,
      events: DEFAULT_EVENTS,
      expenses: DEFAULT_EXPENSES,
      habits: DEFAULT_HABITS,
      goals: DEFAULT_GOALS,
      journal: DEFAULT_JOURNAL,
      focusSessions: DEFAULT_FOCUS_SESSIONS,
    };
    this.saveData(fresh);
    return fresh;
  }

  /**
   * Generates a simulated Java .dat Object Serialization File stream content
   */
  generateBinaryDatFile(dataName: string, items: unknown[]): string {
    const header = `\xAC\xED\x00\x05sr\x00\x1a${dataName}\x00\x00\x00\x00\x00\x00\x00\x01\x02\x00\x02I\x00\x02countL\x00\x05items[Ljava/lang/Object;`;
    const jsonBody = JSON.stringify(items, null, 2);
    return `/* JAVA SERIALIZATION STREAM SIMULATOR (.dat) */\n/* File: data/${dataName.toLowerCase()}.dat */\n/* Format: Java ObjectOutputStream / Serializable */\n\n${header}\n\n// DESERIALIZED PAYLOAD OBJECTS:\n${jsonBody}`;
  }
}

export const storageService = new StorageService();
