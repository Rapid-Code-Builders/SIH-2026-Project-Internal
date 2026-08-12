// =============================================================================
// Alerts List Page — Placeholder (Phase 1)
// =============================================================================
// PUBLIC page showing all active safety alerts.
// Will be fully built in Phase 5.
// Route: /alerts
// API: GET /api/alerts
// =============================================================================

import { AlertTriangle } from 'lucide-react';

export default function Alerts() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="w-7 h-7 text-amber-400" />
        <h1 className="text-2xl font-bold text-white">Active Alerts</h1>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-500">
          Alert list and filters will be built in Phase 5.
        </p>
      </div>
    </div>
  );
}
