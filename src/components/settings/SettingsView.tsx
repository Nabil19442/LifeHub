import React, { useState } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { storageService, AppDataStore } from '../../services/storageService';
import {
  User,
  Settings as SettingsIcon,
  Moon,
  Sun,
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  settings: AppSettings;
  store: AppDataStore;
  onUpdateUser: (u: UserProfile) => void;
  onUpdateSettings: (s: AppSettings) => void;
  onResetData: () => void;
  showToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<Props> = ({
  user,
  settings,
  store,
  onUpdateUser,
  onUpdateSettings,
  onResetData,
  showToast,
}) => {
  // User Profile Form State
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [bio, setBio] = useState(user.bio || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName: fullName.trim(),
      email: email.trim(),
      avatarUrl: avatarUrl.trim(),
      bio: bio.trim() || undefined,
    });
    showToast('Profile Updated', 'Your profile details were saved to users.dat', 'success');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(store, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifehub_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup Exported', 'Full JSON application state downloaded.', 'success');
  };

  const handleExportDatFiles = () => {
    const tasksDat = storageService.generateBinaryDatFile('Task', store.tasks);
    const blob = new Blob([tasksDat], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.dat';
    a.click();
    showToast('Java .dat Binary Exported', 'Downloaded tasks.dat object serialization file.', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & Data Management</h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize themes, user profiles, and manage Java Object Serialization (.dat) files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <User className="w-5 h-5 text-indigo-400" />
            <h3>User Profile Credentials</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
              />
              <div className="flex-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Bio / Academic Program
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg transition-colors"
            >
              Update Profile (users.dat)
            </button>
          </form>
        </div>

        {/* Theme & Display Options */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <SettingsIcon className="w-5 h-5 text-purple-400" />
            <h3>Appearance & Preferences</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Active Theme Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-2 ${
                    settings.theme === 'dark'
                      ? 'bg-indigo-950/80 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Modern</span>
                </button>
                <button
                  onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
                  className={`p-3 rounded-2xl border text-left flex items-center space-x-2 ${
                    settings.theme === 'light'
                      ? 'bg-amber-950/80 border-amber-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Professional</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Font Scaling
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'normal', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                    className={`py-2 px-3 rounded-xl border text-center capitalize ${
                      settings.fontSize === size
                        ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Serialization (.dat) File Management */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <h3>Local File Storage (.dat Serialization Engine)</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            LifeHub strictly avoids SQL databases and uses local Java Object Serialization stream (.dat) files stored in <span className="font-mono text-emerald-400">data/</span> directory (<span className="font-mono text-slate-400">tasks.dat</span>, <span className="font-mono text-slate-400">notes.dat</span>, <span className="font-mono text-slate-400">events.dat</span>, etc.).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportDatFiles}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export tasks.dat Binary</span>
            </button>

            <button
              onClick={handleExportJson}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all local data back to initial sample records?')) {
                  onResetData();
                  showToast('Data Reset', 'Restored original sample records.', 'info');
                }
              }}
              className="bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-medium px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
