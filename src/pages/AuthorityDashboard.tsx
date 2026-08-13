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
  const criticalCount = reports.filter(r => r.issue_type === 'rip_current' || r.issue_type === 'missing_person').length; // Rough metric
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const resolvedCount = reports.filter(r => r.status === 'VERIFIED' || r.status === 'REJECTED').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#20364A] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            Authority Dashboard
          </h1>
          <p className="text-slate-400">
            Manage user reports, issue alerts, and synchronize external data sources.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-[#13263A] border border-[#20364A] hover:border-cyan-500/50 text-white font-medium rounded-xl text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Refresh Data'}
          </button>
          {syncMessage && <span className="text-xs text-emerald-400 font-medium">{syncMessage}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5">
          <div className="text-slate-400 text-sm font-medium mb-1">Pending Reports</div>
          <div className="text-3xl font-bold text-amber-400">{pendingCount}</div>
        </div>
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5">
          <div className="text-slate-400 text-sm font-medium mb-1">Critical Reports</div>
          <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
        </div>
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5">
          <div className="text-slate-400 text-sm font-medium mb-1">Active Alerts</div>
          <div className="text-3xl font-bold text-cyan-400">{activeAlertsCount}</div>
        </div>
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-5">
          <div className="text-slate-400 text-sm font-medium mb-1">Resolved Reports</div>
          <div className="text-3xl font-bold text-emerald-400">{resolvedCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('reports'); setError(''); }}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'reports' ? 'bg-cyan-500 text-[#07111F] shadow-lg shadow-cyan-500/20' : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50'
          }`}
        >
          <FileText className="w-4 h-4" /> Reports Management
        </button>
        <button
          onClick={() => { setActiveTab('alerts'); setError(''); }}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'alerts' ? 'bg-cyan-500 text-[#07111F] shadow-lg shadow-cyan-500/20' : 'bg-[#0D1B2A] text-slate-400 border border-[#20364A] hover:border-cyan-500/50'
          }`}
        >
          <Bell className="w-4 h-4" /> Alerts Management
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="bg-[#0D1B2A] h-24 rounded-2xl border border-[#20364A]" />)}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-16 bg-[#0D1B2A] border border-[#20364A] rounded-2xl">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No reports submitted yet.</p>
            </div>
          ) : (
            <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#13263A] text-slate-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Beach</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#20364A]">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-[#13263A]/30 transition-colors">
                        <td className="px-6 py-4 text-slate-400">#{report.id}</td>
                        <td className="px-6 py-4 text-white font-medium">{report.beach_name || `Beach #${report.beach_id}`}</td>
                        <td className="px-6 py-4 text-slate-300 capitalize">{report.issue_type.replace('_', ' ')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                            report.status === 'PENDING' ? 'bg-amber-500/15 text-amber-400' :
                            report.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' :
                            'bg-red-500/15 text-red-400'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" /> {timeAgo(report.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {report.status === 'PENDING' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateReport(report.id, 'VERIFIED')}
                                disabled={updatingReportId === report.id}
                                className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                title="Verify Report"
                              >
                                {updatingReportId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleUpdateReport(report.id, 'REJECTED')}
                                disabled={updatingReportId === report.id}
                                className="p-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                title="Reject Report"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-xs">Reviewed</span>
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

      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Issue a New Alert</h2>
            {alertSuccess && (
              <div className="mb-4 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Alert published successfully!
              </div>
            )}
            <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6">
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Affected Beach *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={alertBeachId}
                      onChange={(e) => setAlertBeachId(e.target.value)}
                      required
                      className="w-full pl-9 pr-9 py-2.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white focus:border-cyan-500/50 outline-none text-sm appearance-none"
                    >
                      <option value="" disabled>Select a beach</option>
                      {beaches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type *</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white focus:border-cyan-500/50 outline-none text-sm appearance-none"
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
                    <label className="block text-sm font-medium text-slate-300 mb-2">Severity *</label>
                    <select
                      value={alertSeverity}
                      onChange={(e) => setAlertSeverity(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white focus:border-cyan-500/50 outline-none text-sm appearance-none"
                    >
                      <option value="" disabled>Select</option>
                      <option value="CRITICAL">🔴 Critical</option>
                      <option value="WARNING">🟠 Warning</option>
                      <option value="INFO">🔵 Info</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="e.g., High Tide Warning"
                    required
                    className="w-full px-3 py-2.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white focus:border-cyan-500/50 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                  <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    placeholder="Describe the situation..."
                    required
                    rows={3}
                    className="w-full px-3 py-2.5 bg-[#13263A] border border-[#20364A] rounded-xl text-white focus:border-cyan-500/50 outline-none text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingAlert}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-[#07111F] font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isCreatingAlert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  Publish Alert
                </button>
              </form>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">Active Alerts</h2>
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => <div key={i} className="bg-[#0D1B2A] h-24 rounded-2xl border border-[#20364A]" />)}
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 text-center text-slate-400 text-sm">
                No active alerts.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-4 flex gap-3">
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-1 ${alert.severity === 'CRITICAL' ? 'text-red-400' : alert.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-400'}`} />
                    <div>
                      <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                      <div className="flex gap-2 text-xs mt-1 mb-2">
                        <span className="text-slate-400">{alert.beach_name || `Beach #${alert.beach_id}`}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{timeAgo(alert.created_at)}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
