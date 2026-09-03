import React, { useState } from 'react';
import { AppDataStore } from '../../services/storageService';
import { ActiveModule } from '../../types';
import { Search, CheckSquare, FileText, Calendar, BookOpen, Flame, Target, X } from 'lucide-react';

interface Props {
  store: AppDataStore;
  onSelectModule: (m: ActiveModule) => void;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ store, onSelectModule, onClose }) => {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const matchedTasks = q
    ? store.tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
      )
    : [];

  const matchedNotes = q
    ? store.notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    : [];

  const matchedEvents = q
    ? store.events.filter((e) => e.title.toLowerCase().includes(q) || (e.location && e.location.toLowerCase().includes(q)))
    : [];

  const matchedJournal = q
    ? store.journal.filter((j) => j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q))
    : [];

  const totalResults = matchedTasks.length + matchedNotes.length + matchedEvents.length + matchedJournal.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search across Tasks, Notes, Calendar, Journal..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {!query.trim() ? (
            <p className="text-center py-8 text-slate-500">
              Type keywords like "JavaFX", "OOP", "Exam", or "Budget" to search all records.
            </p>
          ) : totalResults === 0 ? (
            <p className="text-center py-8 text-slate-500">No matching items found for "{query}".</p>
          ) : (
            <>
              {matchedTasks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Tasks ({matchedTasks.length})
                  </span>
                  {matchedTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectModule('tasks');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span className="font-semibold">{t.title}</span>
                      <span className="text-[10px] text-indigo-300 font-mono">{t.dueDate}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedNotes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Notes ({matchedNotes.length})
                  </span>
                  {matchedNotes.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        onSelectModule('notes');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span className="font-semibold truncate">{n.title}</span>
                      <span className="text-[10px] text-emerald-300">{n.category}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedEvents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                    Events ({matchedEvents.length})
                  </span>
                  {matchedEvents.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => {
                        onSelectModule('calendar');
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span className="font-semibold">{e.title}</span>
                      <span className="text-[10px] text-purple-300">{e.startDate} ({e.startTime})</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
