import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, MapPin, Activity, Phone, Save, Loader2, CheckCircle, LogOut,
  FileText, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, getReports } from '../services/api';
import type { Report } from '../types';
import { timeAgo } from '../utils/helpers';

export default function Profile() {
  const { user, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [preferredActivity, setPreferredActivity] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, reportsData] = await Promise.all([
          getProfile(),
          getReports()
        ]);
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setLocation(profileData.location || '');
        setPreferredActivity(profileData.preferred_activity || '');
        setEmergencyContact(profileData.emergency_contact || '');
        
        // Filter reports to only show the user's reports if the backend returns all of them,
        // Assuming backend handles it, but just in case, we display what is returned.
        setReports(reportsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
      } finally {
        setIsLoading(false);
        setIsLoadingReports(false);
      }
    }
    loadData();
  }, []);

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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse pb-12">
        <div className="h-10 w-48 bg-[#0D1B2A] rounded-xl" />
        <div className="bg-[#0D1B2A] h-96 rounded-2xl border border-[#20364A]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-cyan-400" />
          My Profile
        </h1>
        <p className="text-slate-400">
          Manage your account details and beach safety preferences.
        </p>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl shadow-xl shadow-black/20">
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

        <div className="p-8">
          {saved && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
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

      {/* MY REPORTS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" /> My Reports
        </h2>
        
        {isLoadingReports ? (
           <div className="h-32 bg-[#0D1B2A] rounded-2xl border border-[#20364A] animate-pulse" />
        ) : reports.length === 0 ? (
          <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 text-center">
            <p className="text-slate-400 mb-4">You haven't submitted any reports yet.</p>
            <Link to="/report" className="inline-flex items-center justify-center px-6 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-colors text-sm font-medium">
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#13263A] text-slate-300">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Beach</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20364A]">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-[#13263A]/50 transition-colors">
                      <td className="px-6 py-4 text-slate-400">#{report.id}</td>
                      <td className="px-6 py-4 text-white capitalize">{report.issue_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-slate-300">{report.beach_name || `Beach #${report.beach_id}`}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          report.status === 'PENDING' ? 'bg-amber-500/15 text-amber-400' :
                          report.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {timeAgo(report.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
