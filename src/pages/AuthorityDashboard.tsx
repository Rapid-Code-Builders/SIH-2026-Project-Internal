import { useState, useEffect, type FormEvent } from 'react';
import {
  Shield, FileText, Bell, CheckCircle, XCircle, Loader2, MapPin, ChevronDown,
  RefreshCw, Clock, AlertTriangle
} from 'lucide-react';
import { getReports, updateReportStatus, createAlert, getBeaches, refreshData, getAlerts } from '../services/api';
import type { Report, Beach, Alert } from '../types';
import { timeAgo } from '../utils/helpers';

export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState<'reports' | 'alerts'>('reports');

  const [reports, setReports] = useState<Report[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [beaches, setBeaches] = useState<Beach[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);

  const [alertBeachId, setAlertBeachId] = useState('');
  const [alertType, setAlertType] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [reportsData, beachesData, alertsData] = await Promise.all([
          getReports(),
          getBeaches(),
          getAlerts()
        ]);
        setReports(reportsData);
        setBeaches(beachesData);
        setAlerts(alertsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateReport = async (reportId: number, status: 'VERIFIED' | 'REJECTED') => {
    setUpdatingReportId(reportId);
    try {
      const updated = await updateReportStatus(reportId, status);
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report');
    } finally {
      setUpdatingReportId(null);
    }
  };

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
      const newAlert = await createAlert({
        beach_id: Number(alertBeachId),
        alert_type: alertType,
        severity: alertSeverity,
        title: alertTitle,
        message: alertMessage,
      });
      setAlerts([newAlert, ...alerts]);
      setAlertSuccess(true);
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

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    setError('');
    try {
      const result = await refreshData();
      setSyncMessage(result.message);
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;
  const criticalCount = reports.filter(r => r.issue_type === 'rip_current' || r.issue_type === 'missing_person').length;
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const resolvedCount = reports.filter(r => r.status === 'VERIFIED' || r.status === 'REJECTED').length;

  // ── Shared form input style ──
  const formInputCls = 'w-full rounded-xl text-sm outline-none transition-all appearance-none';
  const formInputStyle = { background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#3A2A20' };
  const formFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#A67C5A';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(166,124,90,0.12)';
  };
  const formBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#DCC9B2';
    e.currentTarget.style.boxShadow = 'none';
  };

  // ── Stat card configs ──
  const statCards = [
    { label: 'Pending Reports',  value: pendingCount,      color: '#6E93A6' },
    { label: 'Critical Reports', value: criticalCount,     color: '#597D8A' },
    { label: 'Active Alerts',    value: activeAlertsCount, color: '#A67C5A' },
    { label: 'Resolved Reports', value: resolvedCount,     color: '#7C9986' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6" style={{ borderBottom: '1px solid #DCC9B2' }}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
            <Shield className="w-8 h-8" style={{ color: '#A67C5A' }} />
            Authority Dashboard
          </h1>
          <p style={{ color: '#6B4F3E' }}>
            Manage user reports, issue alerts, and synchronize external data sources.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-5 py-2.5 font-medium rounded-xl text-sm transition-all flex items-center gap-2"
            style={{ background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#6B4F3E' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#A67C5A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DCC9B2'; }}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Refresh Data'}
          </button>
          {syncMessage && <span className="text-xs font-medium" style={{ color: '#7C9986' }}>{syncMessage}</span>}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
            <div className="text-sm font-medium mb-1" style={{ color: '#A08070' }}>{card.label}</div>
            <div className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('reports'); setError(''); }}
          className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2"
          style={{
            background: activeTab === 'reports' ? '#A67C5A' : '#FFFFFF',
            color:      activeTab === 'reports' ? '#FFFFFF' : '#6B4F3E',
            border:     activeTab === 'reports' ? '1px solid #A67C5A' : '1px solid #DCC9B2',
            fontWeight: activeTab === 'reports' ? 700 : 500,
          }}
        >
          <FileText className="w-4 h-4" /> Reports Management
        </button>
        <button
          onClick={() => { setActiveTab('alerts'); setError(''); }}
          className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2"
          style={{
            background: activeTab === 'alerts' ? '#A67C5A' : '#FFFFFF',
            color:      activeTab === 'alerts' ? '#FFFFFF' : '#6B4F3E',
            border:     activeTab === 'alerts' ? '1px solid #A67C5A' : '1px solid #DCC9B2',
            fontWeight: activeTab === 'alerts' ? 700 : 500,
          }}
        >
          <Bell className="w-4 h-4" /> Alerts Management
        </button>
      </div>

      {/* Global error */}
      {error && (
        <div className="p-3.5 rounded-xl text-sm" style={{ background: 'rgba(89,125,138,0.08)', border: '1px solid rgba(89,125,138,0.3)', color: '#3D6070' }}>
          {error}
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl" style={{ background: '#DCC9B2' }} />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2' }}>
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#A08070' }} />
              <p className="font-medium" style={{ color: '#6B4F3E' }}>No reports submitted yet.</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead style={{ background: '#FBF6EE' }}>
                    <tr>
                      <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>ID</th>
                      <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Beach</th>
                      <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Type</th>
                      <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Status</th>
                      <th className="px-6 py-4 font-medium" style={{ color: '#6B4F3E' }}>Time</th>
                      <th className="px-6 py-4 font-medium text-right" style={{ color: '#6B4F3E' }}>Actions</th>
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
                        <td className="px-6 py-4 font-medium" style={{ color: '#3A2A20' }}>{report.beach_name || `Beach #${report.beach_id}`}</td>
                        <td className="px-6 py-4 capitalize" style={{ color: '#6B4F3E' }}>{report.issue_type.replace('_', ' ')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                            report.status === 'PENDING'  ? 'bg-amber-50 text-amber-600' :
                            report.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-[rgba(89,125,138,0.08)] text-[#3D6070]'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-1 mt-1" style={{ color: '#A08070' }}>
                          <Clock className="w-3.5 h-3.5" /> {timeAgo(report.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {report.status === 'PENDING' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateReport(report.id, 'VERIFIED')}
                                disabled={updatingReportId === report.id}
                                className="p-2 rounded-lg transition-colors disabled:opacity-50"
                                style={{ background: 'rgba(124,153,134,0.10)', color: '#4C8B6F', border: '1px solid rgba(124,153,134,0.35)' }}
                                title="Verify Report"
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,153,134,0.20)'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,153,134,0.10)'}
                              >
                                {updatingReportId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleUpdateReport(report.id, 'REJECTED')}
                                disabled={updatingReportId === report.id}
                                className="p-2 rounded-lg transition-colors disabled:opacity-50"
                                style={{ background: 'rgba(89,125,138,0.08)', color: '#3D6070', border: '1px solid rgba(89,125,138,0.30)' }}
                                title="Reject Report"
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.15)'}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(89,125,138,0.08)'}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs" style={{ color: '#A08070' }}>Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ALERTS TAB ── */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create alert form */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#3A2A20' }}>Issue a New Alert</h2>
            {alertSuccess && (
              <div className="mb-4 p-3.5 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(124,153,134,0.10)', border: '1px solid rgba(124,153,134,0.30)', color: '#4C8B6F' }}>
                <CheckCircle className="w-4 h-4" /> Alert published successfully!
              </div>
            )}
            <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                {/* Beach */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>Affected Beach *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A67C5A' }} />
                    <select
                      value={alertBeachId}
                      onChange={(e) => setAlertBeachId(e.target.value)}
                      required
                      className={`${formInputCls} pl-9 pr-9 py-2.5`}
                      style={formInputStyle}
                      onFocus={formFocus}
                      onBlur={formBlur}
                    >
                      <option value="" disabled>Select a beach</option>
                      {beaches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#A08070' }} />
                  </div>
                </div>

                {/* Type & Severity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>Type *</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      required
                      className={`${formInputCls} px-3 py-2.5`}
                      style={formInputStyle}
                      onFocus={formFocus}
                      onBlur={formBlur}
                    >
                      <option value="" disabled>Select</option>
                      <option value="OCEAN">Ocean</option>
                      <option value="WEATHER">Weather</option>
                      <option value="MARINE_LIFE">Marine Life</option>
                      <option value="WATER_QUALITY">Water Quality</option>
                      <option value="CROWD">Crowd Safety</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>Severity *</label>
                    <select
                      value={alertSeverity}
                      onChange={(e) => setAlertSeverity(e.target.value)}
                      required
                      className={`${formInputCls} px-3 py-2.5`}
                      style={formInputStyle}
                      onFocus={formFocus}
                      onBlur={formBlur}
                    >
                      <option value="" disabled>Select</option>
                      <option value="CRITICAL">🔴 Critical</option>
                      <option value="WARNING">🟠 Warning</option>
                      <option value="INFO">🟡 Info</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>Title *</label>
                  <input
                    type="text"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="e.g., High Tide Warning"
                    required
                    className={`${formInputCls} px-3 py-2.5`}
                    style={{ ...formInputStyle }}
                    onFocus={formFocus}
                    onBlur={formBlur}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#3A2A20' }}>Message *</label>
                  <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Describe the situation..."
                    required
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm resize-none outline-none transition-all"
                    style={formInputStyle}
                    onFocus={formFocus}
                    onBlur={formBlur}
                  />
                </div>

                {/* Publish */}
                <button
                  type="submit"
                  disabled={isCreatingAlert}
                  className="w-full py-3 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: isCreatingAlert ? '#C9A984' : '#A67C5A' }}
                  onMouseEnter={e => { if (!isCreatingAlert) (e.currentTarget as HTMLButtonElement).style.background = '#8C6647'; }}
                  onMouseLeave={e => { if (!isCreatingAlert) (e.currentTarget as HTMLButtonElement).style.background = '#A67C5A'; }}
                >
                  {isCreatingAlert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  Publish Alert
                </button>
              </form>
            </div>
          </div>

          {/* Active alerts list */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#3A2A20' }}>Active Alerts</h2>
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => <div key={i} className="h-24 rounded-2xl" style={{ background: '#DCC9B2' }} />)}
              </div>
            ) : alerts.length === 0 ? (
              <div className="rounded-2xl p-8 text-center text-sm" style={{ background: '#FBF6EE', border: '1px solid #DCC9B2', color: '#6B4F3E' }}>
                No active alerts.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {alerts.map((alert) => {
                  const alertColor = alert.severity === 'CRITICAL' ? '#597D8A' : alert.severity === 'WARNING' ? '#6E93A6' : '#A67C5A';
                  return (
                    <div key={alert.id} className="rounded-2xl p-4 flex gap-3" style={{ background: '#FFFFFF', border: '1px solid #DCC9B2' }}>
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-1" style={{ color: alertColor }} />
                      <div>
                        <h4 className="font-medium text-sm" style={{ color: '#3A2A20' }}>{alert.title}</h4>
                        <div className="flex gap-2 text-xs mt-1 mb-2">
                          <span style={{ color: '#A08070' }}>{alert.beach_name || `Beach #${alert.beach_id}`}</span>
                          <span style={{ color: '#DCC9B2' }}>•</span>
                          <span style={{ color: '#A08070' }}>{timeAgo(alert.created_at)}</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#6B4F3E' }}>{alert.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
