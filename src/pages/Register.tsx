import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { register as apiRegister } from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
      const response = await apiRegister(name, email, password);
      login(response.access_token, response.user);
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

  const inputStyle = {
    background: '#FBF6EE',
    border: '1px solid #DCC9B2',
    color: '#3A2A20',
    outline: 'none',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#A67C5A';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#DCC9B2';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: '#F3E8D9' }}
      >
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
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>Create Account</h1>
            <p className="text-sm" style={{ color: '#6B4F3E' }}>
              Join Kinaara for coastal safety
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl text-sm" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Full Name
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aradhya Gupta"
                  required
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A08070' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-xs" style={{ color: '#597D8A' }}>
                  Passwords do not match
                </p>
              )}
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: '#6B4F3E' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium transition-colors" style={{ color: '#A67C5A' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
