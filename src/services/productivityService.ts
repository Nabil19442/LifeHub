import { Task, Habit, Goal, JournalEntry, FocusSession, ProductivityMetrics } from '../types';

export function calculateProductivityScore(
  tasks: Task[],
  habits: Habit[],
  goals: Goal[],
  journalEntries: JournalEntry[],
  focusSessions: FocusSession[]
): ProductivityMetrics {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Task Score (35%)
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.completedAt?.startsWith(todayStr));
  const totalTasksToday = todayTasks.length > 0 ? todayTasks.length : tasks.length;
  const completedTasksToday = todayTasks.filter(t => t.status === 'COMPLETED').length;
  const taskRatio = totalTasksToday > 0 ? Math.min(1, completedTasksToday / totalTasksToday) : 0.8;

  // 2. Habit Score (25%)
  const totalHabitsToday = habits.length;
  const habitsCompletedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const habitRatio = totalHabitsToday > 0 ? habitsCompletedToday / totalHabitsToday : 0.7;

  // 3. Focus Score (20%)
  const focusMinutesToday = focusSessions
    .filter(s => s.completedAt.startsWith(todayStr))
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusRatio = Math.min(1, focusMinutesToday / 60); // 60 mins target for max score

  // 4. Goals Score (10%)
  const activeGoals = goals.filter(g => !g.isCompleted);
  const avgGoalProgress = activeGoals.length > 0
    ? activeGoals.reduce((acc, g) => acc + g.progress, 0) / activeGoals.length / 100
    : 0.75;
  const goalsAchievedCount = goals.filter(g => g.isCompleted).length;

  // 5. Journal Score (10%)
  const journalWrittenToday = journalEntries.some(j => j.date === todayStr);
  const journalRatio = journalWrittenToday ? 1 : 0;

  // Calculated score
  const scoreRaw = Math.round(
    (taskRatio * 35) +
    (habitRatio * 25) +
    (focusRatio * 20) +
    (avgGoalProgress * 10) +
    (journalRatio * 10)
  );

  const score = Math.max(10, Math.min(100, scoreRaw));

  let badge = '🌱 Getting Started';
  if (score >= 90) badge = '👑 Productivity Titan';
  else if (score >= 75) badge = '⚡ Focus Master';
  else if (score >= 60) badge = '🔥 Consistent Achiever';
  else if (score >= 40) badge = '📈 Steady Builder';

  return {
    score,
    badge,
    tasksCompletedToday: completedTasksToday,
    totalTasksToday,
    habitsCompletedToday,
    totalHabitsToday,
    focusMinutesToday,
    goalsAchieved: goalsAchievedCount,
    journalWrittenToday,
  };
}

export const DAILY_QUOTES = [
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "Focus is a matter of deciding what things you're NOT going to do.", author: "John Carmack" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Simplicity boils down to two steps: Identify the essential. Eliminate the rest.", author: "Leo Babauta" },
];
