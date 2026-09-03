import React, { useState, useEffect } from 'react';
import { audioService } from '../../services/audioService';
import { FocusSession } from '../../types';
import { Play, Pause, RotateCcw, Zap, Timer, Clock, Bell, CheckCircle2 } from 'lucide-react';

interface Props {
  onLogFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
}

export const FocusTimerView: React.FC<Props> = ({ onLogFocusSession }) => {
  const [mode, setMode] = useState<'POMODORO' | 'STOPWATCH' | 'COUNTDOWN'>('POMODORO');
  
  // Pomodoro timer state (in seconds)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [taskTitle, setTaskTitle] = useState('Deep Work & JavaFX Coding Session');

  // Stopwatch state
  const [stopwatchSecs, setStopwatchSecs] = useState(0);
  const [laps, setLaps] = useState<string[]>([]);

  // Countdown state
  const [customMins, setCustomMins] = useState(15);

  // Active interval handler
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (mode === 'POMODORO' || mode === 'COUNTDOWN') {
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer!);
              setIsRunning(false);
              audioService.playChime('completion');

              const durationMins = mode === 'POMODORO' ? 25 : customMins;
              onLogFocusSession({
                durationMinutes: durationMins,
                type: mode,
                taskTitle,
              });

              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (mode === 'STOPWATCH') {
        timer = setInterval(() => {
          setStopwatchSecs((prev) => prev + 1);
        }, 1000);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, customMins, taskTitle, onLogFocusSession]);

  const handleStart = () => {
    setIsRunning(true);
    audioService.playChime('tick');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'POMODORO') setTimeLeft(25 * 60);
    else if (mode === 'COUNTDOWN') setTimeLeft(customMins * 60);
    else if (mode === 'STOPWATCH') {
      setStopwatchSecs(0);
      setLaps([]);
    }
  };

  const handleAddLap = () => {
    const mins = Math.floor(stopwatchSecs / 60);
    const secs = stopwatchSecs % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    setLaps([formatted, ...laps]);
  };

  const setPomodoroDuration = (mins: number) => {
    setIsRunning(false);
    setTimeLeft(mins * 60);
  };

  const formatTimerDisplay = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Circular progress calculation
  const totalSecs = mode === 'POMODORO' ? 25 * 60 : customMins * 60;
  const progressRatio = totalSecs > 0 ? (totalSecs - timeLeft) / totalSecs : 0;
  const strokeDashoffset = 565 - 565 * progressRatio;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Focus Timer</h2>
          <p className="text-xs text-slate-400 mt-1">
            Multithreaded Pomodoro timer logs deep work sessions directly into your <span className="text-indigo-400 font-semibold">Productivity Score</span>.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => {
              setMode('POMODORO');
              setIsRunning(false);
              setTimeLeft(25 * 60);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'POMODORO' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => {
              setMode('STOPWATCH');
              setIsRunning(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'STOPWATCH' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => {
              setMode('COUNTDOWN');
              setIsRunning(false);
              setTimeLeft(customMins * 60);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'COUNTDOWN' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Countdown
          </button>
        </div>
      </div>

      {/* Main Focus Center Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center max-w-xl mx-auto text-center relative overflow-hidden">
        {/* Preset Duration Buttons for Pomodoro */}
        {mode === 'POMODORO' && (
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => setPomodoroDuration(25)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-indigo-300"
            >
              25m Focus
            </button>
            <button
              onClick={() => setPomodoroDuration(5)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-emerald-300"
            >
              5m Short Break
            </button>
            <button
              onClick={() => setPomodoroDuration(15)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-purple-300"
            >
              15m Long Break
            </button>
          </div>
        )}

        {/* Circular Progress Display */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            {(mode === 'POMODORO' || mode === 'COUNTDOWN') && (
              <circle
                cx="100"
                cy="100"
                r="90"
                className="stroke-indigo-500 transition-all duration-1000"
                strokeWidth="10"
                strokeDasharray="565"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            )}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
              {mode === 'STOPWATCH'
                ? formatTimerDisplay(stopwatchSecs)
                : formatTimerDisplay(timeLeft)}
            </span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">
              {isRunning ? 'Session Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Task Title Tag */}
        <div className="w-full max-w-sm my-4">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Focus Session Objective..."
            className="w-full text-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-indigo-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-4 mt-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all"
              title="Start Timer"
            >
              <Play className="w-6 h-6 ml-0.5 fill-white" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all"
              title="Pause Timer"
            >
              <Pause className="w-6 h-6 fill-slate-950" />
            </button>
          )}

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {mode === 'STOPWATCH' && isRunning && (
            <button
              onClick={handleAddLap}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow"
            >
              Lap
            </button>
          )}
        </div>

        {/* Stopwatch Laps Display */}
        {mode === 'STOPWATCH' && laps.length > 0 && (
          <div className="w-full mt-6 pt-4 border-t border-slate-800 space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left">
              Lap History
            </span>
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between text-xs font-mono text-slate-300 py-1 border-b border-slate-800/50">
                <span>Lap {laps.length - idx}</span>
                <span className="text-indigo-400 font-bold">{lap}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
