import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/dashboard';
  // Authority users should always go to their dashboard
  const getRedirectForUser = (role: string) => {
    if (role?.toUpperCase() === 'AUTHORITY') return '/authority';
    return redirect;
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, navigate, redirect]);

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
      // Redirect authority users to their dedicated dashboard
      navigate(getRedirectForUser(response.user.role), { replace: true });
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
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: '#F3E8D9' }}
      >
        {/* Soft wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-72 opacity-30" style={{
          background: 'radial-gradient(circle at 50% 100%, #A67C5A 0%, transparent 65%)',
          filter: 'blur(80px)'
        }}></div>
        <div className="absolute top-0 right-0 w-80 h-80 opacity-15" style={{
          background: 'radial-gradient(circle at 100% 0%, #6E93A6 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}></div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="Kinaara" className="h-12 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
            Coastal Safety <br/><span style={{ color: '#A67C5A' }}>Intelligence</span>
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: '#6B4F3E' }}>
            Empowering authorities and informing citizens with real-time ocean conditions, crowdsourced hazard reports, and AI-driven safety analytics.
          </p>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#A08070' }}>
            <span>Real-time data</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#A67C5A', opacity: 0.5 }}></span>
            <span>Community reports</span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#A67C5A', opacity: 0.5 }}></span>
            <span>Predictive alerts</span>
          </div>
        </div>
        <div className="relative z-10 text-sm" style={{ color: '#A08070' }}>
          &copy; {new Date().getFullYear()} Kinaara. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12" style={{ background: '#FFFFFF' }}>
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Kinaara" className="h-10 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: '#6B4F3E' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mb-6 p-3 rounded-xl" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold" style={{ color: '#A67C5A' }}>
              <KeyRound className="w-3.5 h-3.5" />
              <span>Quick Demo Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('test@example.com', 'password123')}
                className="px-2.5 py-2 text-left rounded-lg transition-colors truncate"
                style={{ background: '#FFFFFF', border: '1px solid #DCC9B2', color: '#6B4F3E' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; }}
              >
                <div className="font-medium truncate" style={{ color: '#3A2A20' }}>User Demo</div>
                <div className="text-[10px] truncate" style={{ color: '#A08070' }}>test@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('authority@kinaara.in', 'authority123')}
                className="px-2.5 py-2 text-left rounded-lg transition-colors truncate"
                style={{ background: '#FFFFFF', border: '1px solid #DCC9B2', color: '#6B4F3E' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; }}
              >
                <div className="font-medium truncate" style={{ color: '#3A2A20' }}>Authority Demo</div>
                <div className="text-[10px] truncate" style={{ color: '#A08070' }}>authority@kinaara.in</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl text-sm" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={{
                    background: '#FBF6EE',
                    border: '1px solid #DCC9B2',
                    color: '#3A2A20',
                    outline: 'none',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl transition-all text-sm"
                  style={{
                    background: '#FBF6EE',
                    border: '1px solid #DCC9B2',
                    color: '#3A2A20',
                    outline: 'none',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A08070' }}
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
                className="w-full py-3.5 text-white font-bold rounded-xl transition-all disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                style={{ background: isSubmitting ? '#C9A984' : '#A67C5A' }}
                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = '#8C6647'; }}
                onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = '#A67C5A'; }}
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

          <p className="mt-8 text-center text-sm" style={{ color: '#6B4F3E' }}>
            Don't have an account?{' '}
            <Link to="/register" id="go-to-register" className="font-medium transition-colors" style={{ color: '#A67C5A' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
