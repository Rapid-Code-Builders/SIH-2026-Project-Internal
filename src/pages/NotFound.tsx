import { Link } from 'react-router-dom';
import { Waves, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="text-center max-w-md">
        <div
          className="inline-flex items-center justify-center p-4 rounded-2xl mb-6"
          style={{ background: 'rgba(166,124,90,0.1)' }}
        >
          <Waves className="w-12 h-12" style={{ color: '#A67C5A' }} />
        </div>
        <h1 className="text-6xl font-black mb-2" style={{ color: '#3A2A20' }}>404</h1>
        <h2 className="text-xl font-bold mb-3" style={{ color: '#6B4F3E' }}>Page Not Found</h2>
        <p className="mb-8" style={{ color: '#6B4F3E' }}>
          The page you're looking for doesn't exist or has been swept away by the tide.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-colors text-sm"
          style={{ background: '#A67C5A' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#8C6647')}
          onMouseLeave={e => (e.currentTarget.style.background = '#A67C5A')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
