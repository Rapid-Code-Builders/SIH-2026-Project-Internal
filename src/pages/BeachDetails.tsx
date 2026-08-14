import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Waves,
  Droplets,
  Users,
  AlertTriangle,
  Info,
  ThermometerSun,
  MapPin,
  RefreshCw,
  Navigation,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { getBeachDashboard } from '../services/api';
import type { DashboardResponse, Beach } from '../types';
import { getStatusColor, getStatusBgColor, getSeverityColor } from '../utils/helpers';

const ACTIVITIES = [
  { id: 'swimming', label: 'Swimming' },
  { id: 'surfing',  label: 'Surfing'  },
  { id: 'fishing',  label: 'Fishing'  },
  { id: 'diving',   label: 'Diving'   },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getConditionSummary(category: string, status: string, details: Record<string, any>): string | null {
  const s = status?.toUpperCase();
  const c = category?.toLowerCase();
  if (s === 'SAFE') return null;

  if (c === 'ocean') {
    const rip = (details.rip_current_risk as string | undefined)?.toLowerCase() ?? '';
    if (s === 'UNSAFE') return `${rip ? rip.charAt(0).toUpperCase() + rip.slice(1) : 'High'} rip current risk — swimming not advised`;
    if (s === 'CAUTION') return 'Moderate wave conditions — exercise caution in the water';
  }
  if (c === 'water_quality') {
    if (s === 'UNSAFE') return 'Poor water quality detected — avoid contact with the water';
    if (s === 'CAUTION') return 'Below-optimal water quality — vulnerable groups should avoid swimming';
  }
  if (c === 'weather') {
    if (s === 'UNSAFE') return 'Severe weather conditions — beach activities not recommended';
    if (s === 'CAUTION') return 'Weather conditions require attention — monitor for updates';
  }
  if (c === 'crowd') {
    if (s === 'UNSAFE') return 'Beach capacity exceeded — dangerously overcrowded';
    if (s === 'CAUTION') return 'High visitor density — maintain awareness near the water';
  }
  return null;
}

function getDirectionsUrl(beach: Beach): string {
  if (beach.latitude && beach.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${beach.latitude},${beach.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${beach.name}, ${beach.location}`)}`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse pb-16 px-4 md:px-8 max-w-[1400px] mx-auto mt-4">
    <div className="h-8 w-32 rounded-full mb-6" style={{ background: '#EAE0D5' }} />
    <div className="h-[500px] rounded-[40px]" style={{ background: '#EAE0D5' }} />
    <div className="h-10 w-full md:w-96 rounded-2xl mt-8" style={{ background: '#EAE0D5' }} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-56 rounded-[32px]" style={{ background: '#EAE0D5' }} />)}
    </div>
  </div>
);

const BSIGauge = ({ score, status }: { score: number; status: string }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#E76F51'; // Unsafe coral red
  if (status === 'SAFE')    strokeColor = '#2A9D8F'; // Safe teal
  if (status === 'CAUTION') strokeColor = '#E9C46A'; // Caution yellow

  return (
    <div className="relative flex items-center justify-center w-32 h-32 drop-shadow-xl">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          className="transition-all duration-1000 ease-out"
          stroke={strokeColor} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-black tracking-tighter" style={{ color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>{score}</span>
      </div>
    </div>
  );
};

const Lightbox = ({
  images, index, onClose, onPrev, onNext,
}: {
  images: string[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
    style={{ background: 'rgba(20, 18, 16, 0.95)', backdropFilter: 'blur(15px)' }}
    onClick={onClose}
  >
    <button
      onClick={e => { e.stopPropagation(); onClose(); }}
      className="absolute top-6 right-6 p-3 rounded-full transition-all hover:scale-110"
      style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
    >
      <X className="w-6 h-6" />
    </button>

    {images.length > 1 && (
      <>
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 p-4 rounded-full transition-all hover:scale-110 hover:bg-white/20"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 p-4 rounded-full transition-all hover:scale-110 hover:bg-white/20"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </>
    )}

    <img
      src={images[index]}
      alt="Enlarged gallery view"
      className="max-h-[85vh] max-w-[85vw] rounded-[2rem] object-contain shadow-2xl transition-transform duration-300"
      onClick={e => e.stopPropagation()}
    />

    <div className="absolute bottom-8 px-4 py-2 rounded-full text-sm font-semibold tracking-widest" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}>
      {index + 1} / {images.length}
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function BeachDetails() {
  const { id }      = useParams<{ id: string }>();
  const navigate    = useNavigate();

  const [activity,      setActivity]      = useState('swimming');
  const [data,          setData]          = useState<DashboardResponse | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [error,         setError]         = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchDashboard = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const dashboardData = await getBeachDashboard(Number(id), activity);
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load beach details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, [id, activity]);

  const getConditionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'weather':       return <ThermometerSun className="w-6 h-6" />;
      case 'ocean':         return <Waves          className="w-6 h-6" />;
      case 'water_quality': return <Droplets       className="w-6 h-6" />;
      case 'crowd':         return <Users          className="w-6 h-6" />;
      default:              return <Info           className="w-6 h-6" />;
    }
  };

  if (isLoading && !data) return <LoadingSkeleton />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="p-6 rounded-full mb-6" style={{ background: 'rgba(166,124,90,0.1)' }}>
          <AlertTriangle className="w-12 h-12" style={{ color: '#A67C5A' }} />
        </div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>Oops! Nothing here.</h2>
        <p className="mb-8" style={{ color: '#A08070' }}>{error || "We couldn't find the beach you're looking for."}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105 shadow-lg"
          style={{ background: '#A67C5A' }}
        >
          Take me back
        </button>
      </div>
    );
  }

  const { beach, safety_index, conditions, alerts } = data;
  const isSafetyOverride = (beach as any).safety_override;
  const heroImage = beach.heroImage;
  const gallery   = beach.gallery ?? [];

  const closeLightbox = () => setLightboxIndex(null);
  const prevImage     = () => setLightboxIndex(i => i !== null ? (i - 1 + gallery.length) % gallery.length : 0);
  const nextImage     = () => setLightboxIndex(i => i !== null ? (i + 1) % gallery.length : 0);

  return (
    <div className="w-full space-y-12 animate-fade-in pb-24 max-w-[1600px] mx-auto px-4 md:px-8 mt-4">

      <style>{`
        /* Pinterest-style Masonry */
        .masonry-grid {
          column-count: 1;
          column-gap: 16px;
        }
        @media (min-width: 640px) { .masonry-grid { column-count: 2; } }
        @media (min-width: 1024px) { .masonry-grid { column-count: 3; } }
        @media (min-width: 1280px) { .masonry-grid { column-count: 4; } }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 16px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          cursor: zoom-in;
          transform: translateZ(0);
        }
        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .masonry-item:hover img {
          transform: scale(1.05);
        }
        .masonry-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.0);
          transition: background 0.3s ease;
          pointer-events: none;
        }
        .masonry-item:hover::after {
          background: rgba(0,0,0,0.15);
        }
        
        /* Soft Floating Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 40px rgba(58, 42, 32, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1);
          border-radius: 32px;
        }
        .solid-soft-card {
          background: #FFFFFF;
          border-radius: 32px;
          box-shadow: 0 10px 30px rgba(58, 42, 32, 0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .solid-soft-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(58, 42, 32, 0.06);
        }
      `}</style>

      {/* ── Back Navigation ── */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all text-sm font-bold bg-white shadow-sm hover:shadow-md hover:-translate-x-1"
        style={{ color: '#3A2A20' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Explore Beaches
      </button>

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <div
        className="relative overflow-hidden rounded-[40px] flex flex-col justify-end"
        style={{
          minHeight: '65vh',
          background: heroImage
            ? `url(${heroImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, #E6D5B8 0%, #E2C2A4 100%)',
          boxShadow: '0 24px 64px rgba(58,42,32,0.15)',
        }}
      >
        {/* Soft, deep gradient scrim for beautiful text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.1) 40%, rgba(15,10,5,0.85) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-14 w-full flex flex-col md:flex-row md:items-end justify-between gap-10">
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg ${getStatusBgColor(beach.status)} border-none`}>
                {beach.status}
              </span>
              <a
                href={getDirectionsUrl(beach)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'}
              >
                <Navigation className="w-3.5 h-3.5" />
                Directions
              </a>
            </div>

            <h1
              className="mb-2 leading-none drop-shadow-2xl"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#FFFFFF',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              {beach.name}
            </h1>
            
            <p className="text-lg md:text-xl font-medium mb-10 flex items-center gap-2 drop-shadow-md" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <MapPin className="w-5 h-5" style={{ color: '#E9C46A' }} />
              {beach.location}
            </p>

            {/* Organic Activity Selector */}
            <div className="flex flex-wrap gap-3">
              {ACTIVITIES.map(act => (
                <button
                  key={act.id}
                  onClick={() => setActivity(act.id)}
                  className="px-6 py-3 rounded-full text-sm transition-all duration-300 flex items-center gap-2 shadow-lg"
                  style={{
                    backdropFilter: 'blur(16px)',
                    background: activity === act.id ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                    color:      activity === act.id ? '#3A2A20' : '#FFFFFF',
                    fontWeight: 700,
                    transform: activity === act.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {act.label}
                  {isLoading && activity === act.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                </button>
              ))}
            </div>
          </div>

          {/* Floating BSI Orb */}
          <div className="flex flex-col items-center justify-center">
             <div 
               className="rounded-full p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden"
               style={{
                 background: 'rgba(255,255,255,0.1)',
                 backdropFilter: 'blur(30px)',
                 border: '1px solid rgba(255,255,255,0.2)',
               }}
             >
               <BSIGauge score={safety_index.score} status={safety_index.status} />
             </div>
             <div className="mt-4 text-center">
               <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Safety Score</p>
               <p className="text-sm font-medium mt-1" style={{ color: '#FFFFFF' }}>For {safety_index.activity}</p>
             </div>
          </div>

        </div>
      </div>

      {/* ══════════════════ ALERTS (If any) ══════════════════ */}
      {(isSafetyOverride || alerts.length > 0) && (
        <div className="space-y-4">
          {isSafetyOverride && (
            <div className="p-6 rounded-[24px] flex items-start gap-5 shadow-sm" style={{ background: '#FFF4F2', color: '#C74B3F' }}>
              <div className="p-3 bg-white rounded-full shadow-sm"><AlertTriangle className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-lg">Manual Override</h4>
                <p className="text-sm opacity-90 mt-1">{(beach as any).override_reason || 'Local authorities have manually overridden the safety status.'}</p>
              </div>
            </div>
          )}

          {alerts.map(alert => (
            <div key={alert.id} className={`p-6 rounded-[24px] flex flex-col md:flex-row md:items-start gap-5 shadow-sm ${getSeverityColor(alert.severity).replace('border', '')}`} style={{ border: 'none' }}>
              <div className="p-3 bg-white/50 rounded-full"><AlertTriangle className="w-6 h-6" /></div>
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-3 tracking-wider bg-black/5">
                  {alert.alert_type.replace('_', ' ')}
                </span>
                <h4 className="text-xl font-bold mb-2">{alert.title}</h4>
                <p className="opacity-90">{alert.message}</p>
                {alert.instruction && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4 rotate-180" /> {alert.instruction}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════ PHOTO GALLERY (MASONRY) ══════════════════ */}
      {gallery.length > 0 && (
        <div className="pt-8">
          <h2 className="text-3xl font-bold mb-8 px-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
            Vistas & Views
          </h2>
          <div className="masonry-grid">
            {gallery.map((src, i) => (
              <div key={i} className="masonry-item" onClick={() => setLightboxIndex(i)}>
                <img src={src} alt={`Scenic view ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ DETAILED CONDITIONS (PINTEREST STYLE CARDS) ══════════════════ */}
      <div className="pt-8">
        <h2 className="text-3xl font-bold mb-8 px-2" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
          Current Conditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conditions.map((cond, idx) => {
            const summary = getConditionSummary(cond.category, cond.status, cond.details);
            // Assign soft pastel backgrounds based on category for that organic feel
            const bgColors: Record<string, string> = {
              weather: '#F9F4EE',
              ocean: '#F0F6F7',
              water_quality: '#F2F6F3',
              crowd: '#FCF5EE',
            };
            const iconColors: Record<string, string> = {
              weather: '#D69A3C',
              ocean: '#3E6E8E',
              water_quality: '#4C8B6F',
              crowd: '#C74B3F',
            };
            const catLower = cond.category.toLowerCase();
            const bgColor = bgColors[catLower] || '#FFFFFF';
            const iconColor = iconColors[catLower] || '#3A2A20';

            return (
              <div key={idx} className="solid-soft-card overflow-hidden flex flex-col" style={{ background: bgColor }}>
                
                <div className="p-8 flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 rounded-2xl bg-white shadow-sm" style={{ color: iconColor }}>
                      {getConditionIcon(cond.category)}
                    </div>
                    <span className={`px-4 py-1.5 text-xs font-black rounded-full uppercase tracking-widest shadow-sm ${getStatusBgColor(cond.status)} border-none`}>
                      {cond.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 capitalize" style={{ fontFamily: "'Playfair Display', serif", color: '#3A2A20' }}>
                    {cond.category.replace('_', ' ')}
                  </h3>
                  
                  {summary && (
                    <p className="text-sm font-semibold mb-6 p-4 rounded-2xl bg-white/60" style={{ color: cond.status === 'UNSAFE' ? '#C74B3F' : '#D69A3C' }}>
                      {summary}
                    </p>
                  )}

                  <div className="space-y-5 mt-6">
                    {Object.entries(cond.details).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-1" style={{ color: '#3A2A20' }}>
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-lg font-semibold" style={{ color: '#3A2A20' }}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-5 bg-white/40 mt-auto">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-right" style={{ color: '#3A2A20' }}>
                    Source: {cond.source}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <Lightbox
          images={gallery}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

    </div>
  );
}
