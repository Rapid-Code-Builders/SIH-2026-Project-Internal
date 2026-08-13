// =============================================================================
// TideSense Register Page
// =============================================================================
//
// WHAT THIS PAGE DOES:
// Registration form with Name, Email, Password, Confirm Password.
// On submit, calls POST /api/auth/register, auto-logs the user in,
// and redirects to the dashboard.
//
// The roadmap explicitly says: "Keep it short: Name, Email, Password,
// Confirm Password → [Create Account] → redirect to Dashboard.
// Don't add 15 profile fields during registration."
//
// ROUTE: /register (Public)
// API: POST /api/auth/register → { access_token, token_type, user }
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, UserPlus, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/api';

export default function Register() {
  // ---------------------------------------------------------------------------
  // FORM STATE
  // ---------------------------------------------------------------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Call POST /api/auth/register
      const response = await apiRegister(name, email, password);

      // Auto-login after successful registration
      // The backend returns the same response shape as login:
      // { access_token: "...", token_type: "bearer", user: { id, name, email, role } }
      login(response.access_token, response.user);

      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
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
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-slate-400">
            Join Kinaara to report issues and save preferences
          </p>
        </div>

        {/* ---- Registration Form Card ---- */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 shadow-xl shadow-black/20">

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ---- Full Name ---- */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aradhya Gupta"
                  required
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
              </div>
            </div>

            {/* ---- Email ---- */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
              </div>
            </div>

            {/* ---- Password ---- */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* ---- Confirm Password ---- */}
            <div>
              <label
                htmlFor="register-confirm"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
              </div>
              {/* Password mismatch warning — shown live as user types */}
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* ---- Submit Button ---- */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 
                text-[#07111F] font-semibold rounded-xl transition-all duration-200
                disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* ---- Login Link ---- */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
