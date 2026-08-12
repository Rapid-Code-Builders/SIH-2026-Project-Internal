// =============================================================================
// Report Page — Placeholder (Phase 1)
// =============================================================================
// PROTECTED page — login required.
// Lets users submit safety reports (rip current, pollution, etc.).
// Will be fully built in Phase 6.
// Route: /report
// API: POST /api/reports
// =============================================================================

import { FileText } from 'lucide-react';

export default function Report() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-7 h-7 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white">Report an Issue</h1>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-500">
          Report submission form will be built in Phase 6.
        </p>
      </div>
    </div>
  );
}
