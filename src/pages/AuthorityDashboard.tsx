// =============================================================================
// Authority Dashboard — Placeholder (Phase 1)
// =============================================================================
// PROTECTED page — authority login required.
// Will be fully built in Phase 8 with:
//   - Beach status overview
//   - Recent reports table with Verify/Reject
//   - Create Alert form
//   - Refresh Data button
//
// Route: /authority (also /authority/reports, /authority/alerts)
// APIs: GET /api/beaches, GET /api/reports, POST /api/alerts,
//       PUT /api/reports/{id}, POST /api/admin/sync/all
// =============================================================================

import { Shield } from 'lucide-react';

export default function AuthorityDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-7 h-7 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white">Authority Console</h1>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-500">
          Authority dashboard with beach status, reports management, alert creation,
          and data refresh will be built in Phase 8.
        </p>
      </div>
    </div>
  );
}
