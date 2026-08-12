// =============================================================================
// TideSense Navigation Bar Component
// =============================================================================
// This is the top navigation bar that appears on every page of the app.
//
// REACT CONCEPT — COMPONENTS:
// In React, a 'component' is like a reusable template function.
// Think of it like a Jinja2 macro or a Django template tag — you define it
// once and use it everywhere. Components receive data through 'props'
// (similar to function parameters) and return JSX (HTML-like syntax).
//
// REACT CONCEPT — HOOKS:
// Hooks are special React functions that start with 'use'. They let you
// "hook into" React features like state, context, and lifecycle.
//   - useState: like a class variable that triggers a UI re-render when changed
//   - useContext: like accessing a global/session variable
//   - useNavigate: like redirect() in FastAPI/Flask
//
// TAILWIND CSS PRIMER:
// Instead of writing CSS files, Tailwind uses utility classes directly in HTML:
//   'bg-[#07111F]'  → background-color: #07111F
//   'text-white'    → color: white
//   'px-6'          → padding-left: 1.5rem; padding-right: 1.5rem
//   'flex'          → display: flex
//   'items-center'  → align-items: center
//   'gap-6'         → gap: 1.5rem (space between flex children)
// =============================================================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Lucide icons — lightweight SVG icon library (like FontAwesome but tree-shakeable)
import {
  Waves,          // TideSense logo icon
  Compass,        // Explore/Dashboard
  AlertTriangle,  // Alerts
  FileText,       // Reports
  User,           // Profile
  Shield,         // Authority
  LogOut,         // Logout
  Menu,           // Mobile menu hamburger
  X,              // Close mobile menu
} from 'lucide-react';

// =============================================================================
// REACT CONCEPT — PROPS:
// 'Props' (properties) are how parent components pass data to child components.
// Think of them like function parameters. Here, the Navbar receives:
//   - isAuthenticated: boolean — is the user logged in?
//   - userRole: string — 'USER' or 'AUTHORITY'
//   - onLogout: function — callback to execute when logout is clicked
//
// In TypeScript, we define the shape of props with an 'interface'.
// =============================================================================
interface NavbarProps {
  isAuthenticated: boolean;
  userRole?: string;
  userName?: string;
  onLogout: () => void;
}

// 'export default' means this is the main thing this file exports.
// Other files can import it with: import Navbar from './components/Navbar'
export default function Navbar({ isAuthenticated, userRole, userName, onLogout }: NavbarProps) {
  // useLocation() returns the current URL path — like request.url in FastAPI.
  // We use it to highlight the active nav item.
  const location = useLocation();

  // useNavigate() returns a function to programmatically change the URL.
  // Like calling redirect() in your backend router.
  const navigate = useNavigate();

  // useState creates a state variable + setter function.
  // When 'mobileMenuOpen' changes, React automatically re-renders this component.
  // Think of it as a reactive variable — like a watched property in Vue,
  // or a session variable that triggers a template re-render.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper: check if a nav link is currently active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Helper: generate CSS classes for nav links
  // Active link gets brighter text + a cyan underline indicator
  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-cyan-400 bg-cyan-400/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
    }`;

  const handleLogout = () => {
    onLogout();
    navigate('/dashboard');
    setMobileMenuOpen(false);
  };

  return (
    // The outer <nav> element — semantic HTML for navigation
    // 'sticky top-0 z-50' makes it stick to the top of the viewport as user scrolls
    // 'backdrop-blur-xl' adds a frosted glass effect behind the navbar
    <nav className="sticky top-0 z-50 bg-[#0D1B2A]/80 backdrop-blur-xl border-b border-[#20364A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ---- LOGO SECTION ---- */}
          {/* Link is like an <a> tag but doesn't cause a full page reload */}
          {/* React Router intercepts the click and updates only the changed content */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 text-white font-bold text-xl hover:opacity-90 transition-opacity"
          >
            <div className="p-1.5 bg-cyan-500/20 rounded-lg">
              <Waves className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="tracking-tight">TideSense</span>
          </Link>

          {/* ---- DESKTOP NAVIGATION LINKS ---- */}
          {/* 'hidden md:flex' — hidden on mobile, visible on medium+ screens */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            <Link to="/alerts" className={linkClass('/alerts')}>
              <AlertTriangle className="w-4 h-4" />
              Alerts
            </Link>

            {/* Conditionally render auth-only links */}
            {/* This is like an {% if user.is_authenticated %} in Django templates */}
            {isAuthenticated && (
              <>
                <Link to="/report" className={linkClass('/report')}>
                  <FileText className="w-4 h-4" />
                  Report
                </Link>
                <Link to="/profile" className={linkClass('/profile')}>
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </>
            )}

            {/* Authority-only link */}
            {isAuthenticated && userRole === 'AUTHORITY' && (
              <Link to="/authority" className={linkClass('/authority')}>
                <Shield className="w-4 h-4" />
                Authority
              </Link>
            )}
          </div>

          {/* ---- RIGHT SIDE: User info + Auth buttons ---- */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {userName && (
                  <span className="text-sm text-slate-400">
                    {userName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-400 text-[#07111F] font-semibold rounded-xl transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ---- MOBILE MENU BUTTON ---- */}
          {/* 'md:hidden' — only visible on mobile screens */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ---- MOBILE MENU DROPDOWN ---- */}
      {/* Conditional rendering: this entire block only appears when mobileMenuOpen is true */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#20364A] bg-[#0D1B2A]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <Link to="/dashboard" className={linkClass('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
              <Compass className="w-4 h-4" /> Explore
            </Link>
            <Link to="/alerts" className={linkClass('/alerts')} onClick={() => setMobileMenuOpen(false)}>
              <AlertTriangle className="w-4 h-4" /> Alerts
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/report" className={linkClass('/report')} onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4" /> Report
                </Link>
                <Link to="/profile" className={linkClass('/profile')} onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}
            {isAuthenticated && userRole === 'AUTHORITY' && (
              <Link to="/authority" className={linkClass('/authority')} onClick={() => setMobileMenuOpen(false)}>
                <Shield className="w-4 h-4" /> Authority
              </Link>
            )}

            <div className="pt-3 mt-3 border-t border-[#20364A]">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block px-3 py-2 text-sm text-slate-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" className="block px-3 py-2 text-sm bg-cyan-500 text-[#07111F] font-semibold rounded-xl text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
