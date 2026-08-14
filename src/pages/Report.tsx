import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, MapPin, FileText, Send, Loader2, CheckCircle, ChevronDown,
  Waves, Users, Wrench, Heart, MoreHorizontal, Clock, CircleDot,
} from 'lucide-react';
import { getBeaches, submitReport, getReports } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Beach, Report as ReportType } from '../types';
import { timeAgo } from '../utils/helpers';

const ISSUE_TYPES = [
  { id: 'rip_current',    label: 'Rip Current',   icon: <Waves className="w-5 h-5" /> },
  { id: 'overcrowding',   label: 'Crowding',       icon: <Users className="w-5 h-5" /> },
  { id: 'pollution',      label: 'Pollution',      icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'infrastructure', label: 'Infrastructure', icon: <Wrench className="w-5 h-5" /> },
  { id: 'medical',        label: 'Medical',        icon: <Heart className="w-5 h-5" /> },
  { id: 'other',          label: 'Other',          icon: <MoreHorizontal className="w-5 h-5" /> },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:  { bg: 'rgba(166,124,90,0.12)',  color: '#A67C5A', label: 'Pending'  },
  VERIFIED: { bg: 'rgba(124,153,134,0.15)', color: '#4C8B6F', label: 'Verified' },
  REJECTED: { bg: 'rgba(199,75,63,0.10)',   color: '#C74B3F', label: 'Rejected' },
};

