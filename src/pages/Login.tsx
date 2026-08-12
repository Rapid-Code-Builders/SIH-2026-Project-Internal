// =============================================================================
// TideSense Login Page
// =============================================================================
//
// WHAT THIS PAGE DOES:
// Renders a login form with email + password fields. On submit, it calls
// POST /api/auth/login, receives a JWT token + user object, and stores them
// in the AuthContext (which persists them to localStorage).
//
// REACT FORMS EXPLAINED FOR BACKEND DEVS:
// In FastAPI, form data arrives as a request body that you parse once.
// In React, form inputs are "controlled" — meaning React state is the
// single source of truth, and the input always reflects that state.
//
// Flow:
//   1. User types in input → onChange fires → setState updates the value
//   2. React re-renders → input shows the new value
//   3. User clicks Submit → onSubmit fires → we read the state values
//   4. We call the API → on success, update auth context → navigate away
//
// This is different from traditional HTML forms where the browser collects
// values and sends them. Here, JavaScript handles everything client-side.
//
// ROUTE: /login (Public)
// API: POST /api/auth/login → { access_token, token_type, user }
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

// useAuth gives us the login() function from AuthContext
import { useAuth } from '../context/AuthContext';

// The API function that calls POST /api/auth/login
import { login as apiLogin } from '../services/api';

export default function Login() {
  // ---------------------------------------------------------------------------
  // FORM STATE
  // ---------------------------------------------------------------------------
  // Each form field gets its own state variable. When the user types,
  // we update the corresponding state, which updates the displayed value.
  //
  // ANALOGY: Think of these as variables in a Pydantic model:
  //   class LoginForm(BaseModel):
  //       email: str = ""
  //       password: str = ""
  // ---------------------------------------------------------------------------
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state — not related to the form data itself
  const [showPassword, setShowPassword] = useState(false);   // Toggle password visibility
  const [error, setError] = useState('');                     // Error message to display
  const [isSubmitting, setIsSubmitting] = useState(false);    // Loading state during API call

  // Get the login function from auth context and navigation function
  const { login } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION HANDLER
  // ---------------------------------------------------------------------------
  // This function runs when the user clicks "Sign In" or presses Enter.
  //
  // ANALOGY: This is like a FastAPI endpoint handler:
  //   @app.post("/auth/login")
  //   async def login(form: LoginForm):
  //       user = authenticate(form.email, form.password)
  //       if not user: raise HTTPException(401, "Invalid credentials")
  //       return {"token": create_jwt(user)}
  //
  // The difference: this runs in the browser, not on the server.
  // It CALLS your FastAPI endpoint and handles the response.
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    // Prevent the browser's default form submission (which would reload the page)
    // In an SPA, we handle everything in JavaScript — no page reloads.
    e.preventDefault();

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Call POST /api/auth/login
      const response = await apiLogin(email, password);

      // On success, store the token and user in AuthContext
      // This triggers a re-render across the app — the Navbar will update,
      // protected routes will become accessible, etc.
      login(response.access_token, response.user);

      // Navigate to the dashboard
      // 'replace: true' means pressing Back won't return to the login page
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Display the error message from the API (or a generic one)
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
            Sign in to access your TideSense account
          </p>
        </div>

        {/* ---- Login Form Card ---- */}
        {/*
          TAILWIND BREAKDOWN:
          'bg-[#0D1B2A]'      → background color from our design system (surface)
          'border border-[#20364A]' → thin border in our border color
          'rounded-2xl'       → border-radius: 1rem (16px) — our locked radius
          'p-8'               → padding: 2rem on all sides
          'shadow-xl shadow-black/20' → subtle shadow for depth
        */}
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 shadow-xl shadow-black/20">

          {/* ---- Error Message ---- */}
          {/* Conditional rendering: this only appears when 'error' is non-empty */}
          {/* The && operator in JSX means: "if left side is truthy, render right side" */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ---- The Form ---- */}
          {/*
            onSubmit={handleSubmit} → runs our handler when form is submitted
            This replaces the traditional 'action="/login" method="POST"'
            because we handle the API call in JavaScript.
          */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ---- Email Field ---- */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                {/* Icon positioned inside the input using absolute positioning */}
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
              </div>
            </div>

            {/* ---- Password Field ---- */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500 
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                    transition-colors text-sm"
                />
                {/* Toggle password visibility button */}
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

            {/* ---- Submit Button ---- */}
            {/*
              disabled={isSubmitting} → prevents double-submission during API call
              The button shows a spinner while the request is in flight.
            */}
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* ---- Register Link ---- */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
