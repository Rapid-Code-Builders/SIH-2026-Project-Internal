// =============================================================================
// Beach Details Page — Placeholder (Phase 1)
// =============================================================================
// The HERO screen of the app. Will be fully built in Phase 4 with:
//   - Safety Score (BSI) display
//   - Activity Selector (Swimming / Surfing / Leisure)
//   - Condition Cards (Weather, Ocean, Water, Crowd)
//   - Safety Factor bars
//   - Data source labels
//
// It is PUBLIC — no login required.
// Route: /beaches/:id
// API: GET /api/beaches/{id}/dashboard?activity=swimming
// =============================================================================

import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BeachDetails() {
  // useParams() extracts URL parameters — like FastAPI's path parameters.
  // For route '/beaches/:id', useParams() returns { id: "123" }
  const { id } = useParams<{ id: string }>();

  return (
    <div className="animate-fade-in">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-2">Beach #{id}</p>
          <p className="text-slate-500">
            Beach details with safety score, activity selector, and conditions
            will be built in Phase 4.
          </p>
        </div>
      </div>
    </div>
  );
}
