// =============================================================================
// TideSense — User Profile Page (Profile.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// 1. Fetches the current user's profile (GET /api/users/me).
// 2. Displays an editable form with name, email, location, preferred activity,
//    and emergency contact.
// 3. On save, calls PUT /api/users/me with the updated fields.
//
// ROUTE: /profile (Protected — requires login)
// API: GET /api/users/me → Profile, PUT /api/users/me → Profile
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import {
  User,
  Mail,
  MapPin,
  Activity,
  Phone,
  Save,
  Loader2,
  CheckCircle,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';


export default function Profile() {
  // Auth context for display and logout
  const { user, logout } = useAuth();

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [preferredActivity, setPreferredActivity] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // ---------------------------------------------------------------------------
  // LOAD PROFILE ON MOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setName(data.name || '');
        setEmail(data.email || '');
        setLocation(data.location || '');
        setPreferredActivity(data.preferred_activity || '');
        setEmergencyContact(data.emergency_contact || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // ---------------------------------------------------------------------------
  // SAVE PROFILE
  // ---------------------------------------------------------------------------
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setIsSaving(true);

    try {
      await updateProfile({
        name,
        location: location || undefined,
        preferred_activity: preferredActivity || undefined,
        emergency_contact: emergencyContact || undefined,
      });
      setSaved(true);
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse pb-12">
        <div className="h-10 w-48 bg-[#0D1B2A] rounded-xl" />
        <div className="bg-[#0D1B2A] h-96 rounded-2xl border border-[#20364A]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-cyan-400" />
          My Profile
        </h1>
        <p className="text-slate-400">
          Manage your account details and beach safety preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl shadow-xl shadow-black/20">
        {/* Avatar Header */}
        <div className="p-8 border-b border-[#20364A] flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl font-bold text-cyan-400">
            {(user?.name || name || '?')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || name}</h2>
            <p className="text-slate-400 text-sm">{user?.email || email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500/15 text-cyan-400 rounded text-xs font-bold uppercase">
              {user?.role || 'USER'}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully!
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-300 mb-2">
                Email <span className="text-slate-500">(cannot be changed)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A]/50 border border-[#20364A] rounded-xl text-slate-500
                    cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="profile-location" className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="profile-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., North Goa, India"
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Preferred Activity */}
            <div>
              <label htmlFor="profile-activity" className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Activity
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  id="profile-activity"
                  value={preferredActivity}
                  onChange={(e) => setPreferredActivity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm appearance-none"
                >
                  <option value="">Select your preferred activity</option>
                  <option value="swimming">Swimming</option>
                  <option value="surfing">Surfing</option>
                  <option value="fishing">Fishing</option>
                  <option value="diving">Diving</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label htmlFor="profile-emergency" className="block text-sm font-medium text-slate-300 mb-2">
                Emergency Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="profile-emergency"
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
                text-[#07111F] font-semibold rounded-xl transition-all duration-200
                disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Logout Section */}
        <div className="px-8 py-5 border-t border-[#20364A]">
          <button
            onClick={logout}
            className="w-full py-3 bg-red-500/10 border border-red-500/25 text-red-400 font-medium rounded-xl
              hover:bg-red-500/20 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
