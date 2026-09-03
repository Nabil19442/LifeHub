import React, { useState } from 'react';
import { CalendarEvent } from '../../types';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface Props {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<Props> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<CalendarEvent['category']>('Meeting');

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      description: description.trim() || undefined,
      startDate,
      startTime,
      endTime,
      location: location.trim() || undefined,
      category,
      color: category === 'Deadline' ? '#ef4444' : category === 'Meeting' ? '#3b82f6' : '#8b5cf6',
    });

    setTitle('');
    setDescription('');
    setLocation('');
    setShowModal(false);
  };

  // Calendar month rendering details
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Calendar & Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track midterm exams, meetings, and deadlines saved to <span className="font-mono text-purple-400">events.dat</span>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-2 border-b border-slate-800">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank padding */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-20 bg-slate-950/20 rounded-xl" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isToday = dateFormatted === todayStr;
              const dayEvents = events.filter((e) => e.startDate === dateFormatted);

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`h-20 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                    isToday
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-800/40 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-xs font-bold ${isToday ? 'text-indigo-400' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded truncate text-white"
                        style={{ backgroundColor: e.color || '#8b5cf6' }}
                        title={`${e.title} (${e.startTime})`}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Upcoming Events List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <CalendarIcon className="w-5 h-5 text-purple-400" />
            <h3>Upcoming Events</h3>
          </div>

          {events.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800/80 transition-colors flex justify-between items-start"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: evt.color || '#8b5cf6' }}
                      />
                      <h4 className="text-sm font-semibold text-white truncate">{evt.title}</h4>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <p className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>{evt.startDate} • {evt.startTime} - {evt.endTime}</span>
                      </p>
                      {evt.location && (
                        <p className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span className="truncate">{evt.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors shrink-0"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Calendar Event</h3>
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
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Data Structures Midterm Quiz"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Start
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    End
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Location / Link
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Auditorium B or Zoom Link"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CalendarEvent['category'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Meeting">Meeting</option>
                  <option value="Deadline">Deadline</option>
                  <option value="Personal">Personal</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
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
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-5 py-2 rounded-xl shadow-lg"
                >
                  Save Event (events.dat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
