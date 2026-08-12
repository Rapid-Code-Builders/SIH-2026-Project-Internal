// =============================================================================
// Home / Dashboard Page — Placeholder (Phase 1)
// =============================================================================
// This is the MAIN product screen. Will be fully built in Phase 3 with:
//   - Summary cards (Safe / Caution / Unsafe counts)
//   - Interactive map (react-leaflet + OpenStreetMap)
//   - Beach card grid
//   - Search functionality
//
// It is PUBLIC — no login required.
// API: GET /api/beaches
// =============================================================================

import { Waves, MapPin, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to TideSense
        </h1>
        <p className="text-slate-400 text-lg">
          Check the current safety of India's beaches.
        </p>
      </div>

      {/* Placeholder cards showing the layout structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-400/15 rounded-xl">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">—</p>
            <p className="text-sm text-slate-400">Safe Beaches</p>
          </div>
        </div>

        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-400/15 rounded-xl">
            <Waves className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">—</p>
            <p className="text-sm text-slate-400">Caution</p>
          </div>
        </div>

        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-red-400/15 rounded-xl">
            <MapPin className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">—</p>
            <p className="text-sm text-slate-400">Unsafe</p>
          </div>
        </div>
      </div>

      {/* Map + Beach list placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-slate-500">Map will be rendered here in Phase 3.</p>
        </div>
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-slate-500">Beach list will appear here in Phase 3.</p>
        </div>
      </div>
    </div>
  );
}
