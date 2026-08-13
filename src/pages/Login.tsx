// =============================================================================
// Kinaara Login Page
// =============================================================================
//
// WHAT THIS PAGE DOES:
// Renders a login form with email + password fields. On submit, it calls
// POST /api/auth/login, receives a JWT token + user object, and stores them
// in the AuthContext (which persists them to localStorage).
//
// ROUTE: /login (Public)
// API: POST /api/auth/login → { access_token, token_type, user }
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, Mail, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';

// useAuth gives us the login() function and isAuthenticated state from AuthContext
import { useAuth } from '../context/AuthContext';

// The API function that calls POST /api/auth/login
import { login as apiLogin } from '../services/api';

export default function Login() {
  // ---------------------------------------------------------------------------
  // FORM STATE
  // ---------------------------------------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get auth context values and router navigation
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Input change handlers (clears error on edit)
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (error) setError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (error) setError('');
  };

  // Helper to fill demo credentials easily
  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    if (error) setError('');
  };

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION HANDLER
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Client-side validations
    if (!trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiLogin(trimmedEmail, trimmedPassword);
      login(response.access_token, response.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="w-full max-w-md">
        {/* ---- Logo & Header ---- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-500/15 rounded-2xl mb-4">
            <Waves className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400">
            Sign in to access your Kinaara account
          </p>
        </div>

        {/* ---- Login Form Card ---- */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 shadow-xl shadow-black/20">
          {/* ---- Quick Demo Credentials ---- */}
          <div className="mb-6 p-3 bg-[#13263A]/80 border border-[#20364A] rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quick Demo Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('test@example.com', 'password123')}
                className="px-2.5 py-1.5 bg-[#0D1B2A] hover:bg-cyan-500/10 border border-[#20364A] hover:border-cyan-500/30 rounded-lg text-slate-300 hover:text-cyan-400 text-left transition-colors truncate"
              >
                <div className="font-medium text-white truncate">Tourist User</div>
                <div className="text-[10px] text-slate-400 truncate">test@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('authority@kinaara.in', 'authority123')}
                className="px-2.5 py-1.5 bg-[#0D1B2A] hover:bg-cyan-500/10 border border-[#20364A] hover:border-cyan-500/30 rounded-lg text-slate-300 hover:text-cyan-400 text-left transition-colors truncate"
              >
                <div className="font-medium text-white truncate">Authority</div>
                <div className="text-[10px] text-slate-400 truncate">authority@kinaara.in</div>
              </button>
            </div>
          </div>

          {/* ---- Error Message ---- */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ---- The Form ---- */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ---- Email Field ---- */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-slate-200 mb-2.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500/70
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                    transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* ---- Password Field ---- */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-slate-200 mb-2.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500/70
                    focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20
                    transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* ---- Submit Button ---- */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 disabled:bg-cyan-500/40
                  text-[#07111F] font-bold rounded-xl transition-all duration-200
                  disabled:cursor-not-allowed text-sm tracking-wide shadow-lg shadow-cyan-500/20
                  hover:shadow-cyan-500/30 hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* ---- Register Link ---- */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