function ReportCard({ report, beaches }: { report: ReportType; beaches: Beach[] }) {
  const cfg    = ISSUE_TYPES.find(t => t.id === report.issue_type);
  const beach  = beaches.find(b => b.id === report.beach_id);
  const status = STATUS_STYLES[report.status] ?? STATUS_STYLES.PENDING;
  return (
    <div
      className="rounded-2xl p-4 flex gap-4 transition-all group"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8D9C8',
        boxShadow: '0 1px 6px rgba(58,42,32,0.05)',
        borderLeft: `3px solid ${status.color}`,
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: status.bg, color: status.color }}
      >
        {cfg?.icon ?? <FileText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        {/* Beach name + status */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold leading-tight truncate" style={{ color: '#3A2A20' }}>
            {beach?.name ?? report.beach_name ?? 'Unknown Beach'}
          </p>
          <span
            className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        {/* Issue label */}
        <p className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#A67C5A' }}>
          {cfg?.label ?? 'Other Issue'}
        </p>
        {/* Description */}
        <p className="text-xs leading-relaxed line-clamp-2 mb-2.5" style={{ color: '#6B4F3E' }}>{report.description}</p>
        {/* Time */}
        <div className="flex items-center gap-1.5" style={{ color: '#B09080' }}>
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-medium">{timeAgo(report.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Report() {
  const [beaches,        setBeaches]        = useState<Beach[]>([]);
  const [beachId,        setBeachId]        = useState('');
  const [issueTypes,     setIssueTypes]     = useState<string[]>([]);
  const [description,    setDescription]    = useState('');
  const [latitude,       setLatitude]       = useState('');
  const [longitude,      setLongitude]      = useState('');
  const [isLoadingBeaches, setIsLoadingBeaches] = useState(true);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [error,            setError]            = useState('');
  const [submitted,        setSubmitted]        = useState(false);
  const [communityReports, setCommunityReports] = useState<ReportType[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const DESC_LIMIT = 500;

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getBeaches()
      .then(setBeaches)
      .catch(() => console.warn('Could not load beaches.'))
      .finally(() => setIsLoadingBeaches(false));
  }, []);

  // Load all community reports (public — no auth required)
  useEffect(() => {
    getReports()
      .then(all => {
        setCommunityReports(
          all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        );
      })
      .catch(() => console.warn('Could not load community reports.'))
      .finally(() => setIsLoadingReports(false));
  }, []);

  const handleAutoLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      pos => { setLatitude(pos.coords.latitude.toFixed(6)); setLongitude(pos.coords.longitude.toFixed(6)); },
      () => {}
    );
  };

  const toggleIssueType = (id: string) => {
    setIssueTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login?redirect=/report'); return; }
    if (!beachId) { setError('Please select a beach.'); return; }
    if (issueTypes.length === 0) { setError('Please select at least one issue type.'); return; }
    if (!description.trim()) { setError('Please add a description.'); return; }
    if (!latitude || !longitude) { setError('Location is required. Enter coordinates or use “Use Current Location”.'); return; }
    setError(''); setIsSubmitting(true);
    try {
      const response = await submitReport({
        beach_id: Number(beachId),
        issue_type: issueTypes[0],     // primary type (backend compat)
        issue_types: issueTypes,        // full array for multi-type backends
        description: description.trim(),
        latitude: Number(latitude), longitude: Number(longitude),
      });
      setCommunityReports(prev => [response, ...prev]);
      setSubmitted(true);
      setBeachId(''); setIssueTypes([]); setDescription(''); setLatitude(''); setLongitude('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#3A2A20' };
  const inputCls   = 'w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all outline-none';
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#A67C5A'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#DCC9B2'; e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-12">

      {/* ── Editorial page header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(166,124,90,0.12)' }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: '#A67C5A' }} />
          </div>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, #DCC9B2, transparent)' }} />
        </div>
        <h1
          className="text-4xl font-bold mb-2 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}
        >
          Report an <span className="italic" style={{ color: '#A67C5A' }}>Issue</span>
        </h1>
        <p className="text-sm max-w-lg leading-relaxed" style={{ color: '#6B4F3E' }}>
          Spotted something dangerous? Help keep our coasts safe — your report goes directly to the local authorities.
        </p>
      </div>

      {/* Success toast */}
      {submitted && (
        <div
          className="mb-8 flex items-center gap-3 p-4 rounded-2xl text-sm"
          style={{ background: 'rgba(124,153,134,0.10)', border: '1px solid rgba(124,153,134,0.35)', color: '#4C8B6F' }}
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">Report submitted successfully.</span>
          <span className="opacity-70">It now appears in your history on the left.</span>
          <button onClick={() => setSubmitted(false)} className="ml-auto text-xs font-semibold underline" style={{ color: '#4C8B6F' }}>Dismiss</button>
        </div>
      )}

      {/* Two-column grid — wider gap for clear visual separation */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-10 xl:gap-16 items-start">

        {/* ════ LEFT — My Reports ════ */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DCC9B2',
            boxShadow: '0 4px 24px rgba(58,42,32,0.08)',
          }}
        >
          {/* Gradient header strip */}
          <div
            className="px-6 py-5"
            style={{
              background: 'linear-gradient(135deg, #FBF6EE 0%, #F2E8D8 100%)',
              borderBottom: '1px solid #DCC9B2',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(166,124,90,0.15)' }}>
                  <CircleDot className="w-4 h-4" style={{ color: '#A67C5A' }} />
                </div>
                <div>
                  <h2 className="text-sm font-bold leading-none" style={{ color: '#3A2A20' }}>Community Reports</h2>
                  <p className="text-[10px] mt-0.5" style={{ color: '#A08070' }}>Reports from all users · most recent first</p>
                </div>
              </div>
              {communityReports.length > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: '#A67C5A', color: '#FFFFFF' }}
                >
                  {communityReports.length}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 max-h-[560px] overflow-y-auto space-y-3">
            {isLoadingReports ? (
              <div className="py-14 flex flex-col items-center gap-3">
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#A67C5A' }} />
                <p className="text-xs" style={{ color: '#A08070' }}>Loading reports…</p>
              </div>
            ) : communityReports.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-4 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(166,124,90,0.08), rgba(166,124,90,0.03))' }}
                >
                  <FileText className="w-7 h-7" style={{ color: '#C9A984' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#3A2A20' }}>No reports yet</p>
                  <p className="text-xs leading-relaxed max-w-[190px] mx-auto" style={{ color: '#A08070' }}>Be the first to report a beach hazard using the form on the right.</p>
                </div>
              </div>
            ) : (
              communityReports.map(r => <ReportCard key={r.id} report={r} beaches={beaches} />)
            )}
          </div>
        </div>

        {/* ════ RIGHT — Form ════ */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: '#FFFFFF',
            border: '1px solid #DCC9B2',
            boxShadow: '0 4px 24px rgba(58,42,32,0.08)',
          }}
        >
          {/* Form header with stronger treatment */}
          <div
            className="px-6 py-5"
            style={{
              background: 'linear-gradient(135deg, #3A2A20 0%, #5A3E2E 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Send className="w-4 h-4" style={{ color: '#F2DEC0' }} />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: '#FDFAF6' }}>New Hazard Report</h2>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(253,250,246,0.55)' }}>All reports are reviewed by local authorities</p>
              </div>
            </div>
          </div>
          <div className="p-7">
            {error && (
              <div className="mb-5 p-3.5 rounded-xl text-sm" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}>{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Beach selector */}
              <div>
                <label htmlFor="report-beach" className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>
                  Affected Beach <span style={{ color: '#597D8A' }}>*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#A67C5A' }} />
                  <select id="report-beach" value={beachId} onChange={e => setBeachId(e.target.value)} required
                    className={inputCls + ' pl-10 pr-10 appearance-none'} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="" disabled>{isLoadingBeaches ? 'Loading beaches…' : 'Select a beach'}</option>
                    {beaches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.location}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: '#A08070' }} />
                </div>
              </div>

              {/* Issue type — MULTI-SELECT */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#3A2A20' }}>
                  Issue Type <span style={{ color: '#597D8A' }}>*</span>
                </label>
                <p className="text-[11px] mb-3" style={{ color: '#A08070' }}>Select all that apply</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISSUE_TYPES.map(type => {
                    const active = issueTypes.includes(type.id);
                    return (
                      <button key={type.id} type="button" onClick={() => toggleIssueType(type.id)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl transition-all relative"
                        style={{
                          background: active ? '#3A2A20' : '#FBF6EE',
                          border: active ? '1.5px solid #3A2A20' : '1px solid #DCC9B2',
                          color: active ? '#F5DDB5' : '#6B4F3E',
                          boxShadow: active ? '0 2px 8px rgba(58,42,32,0.18)' : 'none',
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; }}>
                        {active && (
                          <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full flex items-center justify-center"
                            style={{ background: '#A67C5A' }}>
                            <span className="text-white" style={{ fontSize: '7px', lineHeight: 1 }}>✓</span>
                          </span>
                        )}
                        <div className="mb-1.5">{type.icon}</div>
                        <span className="text-xs font-medium text-center">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description with char counter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="report-description" className="block text-sm font-medium" style={{ color: '#3A2A20' }}>
                    Description <span style={{ color: '#597D8A' }}>*</span>
                  </label>
                  <span
                    className="text-[11px] font-medium tabular-nums"
                    style={{ color: description.length >= DESC_LIMIT ? '#C74B3F' : description.length >= 400 ? '#D69A3C' : '#A08070' }}
                  >
                    {description.length}/{DESC_LIMIT}
                  </span>
                </div>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-5 h-5" style={{ color: '#A67C5A' }} />
                  <textarea id="report-description" value={description}
                    onChange={e => setDescription(e.target.value.slice(0, DESC_LIMIT))}
                    placeholder="Describe the hazard in detail…" required rows={4}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all resize-none outline-none"
                    style={{
                      ...inputStyle,
                      borderColor: description.length >= DESC_LIMIT ? '#C74B3F' : '#DCC9B2',
                    }} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              {/* Location — REQUIRED */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: '#3A2A20' }}>
                    Location <span style={{ color: '#597D8A' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoLocation}
                    title="Use your device GPS to fill in coordinates"
                    className="text-xs font-medium flex items-center gap-1"
                    style={{ color: '#A67C5A' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8C6647'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#A67C5A'; }}>
                    <MapPin className="w-3 h-3" /> Use Current Location
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <input type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: '#A08070' }}>Required — enter manually or tap “Use Current Location” above</p>
              </div>

              {/* Guest notice */}
              {!isAuthenticated && (
                <div className="p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(166,124,90,0.06)', border: '1px solid rgba(166,124,90,0.2)', color: '#6B4F3E' }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#A67C5A' }} />
                  You'll be asked to sign in before your report is submitted.
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                className="w-full py-3.5 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                style={{ background: isSubmitting ? '#C9A984' : '#A67C5A' }}
                onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = '#8C6647'; }}
                onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = '#A67C5A'; }}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Report</>}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
