import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Bell, 
  FileWarning, 
  User as UserIcon, 
  Shield, 
  ClipboardList, 
  AlertTriangle,
  Navigation,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active 
            ? 'bg-cyan-400/10 text-cyan-400 font-medium' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#13263A]'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="sticky left-0 top-0 h-screen w-[260px] shrink-0 bg-[#0D1B2A] border-r border-[#20364A] flex flex-col z-40">
      {/* Brand */}
      <div className="p-6 flex items-center gap-2">
        <Navigation className="w-8 h-8 text-cyan-400" />
        <span className="text-2xl font-bold text-white tracking-tight">Kinaara</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        
        {/* PUBLIC SECTION */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Explore</h3>
          <div className="space-y-1">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/beaches" icon={MapPin} label="Explore Beaches" />
            <NavItem to="/alerts" icon={Bell} label="Alerts" />
          </div>
        </div>

        {/* PROTECTED SECTION */}
        {isAuthenticated && (
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">My Account</h3>
            <div className="space-y-1">
              <NavItem to="/report" icon={FileWarning} label="Report Issue" />
              <NavItem to="/profile" icon={UserIcon} label="Profile" />
            </div>
          </div>
        )}

        {/* AUTHORITY SECTION */}
        {isAuthenticated && user?.role === 'AUTHORITY' && (
          <div>
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Authority</h3>
            <div className="space-y-1">
              <NavItem to="/authority" icon={Shield} label="Authority Dashboard" />
              <NavItem to="/authority/reports" icon={ClipboardList} label="Manage Reports" />
              <NavItem to="/authority/alerts" icon={AlertTriangle} label="Manage Alerts" />
            </div>
          </div>
        )}
      </nav>

      {/* Footer / User info */}
      <div className="p-4 border-t border-[#20364A]">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-slate-200 truncate">{user?.name}</span>
              <span className="text-xs text-slate-500 truncate">{user?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-[#13263A] rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#13263A] hover:bg-[#20364A] text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link 
              to="/register"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-sm font-medium rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
