// =============================================================================
// Alert Detail Page — Placeholder (Phase 1)
// =============================================================================
// PUBLIC page showing a single alert's details.
// Will be fully built in Phase 5.
// Route: /alerts/:id
// API: GET /api/alerts/{id}
// =============================================================================

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="animate-fade-in">
      <Link
        to="/alerts"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Alerts
      </Link>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">Alert #{id}</p>
          <p className="text-slate-500">
            Alert detail view will be built in Phase 5.
          </p>
        </div>
      </div>
    </div>
  );
}
