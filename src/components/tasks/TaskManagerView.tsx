import React, { useState } from 'react';
import { Task, Priority, TaskCategory, TaskStatus } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  Tag,
  BarChart2,
  X,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

export const TaskManagerView: React.FC<Props> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [category, setCategory] = useState<TaskCategory>('Study');

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString().split('T')[0]);
    setPriority('MEDIUM');
    setCategory('Study');
    setShowModal(true);
  };

  const openEditModal = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setDueDate(t.dueDate);
    setPriority(t.priority);
    setCategory(t.category);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        priority,
        category,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        priority,
        category,
        status: 'PENDING',
      });
    }

    setShowModal(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Task Statistics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Task Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize tasks, set priorities, and save directly to <span className="font-mono text-indigo-400">tasks.dat</span>.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Quick Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Total Tasks</span>
          <span className="text-2xl font-extrabold text-white">{totalTasks}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-400">{completedCount}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Pending</span>
          <span className="text-2xl font-extrabold text-amber-400">{pendingCount}</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 block font-medium">Completion Rate</span>
          <span className="text-2xl font-extrabold text-indigo-400">{completionPercentage}%</span>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title or keyword..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List Table / Cards */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <BarChart2 className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No tasks found matching your filters.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting search parameters or create a new task.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                >
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1 min-w-0">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 bg-slate-800 px-2.5 py-0.5 rounded-full">
                      <Calendar className="w-3 h-3 text-indigo-400" />
                      <span>{task.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1 bg-slate-800 px-2.5 py-0.5 rounded-full">
                      <Tag className="w-3 h-3 text-purple-400" />
                      <span>{task.category}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    task.priority === 'HIGH'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      : task.priority === 'MEDIUM'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {task.priority}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingTask ? 'Edit Task' : 'Create New Task'}
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
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete JavaFX File Manager tests"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
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
                  placeholder="Add additional details or sub-steps..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                </select>
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
                  {editingTask ? 'Save Changes' : 'Save Task (tasks.dat)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
