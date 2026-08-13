import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, Mail, Lock, Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (error) setError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (error) setError('');
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

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

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-[#07111F] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent"></div>
        
        {/* Decorative Wave CSS pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20" style={{
          background: 'radial-gradient(circle at 50% 100%, #22D3EE 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/15 rounded-xl">
            <Waves className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">Kinaara</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Coastal Safety <br/><span className="text-cyan-400">Intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Empowering authorities and informing citizens with real-time ocean conditions, crowdsourced hazard reports, and AI-driven safety analytics.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Real-time data</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
            <span>Community reports</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50"></span>
            <span>Predictive alerts</span>
          </div>
        </div>
        <div className="relative z-10 text-sm text-slate-600">
          &copy; {new Date().getFullYear()} Kinaara. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0D1B2A] p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="p-2 bg-cyan-500/15 rounded-xl">
              <Waves className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Kinaara</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <div className="mb-6 p-3 bg-[#13263A]/80 border border-[#20364A] rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-cyan-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quick Demo Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('test@example.com', 'password123')}
                className="px-2.5 py-2 bg-[#0D1B2A] hover:bg-cyan-500/10 border border-[#20364A] hover:border-cyan-500/30 rounded-lg text-slate-300 hover:text-cyan-400 text-left transition-colors truncate"
              >
                <div className="font-medium text-white truncate">User Demo</div>
                <div className="text-[10px] text-slate-400 truncate">test@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('authority@kinaara.in', 'authority123')}
                className="px-2.5 py-2 bg-[#0D1B2A] hover:bg-cyan-500/10 border border-[#20364A] hover:border-cyan-500/30 rounded-lg text-slate-300 hover:text-cyan-400 text-left transition-colors truncate"
              >
                <div className="font-medium text-white truncate">Authority Demo</div>
                <div className="text-[10px] text-slate-400 truncate">authority@kinaara.in</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300
                  disabled:from-cyan-500/40 disabled:to-teal-400/40 text-[#07111F] font-bold rounded-xl transition-all
                  disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
