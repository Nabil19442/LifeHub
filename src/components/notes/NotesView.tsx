import React, { useState } from 'react';
import { Note } from '../../types';
import {
  Plus,
  Search,
  Pin,
  Heart,
  Trash2,
  Edit2,
  FileText,
  X,
} from 'lucide-react';

interface Props {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const NotesView: React.FC<Props> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePin,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study');
  const [color, setColor] = useState('#3b82f6');

  const openCreateModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('Study');
    setColor('#3b82f6');
    setShowModal(true);
  };

  const openEditModal = (n: Note) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category);
    setColor(n.color || '#3b82f6');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: title.trim(),
        content: content.trim(),
        category,
        color,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddNote({
        title: title.trim(),
        content: content.trim(),
        category,
        color,
        isPinned: false,
        isFavorite: false,
      });
    }

    setShowModal(false);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quick Notes</h2>
          <p className="text-xs text-slate-400 mt-1">
            Capture study points, architecture design ideas, and pin favorites to <span className="font-mono text-emerald-400">notes.dat</span>.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes content..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Categories</option>
          <option value="Study">Study</option>
          <option value="Work">Work</option>
          <option value="Health">Health</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 fill-amber-400" />
            <span>Pinned Notes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && (
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Notes</h3>
        )}

        {filteredNotes.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No notes found.</p>
            <p className="text-xs text-slate-500 mt-1">Create a note to start building your personal knowledge base.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={onDeleteNote}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT NOTE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h3>
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
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write note details, code snippets, or thoughts..."
                  rows={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-9 bg-slate-800 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  {editingNote ? 'Save Changes' : 'Save Note (notes.dat)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual note cards
const NoteCard: React.FC<{
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}> = ({ note, onEdit, onDelete, onTogglePin, onToggleFavorite }) => {
  return (
    <div
      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all duration-200 relative overflow-hidden group"
      style={{ borderTop: `4px solid ${note.color || '#3b82f6'}` }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {note.category}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleFavorite(note.id)}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
              title="Favorite"
            >
              <Heart
                className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
            <button
              onClick={() => onTogglePin(note.id)}
              className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
              title="Pin to top"
            >
              <Pin
                className={`w-4 h-4 ${note.isPinned ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>
          </div>
        </div>

        <h4 className="text-base font-bold text-white mb-2 leading-snug">{note.title}</h4>
        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-6">
          {note.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-500">
        <span>Updated {note.updatedAt}</span>

        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
