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

  // ── Shared input style ──
  const inputStyle = {
    background: '#FBF6EE',
    border: '1px solid #DCC9B2',
    color: '#3A2A20',
    outline: 'none',
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#A67C5A';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#DCC9B2';
    e.currentTarget.style.boxShadow = 'none';
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-6 animate-pulse pb-12">
        <div className="h-10 w-48 rounded-xl" style={{ background: '#DCC9B2' }} />
        <div className="h-96 rounded-2xl" style={{ background: '#DCC9B2', border: '1px solid #DCC9B2' }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl animate-fade-in pb-16 space-y-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
          <User className="w-8 h-8" style={{ color: '#A67C5A' }} />
          My Profile
        </h1>
        <p style={{ color: '#6B4F3E' }}>
          Manage your account details and beach safety preferences.
        </p>
      </div>

      <div className="rounded-2xl shadow-md overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
        {/* Avatar header */}
        <div
          className="p-8 flex items-center gap-5"
          style={{
            borderBottom: '1px solid #DCC9B2',
            background: 'linear-gradient(135deg, #3A2A20 0%, #5A3E2E 100%)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#F2DEC0', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {(user?.name || name || '?')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#FDFAF6' }}>{user?.name || name}</h2>
            <p className="text-sm" style={{ color: 'rgba(253,250,246,0.65)' }}>{user?.email || email}</p>
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#F2DEC0' }}
            >
              {user?.role || 'USER'}
            </span>
          </div>
        </div>

        <div className="p-8">
          {saved && (
            <div className="mb-6 p-3.5 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(124,153,134,0.10)', border: '1px solid rgba(124,153,134,0.30)', color: '#4C8B6F' }}>
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl text-sm" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Email <span style={{ color: '#A08070' }}>(cannot be changed)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A08070' }} />
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm cursor-not-allowed"
                  style={{ background: '#F3EDE4', border: '1px solid #DCC9B2', color: '#A08070', outline: 'none' }}
                />
              </div>
            </div>



            {/* Emergency Contact */}
            <div>
              <label htmlFor="profile-emergency" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                Emergency Contact
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                <input
                  id="profile-emergency"
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl transition-all text-sm"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Save */}
            <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              style={{ background: isSaving ? '#C9A984' : '#A67C5A' }}
              onMouseEnter={e => { if (!isSaving) (e.currentTarget as HTMLButtonElement).style.background = '#8C6647'; }}
              onMouseLeave={e => { if (!isSaving) (e.currentTarget as HTMLButtonElement).style.background = '#A67C5A'; }}
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
            </div>
          </form>
        </div>

        {/* Sign out */}
        <div className="px-8 py-5" style={{ borderTop: '1px solid #DCC9B2' }}>
          <button
            onClick={logout}
            className="w-full py-3 font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.15)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.08)'; }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* MY REPORTS SECTION */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#3A2A20' }}>
          <FileText className="w-5 h-5" style={{ color: '#A67C5A' }} /> My Reports
        </h2>
        
        {isLoadingReports ? (
          <div className="h-32 rounded-2xl animate-pulse" style={{ background: '#DCC9B2', border: '1px solid #DCC9B2' }} />
        ) : reports.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
            <p className="mb-4" style={{ color: '#6B4F3E' }}>You haven't submitted any reports yet.</p>
            <Link
              to="/report"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl transition-colors text-sm font-medium"
              style={{ background: 'rgba(166,124,90,0.1)', color: '#A67C5A', border: '1px solid rgba(166,124,90,0.3)' }}
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead style={{ background: '#FBF6EE' }}>
                  <tr>
                    <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>ID</th>
                    <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Type</th>
                    <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Beach</th>
                    <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Status</th>
                    <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      style={{ borderTop: '1px solid #DCC9B2' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#FBF6EE'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                    >
                      <td className="px-6 py-4" style={{ color: '#A08070' }}>#{report.id}</td>
                      <td className="px-6 py-4 capitalize" style={{ color: '#3A2A20' }}>{report.issue_type.replace('_', ' ')}</td>
                      <td className="px-6 py-4" style={{ color: '#6B4F3E' }}>{report.beach_name || `Beach #${report.beach_id}`}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          report.status === 'PENDING'  ? 'bg-amber-50 text-amber-600' :
                          report.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-[rgba(89,125,138,0.08)] text-[#3D6070]'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-1" style={{ color: '#A08070' }}>
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
