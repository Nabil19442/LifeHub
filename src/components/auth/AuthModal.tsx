import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Shield, Lock, User, Mail, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
  showToast: (title: string, msg?: string, type?: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<Props> = ({ onLoginSuccess, currentUser, showToast }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login State
  const [username, setUsername] = useState(currentUser.username || 'alex_dev');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      showToast('Validation Error', 'Please enter both username and password.', 'error');
      return;
    }

    // Check if user exists in saved users DB
    const savedUsersStr = localStorage.getItem('lifehub_users_db');
    let usersList: Array<{ username: string; password: string; profile: UserProfile }> = [];
    let userToLogin: UserProfile | null = null;

    if (savedUsersStr) {
      try {
        usersList = JSON.parse(savedUsersStr);
        const match = usersList.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
        if (match) {
          if (match.password !== cleanPassword) {
            showToast('Invalid Credentials', 'Incorrect password for this username.', 'error');
            return;
          }
          userToLogin = match.profile;
        }
      } catch (err) {
        console.error('Failed to parse users db:', err);
      }
    }

    if (!userToLogin) {
      userToLogin = {
        username: cleanUsername,
        fullName: cleanUsername === 'alex_dev' ? 'Alex Morgan' : cleanUsername,
        email: `${cleanUsername}@lifehub.io`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rememberMe,
      };

      // Auto save credentials so login works next time
      usersList = usersList.filter((u) => u.username.toLowerCase() !== cleanUsername.toLowerCase());
      usersList.push({
        username: cleanUsername,
        password: cleanPassword,
        profile: userToLogin,
      });
      localStorage.setItem('lifehub_users_db', JSON.stringify(usersList));
    }

    localStorage.setItem('lifehub_current_user', JSON.stringify(userToLogin));
    showToast('Welcome back!', `Logged in successfully as @${userToLogin.username}`, 'success');
    onLoginSuccess(userToLogin);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      showToast('Validation Error', 'All fields are required.', 'error');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast('Password Mismatch', 'Passwords do not match.', 'error');
      return;
    }

    const newUserProfile: UserProfile = {
      username: regUsername.trim(),
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rememberMe: true,
    };

    // Save to users DB
    const savedUsersStr = localStorage.getItem('lifehub_users_db');
    let usersList: Array<{ username: string; password: string; profile: UserProfile }> = [];
    if (savedUsersStr) {
      try {
        usersList = JSON.parse(savedUsersStr);
      } catch (err) {
        usersList = [];
      }
    }

    // Filter out duplicate username if exists
    usersList = usersList.filter((u) => u.username.toLowerCase() !== newUserProfile.username.toLowerCase());
    usersList.push({
      username: newUserProfile.username,
      password: regPassword.trim(),
      profile: newUserProfile,
    });

    localStorage.setItem('lifehub_users_db', JSON.stringify(usersList));
    localStorage.setItem('lifehub_current_user', JSON.stringify(newUserProfile));

    showToast('Account Created!', 'Your user credentials have been saved.', 'success');
    onLoginSuccess(newUserProfile);
  };

  const handleQuickDemo = () => {
    const demoUser: UserProfile = {
      username: 'alex_dev',
      fullName: 'Alex Morgan',
      email: 'alex.morgan@lifehub.io',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rememberMe: true,
    };
    localStorage.setItem('lifehub_current_user', JSON.stringify(demoUser));
    showToast('Demo Access Granted', 'Signed in as Alex Morgan (@alex_dev)', 'success');
    onLoginSuccess(demoUser);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast('Required Field', 'Please enter your account email address.', 'error');
      return;
    }
    setResetSent(true);
    showToast('Reset Link Dispatched', `Password reset instructions sent to ${resetEmail}`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Glass subtle header accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LifeHub</h1>
          <p className="text-sm text-slate-400 mt-1">Smart Personal Productivity Desktop</p>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span className="ml-2">Remember me (users.dat)</span>
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-xs text-slate-500">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-sm font-medium py-2 rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Quick Demo Sign In</span>
            </button>

            <p className="text-xs text-center text-slate-400 pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Register Now
              </button>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="alex_dev"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@lifehub.io"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Create Account (users.dat)</span>
            </button>

            <p className="text-xs text-center text-slate-400 pt-2">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {resetSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-semibold text-white">Reset Email Dispatched!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We sent reset instructions to <span className="text-indigo-300 font-medium">{resetEmail}</span>.
                  Check your inbox to recover your users.dat password credentials.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setMode('login');
                  }}
                  className="mt-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                <p className="text-xs text-slate-300">
                  Enter your registered account email address to receive a security verification link.
                </p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="alex@lifehub.io"
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl shadow-lg transition-colors"
                >
                  Send Reset Instructions
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-xs text-slate-400 hover:text-white transition-colors py-1"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
