import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);

    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const finishTimer = setTimeout(() => onFinish(), 2750);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-400 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        /* Warm off-white paper texture background */
        backgroundColor: '#F3E8D9',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
        `,
        backgroundSize: '400px 400px',
      }}
    >
      <div className="flex flex-col items-center gap-0">

        {/* Logo — transparent directly on light bg */}
        <img
          src="/logo.png"
          alt="Kinaara"
          className="h-36 md:h-44 w-auto object-contain select-none"
          style={{ mixBlendMode: 'multiply' }}
          draggable={false}
        />

        {/* Loading bar */}
        <div className="mt-10 w-56 h-[3px] rounded-full overflow-hidden" style={{ background: '#E0D8CC' }}>
          <div
            className="h-full rounded-full transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #C2905A, #A67C5A)',
            }}
          />
        </div>

      </div>
    </div>
  );
}
