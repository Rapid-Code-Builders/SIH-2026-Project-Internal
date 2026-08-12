// =============================================================================
// Profile Page — Placeholder (Phase 1)
// =============================================================================
// PROTECTED page — login required.
// Will be fully built in Phase 7.
// Route: /profile
// API: GET /api/users/me, PUT /api/users/me
// =============================================================================

import { User } from 'lucide-react';

export default function Profile() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-7 h-7 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 min-h-[40vh] flex items-center justify-center">
        <p className="text-slate-500">
          Profile view and edit form will be built in Phase 7.
        </p>
      </div>
    </div>
  );
}
