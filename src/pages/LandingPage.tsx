import { Link } from 'react-router-dom';
import { Shield, Droplets, Users, ArrowRight, Waves } from 'lucide-react';

const features = [
  {
    icon: Shield,
    label: 'Live Safety Monitoring',
    desc: 'Real-time BSI scores derived from wave height, current speed, and verified authority data.',
    accent: '#A67C5A',
    iconBg: 'rgba(166,124,90,0.13)',
    shimmer: 'rgba(166,124,90,0.55)',
    border: 'rgba(166,124,90,0.55)',
  },
  {
    icon: Droplets,
    label: 'Water Quality Data',
    desc: 'Verified quality indices sourced directly from INCOIS — know before you swim.',
    accent: '#6E93A6',
    iconBg: 'rgba(110,147,166,0.13)',
    shimmer: 'rgba(110,147,166,0.55)',
    border: 'rgba(110,147,166,0.55)',
  },
  {
    icon: Users,
    label: 'Community Reports',
    desc: 'Visitor and authority hazard reports, verified and live from India\'s coastline.',
    accent: '#7C9986',
    iconBg: 'rgba(124,153,134,0.13)',
    shimmer: 'rgba(124,153,134,0.55)',
    border: 'rgba(124,153,134,0.55)',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Background Video ──────────────────────────────── */}
      <video
        autoPlay muted loop playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="/bg.mp4"
      />

      {/* ── Multi-stop Overlay ────────────────────────────── */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: [
            'linear-gradient(180deg,',
            '  rgba(243,232,217,0.42) 0%,',
            '  rgba(243,232,217,0.22) 35%,',
            '  rgba(58,42,32,0.38) 72%,',
            '  rgba(33,22,10,0.72) 100%)',
          ].join(''),
        }}
      />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="relative z-[2] flex flex-col min-h-screen">

        {/* ══════════════════ NAVBAR ══════════════════ */}
        <nav className="w-full px-6 pt-5">
          <div
            className="w-full rounded-full flex items-center justify-between px-6 py-3"
            style={{
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(220,201,178,0.75)',
              boxShadow: '0 4px 32px rgba(58,42,32,0.10)',
            }}
          >
            {/* Logo */}
            <img
              src="/logo.png"
              alt="Kinaara"
              className="h-9 w-auto object-contain select-none"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Center nav links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Beaches',   to: '/beaches'   },
                { label: 'Alerts',    to: '/alerts'    },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ color: '#6B4F3E' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#3A2A20';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.08)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
                style={{ color: '#6B4F3E' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(166,124,90,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-bold rounded-xl text-white transition-all flex items-center gap-2 shadow-sm"
                style={{ background: '#A67C5A' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#8C6647'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#A67C5A'}
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </nav>

        {/* ══════════════════ HERO ══════════════════ */}
        <main className="flex-1 flex flex-col">
          <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

            {/* Headline */}
            <h1
              className="text-6xl md:text-[7.5rem] font-medium leading-[0.95] tracking-tight mb-8 drop-shadow-2xl"
              style={{ fontFamily: "'Playfair Display', serif", color: '#FDFBF7' }}
            >
              Embrace the
              <br />
              <span className="italic font-light" style={{ color: '#F5D8B5' }}>Ocean.</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed mb-12 drop-shadow-md"
              style={{ color: 'rgba(253, 251, 247, 0.9)' }}
            >
              Live surf conditions, verified safety scores, and real-time hazard alerts for the mindful coastal explorer.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-5 flex-wrap justify-center">
              <Link
                to="/beaches"
                className="px-8 py-4 rounded-full font-bold text-sm text-white transition-all shadow-xl flex items-center gap-2 group"
                style={{ background: '#4A3728', border: '1px solid #5C4634' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#3A2A20';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#4A3728';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                Start Exploring
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all backdrop-blur-md hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#FDFBF7',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                Join the Community
              </Link>
            </div>
          </section>

          {/* ══════════════════ FEATURE CARDS ══════════════════ */}
          <section className="w-full px-6 md:px-8 lg:px-12 pb-24 relative z-[2]">
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="group relative rounded-2xl p-8 transition-all duration-500 backdrop-blur-md overflow-hidden cursor-default"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.08)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.03)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Top Shimmer Effect */}
                      <div className="absolute top-0 inset-x-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                           style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
                      
                      {/* Icon */}
                      <div className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        <Icon className="w-7 h-7" style={{ color: f.accent || '#FDFBF7' }} strokeWidth={1.5} />
                      </div>
                      
                      <h3
                        className="text-xl font-medium mb-4 tracking-wide"
                        style={{ fontFamily: "'Playfair Display', serif", color: '#FDFBF7' }}
                      >
                        {f.label}
                      </h3>
                      
                      <p className="text-[13px] leading-relaxed font-light" style={{ color: 'rgba(253, 251, 247, 0.7)' }}>
                        {f.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer
          className="px-8 py-4 flex items-center justify-between gap-6 backdrop-blur-md"
          style={{
            borderTop: '1px solid rgba(220,201,178,0.45)',
            background: 'rgba(255,255,255,0.78)',
          }}
        >
          <img
            src="/logo.png"
            alt="Kinaara"
            className="h-7 w-auto object-contain"
            style={{ mixBlendMode: 'multiply', opacity: 0.70 }}
          />
          <p className="text-xs" style={{ color: '#A08070' }}>
            © 2026 Kinaara — Smart India Hackathon.
          </p>
          <div className="flex items-center gap-5">
            {[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Login', to: '/login' }].map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs transition-colors"
                style={{ color: '#6B4F3E' }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#A67C5A'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#6B4F3E'}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
