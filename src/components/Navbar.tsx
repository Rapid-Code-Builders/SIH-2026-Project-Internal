import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Bell,
  FileWarning,
  User as UserIcon,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/beaches', label: 'Explore Beaches', icon: MapPin },
    { to: '/alerts', label: 'Alerts', icon: Bell },
  ];

  if (!isAuthenticated) {
    navItems.push({ to: '/report', label: 'Report Issue', icon: FileWarning });
  }

  const protectedItems = isAuthenticated
    ? [
        { to: '/report', label: 'Report Issue', icon: FileWarning },
        { to: '/profile', label: 'Profile', icon: UserIcon },
      ]
    : [];

  const authorityItems = isAuthenticated && user?.role === 'AUTHORITY'
    ? [{ to: '/authority', label: 'Authority', icon: Shield }]
    : [];

  const allItems = [...navItems, ...protectedItems, ...authorityItems];

  return (
    <header className="w-full shrink-0 z-50 px-4 md:px-6 pt-5 pb-2">
      {/* ── Floating Pill Container ── */}
      <div
        className="w-full max-w-[1280px] mx-auto rounded-full transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(220,201,178,0.8)',
          boxShadow: '0 4px 24px rgba(58,42,32,0.08)',
        }}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-2.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 justify-self-start">
            <img
              src="/logo.png"
              alt="Kinaara"
              className="h-9 w-auto object-contain select-none"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>

          {/* Desktop Navigation Links — perfectly centered */}
          <nav className="hidden md:flex items-center gap-1.5 justify-self-center">
            {allItems.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium"
                  style={{
                    background: active ? 'rgba(166,124,90,0.12)' : 'transparent',
                    color: active ? '#A67C5A' : '#6B4F3E',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.07)';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#3A2A20';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3 justify-self-end">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3" style={{ borderLeft: '1px solid #DCC9B2' }}>
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold leading-tight truncate max-w-[120px]" style={{ color: '#3A2A20' }}>
                    {user?.name}
                  </span>
                  <span className="text-[10px]" style={{ color: '#A08070' }}>
                    {user?.role === 'AUTHORITY' ? 'Authority' : 'Traveler'}
                  </span>
                </div>
                <div className="tooltip-wrap">
                  <Link
                    to="/profile"
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all"
                    style={{ background: 'rgba(166,124,90,0.15)', color: '#A67C5A', border: '1px solid rgba(166,124,90,0.3)' }}
                    aria-label="View profile"
                  >
                    {(user?.name ?? '?')[0].toUpperCase()}
                  </Link>
                  <span className="tooltip-text tooltip-below">View Profile</span>
                </div>
                <div className="tooltip-wrap">
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg transition-colors shrink-0"
                    style={{ color: '#A08070' }}
                    aria-label="Sign out"
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#597D8A'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#A08070'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <span className="tooltip-text tooltip-below">Sign out</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold rounded-full transition-colors"
                  style={{ color: '#6B4F3E' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#3A2A20'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.07)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                  style={{ background: '#A67C5A' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#8C6647'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#A67C5A'; }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full transition-colors justify-self-end"
            style={{ color: '#6B4F3E' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-6 py-4 space-y-4 rounded-b-3xl"
            style={{ borderTop: '1px solid rgba(220,201,178,0.5)', background: 'rgba(255,255,255,0.97)' }}
          >
            <div className="space-y-1">
              {allItems.map((item) => {
                const active = isActive(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
                    style={{
                      background: active ? 'rgba(166,124,90,0.10)' : 'transparent',
                      color: active ? '#A67C5A' : '#6B4F3E',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div style={{ height: '1px', background: '#DCC9B2' }} />

            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: 'rgba(166,124,90,0.15)', color: '#A67C5A', border: '1px solid rgba(166,124,90,0.3)' }}
                  >
                    {(user?.name ?? '?')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-tight" style={{ color: '#3A2A20' }}>{user?.name}</span>
                    <span className="text-[10px]" style={{ color: '#A08070' }}>{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-colors"
                  style={{ color: '#597D8A' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-xs font-semibold rounded-xl"
                  style={{ background: '#FBF6EE', color: '#3A2A20', border: '1px solid #DCC9B2' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 text-white text-xs font-bold rounded-xl"
                  style={{ background: '#A67C5A' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
