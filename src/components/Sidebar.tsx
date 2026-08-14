import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Bell,
  FileWarning,
  User as UserIcon,
  Shield,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// =============================================================================
// NAV ITEM — single nav link with active indicator
// =============================================================================
const NavItem = ({
  to,
  icon: Icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <Link
    to={to}
    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm group ${
      isActive
        ? 'font-semibold'
        : ''
    }`}
    style={{
      background: isActive ? 'rgba(166,124,90,0.12)' : 'transparent',
      color: isActive ? '#A67C5A' : '#6B4F3E',
    }}
    onMouseEnter={e => {
      if (!isActive) {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.07)';
        (e.currentTarget as HTMLAnchorElement).style.color = '#3A2A20';
      }
    }}
    onMouseLeave={e => {
      if (!isActive) {
        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
        (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E';
      }
    }}
  >
    {/* Left accent indicator */}
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#A67C5A' }} />
    )}
    <Icon
      className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      style={{ color: isActive ? '#A67C5A' : '#A08070' }}
    />
    <span className="truncate">{label}</span>
  </Link>
);

// =============================================================================
// SIDEBAR
// =============================================================================
export default function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className="sticky left-0 top-0 h-screen w-[260px] shrink-0 flex flex-col z-40"
      style={{ background: '#FFFFFF', borderRight: '1px solid #DCC9B2' }}
    >
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid #DCC9B2' }}>
        <img
          src="/logo.png"
          alt="Kinaara"
          className="h-10 w-auto object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto sidebar-scroll">

        {/* EXPLORE */}
        <div>
          <h3 className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#A08070' }}>
            Explore
          </h3>
          <div className="space-y-0.5">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard"     isActive={isActive('/dashboard')} />
            <NavItem to="/beaches"   icon={MapPin}           label="Explore Beaches" isActive={isActive('/beaches')} />
            <NavItem to="/alerts"    icon={Bell}             label="Alerts"        isActive={isActive('/alerts')} />
            {!isAuthenticated && (
              <NavItem to="/report"  icon={FileWarning}      label="Report Issue"  isActive={isActive('/report')} />
            )}
          </div>
        </div>

        {/* MY ACCOUNT — authenticated users */}
        {isAuthenticated && (
          <div>
            <h3 className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#A08070' }}>
              My Account
            </h3>
            <div className="space-y-0.5">
              <NavItem to="/report"  icon={FileWarning} label="Report Issue" isActive={isActive('/report')} />
              <NavItem to="/profile" icon={UserIcon}    label="Profile"      isActive={isActive('/profile')} />
            </div>
          </div>
        )}

        {/* AUTHORITY */}
        {isAuthenticated && user?.role === 'AUTHORITY' && (
          <div>
            <h3 className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: '#A08070' }}>
              Authority
            </h3>
            <div className="space-y-0.5">
              <NavItem to="/authority" icon={Shield} label="Authority Dashboard" isActive={isActive('/authority')} />
            </div>
          </div>
        )}
      </nav>


      {/* ── Footer ────────────────────────────────────────── */}
      <div className="px-3 pb-4 pt-3" style={{ borderTop: '1px solid #DCC9B2' }}>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: 'rgba(166,124,90,0.12)', color: '#A67C5A', border: '1px solid rgba(166,124,90,0.3)' }}
            >
              {(user?.name ?? '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight" style={{ color: '#3A2A20' }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: '#A08070' }}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg transition-colors shrink-0"
              style={{ color: '#A08070' }}
              title="Logout"
              aria-label="Logout"
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#597D8A'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#A08070'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{ background: '#FBF6EE', color: '#3A2A20', border: '1px solid #DCC9B2' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#A67C5A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#DCC9B2'; }}
            >
              <LogIn className="w-3.5 h-3.5" style={{ color: '#A67C5A' }} />
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors"
              style={{ background: '#A67C5A' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#8C6647'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#A67C5A'; }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
