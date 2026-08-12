// =============================================================================
// TideSense — Authority Dashboard (AuthorityDashboard.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// This is the admin panel for AUTHORITY users. It has two main sections:
// 1. Reports Management — View and verify/reject user-submitted reports.
// 2. Alert Management — Create new alerts for specific beaches.
//
// The layout uses an internal tab-based navigation (Reports | Create Alert).
//
// ROUTE: /authority, /authority/reports, /authority/alerts (Protected — AUTHORITY role)
// API: GET /api/reports, PUT /api/reports/{id}, POST /api/alerts, POST /api/admin/sync/all
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import {
  Shield,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  ChevronDown,
  RefreshCw,
  Clock,
} from 'lucide-react';

import { getReports, updateReportStatus, createAlert, getBeaches, refreshData } from '../services/api';
import type { Report, Beach } from '../types';
import { timeAgo } from '../utils/helpers';

export default function AuthorityDashboard() {
  // ---------------------------------------------------------------------------
  // TAB STATE
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'reports' | 'create-alert' | 'sync'>('reports');

  // ---------------------------------------------------------------------------
  // REPORTS STATE
  // ---------------------------------------------------------------------------
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // CREATE ALERT STATE
  // ---------------------------------------------------------------------------
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [alertBeachId, setAlertBeachId] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // ---------------------------------------------------------------------------
  // SYNC STATE
  // ---------------------------------------------------------------------------
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        const [reportsData, beachesData] = await Promise.all([
          getReports(),
          getBeaches(),
        ]);
        setReports(reportsData);
        setBeaches(beachesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoadingReports(false);
      }
    }
    loadData();
  }, []);

  // ---------------------------------------------------------------------------
  // REPORT ACTIONS: Verify / Reject
  // ---------------------------------------------------------------------------
  const handleUpdateReport = async (reportId: number, status: 'VERIFIED' | 'REJECTED') => {
    setUpdatingReportId(reportId);
    try {
      const updated = await updateReportStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? updated : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
    } finally {
      setUpdatingReportId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // CREATE ALERT
  // ---------------------------------------------------------------------------
  const handleCreateAlert = async (e: FormEvent) => {
    e.preventDefault();
    if (!alertBeachId || !alertType || !alertSeverity || !alertTitle || !alertMessage) {
      setError('Please fill in all alert fields.');
      return;
    }

    setError('');
    setIsCreatingAlert(true);
    setAlertSuccess(false);

    try {
      await createAlert({
        beach_id: Number(alertBeachId),
        alert_type: alertType,
        severity: alertSeverity,
        title: alertTitle,
        message: alertMessage,
      });
      setAlertSuccess(true);
      // Reset form
      setAlertBeachId('');
      setAlertType('');
      setAlertSeverity('');
      setAlertTitle('');
      setAlertMessage('');
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setIsCreatingAlert(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SYNC DATA
  // ---------------------------------------------------------------------------
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const result = await refreshData();
      setSyncMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="border-b border-[#20364A] pb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-cyan-400" />
          Authority Control Panel
        </h1>
        <p className="text-slate-400">
          Manage user reports, issue alerts, and synchronize external data sources.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'reports' as const, label: 'User Reports', icon: <FileText className="w-4 h-4" /> },
          { id: 'create-alert' as const, label: 'Create Alert', icon: <Bell className="w-4 h-4" /> },
          { id: 'sync' as const, label: 'Data Sync', icon: <RefreshCw className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setError(''); }}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-[#07111F] shadow-lg shadow-cyan-500/20'
                : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ==================== REPORTS TAB ==================== */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Pending Reports</h2>

          {isLoadingReports ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0D1B2A] h-24 rounded-2xl border border-[#20364A]" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16 bg-[#0D1B2A] border border-[#20364A] rounded-2xl">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-cyan-500/15 text-cyan-400 rounded text-xs font-bold uppercase">
                        {report.issue_type.replace('_', ' ')}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        report.status === 'PENDING'
                          ? 'bg-amber-500/15 text-amber-400'
                          : report.status === 'VERIFIED'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-red-500/15 text-red-400'
                      }`}>
                        {report.status}
                      </span>
                      {report.beach_name && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.beach_name}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(report.created_at)}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{report.description}</p>
                  </div>

                  {/* Action buttons — only show for PENDING reports */}
                  {report.status === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateReport(report.id, 'VERIFIED')}
                        disabled={updatingReportId === report.id}
                        className="px-4 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-medium
                          hover:bg-emerald-500/25 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {updatingReportId === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Verify
                      </button>
                      <button
                        onClick={() => handleUpdateReport(report.id, 'REJECTED')}
                        disabled={updatingReportId === report.id}
                        className="px-4 py-2 bg-red-500/15 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium
                          hover:bg-red-500/25 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== CREATE ALERT TAB ==================== */}
      {activeTab === 'create-alert' && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-white mb-4">Issue a New Alert</h2>

          {alertSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Alert published successfully!
            </div>
          )}

          <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8">
            <form onSubmit={handleCreateAlert} className="space-y-5">
              {/* Beach */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Affected Beach <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select
                    value={alertBeachId}
                    onChange={(e) => setAlertBeachId(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                      focus:outline-none focus:border-cyan-500/50 transition-colors text-sm appearance-none"
                  >
                    <option value="" disabled>Select a beach</option>
                    {beaches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} — {b.location}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Alert Type & Severity (side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Alert Type *</label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                      focus:outline-none focus:border-cyan-500/50 transition-colors text-sm appearance-none"
                  >
                    <option value="" disabled>Type</option>
                    <option value="OCEAN">Ocean</option>
                    <option value="WEATHER">Weather</option>
                    <option value="MARINE_LIFE">Marine Life</option>
                    <option value="WATER_QUALITY">Water Quality</option>
                    <option value="CROWD">Crowd Safety</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Severity *</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                      focus:outline-none focus:border-cyan-500/50 transition-colors text-sm appearance-none"
                  >
                    <option value="" disabled>Severity</option>
                    <option value="CRITICAL">🔴 Critical</option>
                    <option value="WARNING">🟠 Warning</option>
                    <option value="INFO">🔵 Informational</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alert Title *</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g., High Tide Warning for North Shore"
                  required
                  className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alert Message *</label>
                <textarea
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Describe the situation and any safety instructions..."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                    focus:outline-none focus:border-cyan-500/50 transition-colors text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreatingAlert}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
                  text-[#07111F] font-semibold rounded-xl transition-all disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
              >
                {isCreatingAlert ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing Alert...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Publish Alert
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DATA SYNC TAB ==================== */}
      {activeTab === 'sync' && (
        <div className="max-w-xl">
          <h2 className="text-lg font-bold text-white mb-4">External Data Sync</h2>
          <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 text-center">
            <RefreshCw className={`w-12 h-12 text-cyan-400 mx-auto mb-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <h3 className="text-xl font-bold text-white mb-2">Refresh All Data Sources</h3>
            <p className="text-slate-400 text-sm mb-6">
              Triggers a fresh pull from INCOIS (ocean data), Open-Meteo (weather),
              and CPCB (water quality). This may take a few moments.
            </p>

            {syncMessage && (
              <div className="mb-6 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {syncMessage}
              </div>
            )}

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
                text-[#07111F] font-semibold rounded-xl transition-all disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 mx-auto"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
