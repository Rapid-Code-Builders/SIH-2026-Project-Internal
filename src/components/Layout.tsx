import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-x-hidden"
      style={{ background: '#F3E8D9', color: '#3A2A20' }}
    >
      {/* Ambient background — subtle video underlay at very low opacity */}
      <video
        autoPlay muted loop playsInline
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.035, zIndex: 0 }}
        src="/bg.mp4"
      />

      {/* Ambient color glows — soft radial gradients at corners for page warmth */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: [
            'radial-gradient(ellipse 60% 50% at 90% 5%, rgba(166,124,90,0.09) 0%, transparent 70%)',
            ',radial-gradient(ellipse 50% 45% at 5% 95%, rgba(91,158,138,0.07) 0%, transparent 70%)',
          ].join(''),
        }}
      />

      {/* Floating Navbar at the top */}
      <div className="relative z-10">
        {showSidebar && <Navbar />}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden min-w-0 relative z-10" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          className="w-full px-6 md:px-10 pt-8 pb-16"
          style={{ maxWidth: '1280px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
