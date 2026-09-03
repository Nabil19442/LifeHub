import React, { useState } from 'react';
import { JournalEntry, MoodType } from '../../types';
import { Plus, BookOpen, Search, Smile, Meh, Frown, Zap, Trash2, X } from 'lucide-react';

interface Props {
  journalEntries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
}

const REFLECTION_PROMPTS = [
  "What was the most rewarding OOP architecture insight you gained today?",
  "What is one small challenge you overcame in your study routine?",
  "How did you feel about your focus level during today's task execution?",
  "Name 3 things you are grateful for today.",
  "What is your key priority for tomorrow?",
];

export const JournalView: React.FC<Props> = ({ journalEntries, onAddEntry, onDeleteEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('GREAT');

  const handlePrompt = () => {
    const randomPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
    setContent((prev) => (prev ? `${prev}\n\nReflection: ${randomPrompt}` : `Reflection: ${randomPrompt}`));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddEntry({
      date,
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: ['DailyLog'],
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  const filteredEntries = journalEntries.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMoodBadge = (m: MoodType) => {
    switch (m) {
      case 'GREAT':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">😄 Productive</span>;
      case 'GOOD':
        return <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-500/30 text-[11px] font-bold">😊 Happy</span>;
      case 'NEUTRAL':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold">😐 Balanced</span>;
      case 'STRESSED':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30 text-[11px] font-bold">😔 Stressed</span>;
      case 'TIRED':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-[11px] font-bold">😴 Exhausted</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Daily Journal & Mood Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reflect on daily achievements, track moods, and save logs to <span className="font-mono text-indigo-400">journal.dat</span>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write Journal Entry</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past journal reflections..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Journal Entries Grid */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No journal logs written yet.</p>
            <p className="text-xs text-slate-500 mt-1">Log your thoughts today to boost your productivity score!</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getMoodBadge(entry.mood)}
                  <span className="text-xs font-mono text-slate-400">{entry.date}</span>
                </div>

                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white">{entry.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* CREATE JOURNAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">New Journal Entry</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-left">
              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as MoodType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="GREAT">😄 Productive</option>
                    <option value="GOOD">😊 Happy</option>
                    <option value="NEUTRAL">😐 Balanced</option>
                    <option value="STRESSED">😔 Stressed</option>
                    <option value="TIRED">😴 Exhausted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Milestone achievements in Java Serialization"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Journal Reflection
                  </label>
                  <button
                    type="button"
                    onClick={handlePrompt}
                    className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Insert Prompt</span>
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Express your daily reflections..."
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
                  required
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
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  Save Journal (journal.dat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
