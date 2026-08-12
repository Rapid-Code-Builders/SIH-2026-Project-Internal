// =============================================================================
// TideSense — 404 Not Found Page
// =============================================================================

import { Link } from 'react-router-dom';
import { Waves, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-2xl mb-6">
          <Waves className="w-12 h-12 text-cyan-400" />
        </div>
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-300 mb-3">Page Not Found</h2>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been swept away by the tide.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-[#07111F] font-semibold rounded-xl transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
