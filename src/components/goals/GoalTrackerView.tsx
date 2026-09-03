import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Goal, GoalMilestone } from '../../types';
import { Plus, Target, CheckSquare, Trash2, Trophy, X } from 'lucide-react';

interface Props {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'isCompleted' | 'createdAt'>) => void;
  onUpdateGoalProgress: (goalId: string, progress: number, milestones?: GoalMilestone[]) => void;
  onDeleteGoal: (id: string) => void;
  onTriggerConfetti: () => void;
}

export const GoalTrackerView: React.FC<Props> = ({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onDeleteGoal,
  onTriggerConfetti,
}) => {
  const [activeTab, setActiveTab] = useState<'SHORT_TERM' | 'LONG_TERM'>('SHORT_TERM');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'SHORT_TERM' | 'LONG_TERM'>('SHORT_TERM');
  const [category, setCategory] = useState('Academics');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [milestonesText, setMilestonesText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones: GoalMilestone[] = milestonesText
      .split('\n')
      .filter((m) => m.trim().length > 0)
      .map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m.trim(),
        isCompleted: false,
      }));

    onAddGoal({
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      progress: 0,
      deadline,
      milestones,
    });

    setTitle('');
    setDescription('');
    setMilestonesText('');
    setShowModal(false);
  };

  const handleToggleMilestone = (goal: Goal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
    const calcProgress =
      updatedMilestones.length > 0
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : goal.progress;

    if (calcProgress === 100 && goal.progress < 100) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onTriggerConfetti();
    }

    onUpdateGoalProgress(goal.id, calcProgress, updatedMilestones);
  };

  const filteredGoals = goals.filter((g) => g.type === activeTab);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Goal Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Set ambitious academic & career milestones stored in <span className="font-mono text-amber-400">goals.dat</span>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('SHORT_TERM')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'SHORT_TERM'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Short-Term Goals
        </button>
        <button
          onClick={() => setActiveTab('LONG_TERM')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'LONG_TERM'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Long-Term Vision
        </button>
      </div>

      {/* Goal Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.length === 0 ? (
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Target className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No {activeTab.toLowerCase().replace('_', ' ')} goals found.</p>
            <p className="text-xs text-slate-500 mt-1">Define clear milestones to level up your achievements.</p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                    {goal.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 leading-snug">{goal.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
                </div>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Slider / Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Target Progress</span>
                  </span>
                  <span className="text-amber-400 font-bold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              {goal.milestones.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Milestone Checklist
                  </span>
                  <div className="space-y-1.5">
                    {goal.milestones.map((m) => (
                      <label
                        key={m.id}
                        className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer transition-colors text-xs text-slate-200"
                      >
                        <input
                          type="checkbox"
                          checked={m.isCompleted}
                          onChange={() => handleToggleMilestone(goal, m.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/30"
                        />
                        <span className={m.isCompleted ? 'line-through text-slate-500' : ''}>
                          {m.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>Deadline: {goal.deadline}</span>
                {goal.progress === 100 && (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Goal Achieved!</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE GOAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create New Goal</h3>
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
                  Goal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master JavaFX & Launch Open Source App"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why is this goal important to you?"
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Goal Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'SHORT_TERM' | 'LONG_TERM')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="SHORT_TERM">Short-Term</option>
                    <option value="LONG_TERM">Long-Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Milestones (1 per line)
                </label>
                <textarea
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder="Sub-milestone 1&#10;Sub-milestone 2&#10;Sub-milestone 3"
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none resize-none font-mono"
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
                  className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  Save Goal (goals.dat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
