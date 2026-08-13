import { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const duration = 2000;
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    // Fade out and finish
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2200);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 bg-[#07111F] z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <Navigation className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Kinaara
          </h1>
        </div>
        
        <p className="text-slate-400 text-lg tracking-wide uppercase font-medium">
          Coastal Safety Intelligence
        </p>

        <div className="w-64 h-1 bg-[#13263A] rounded-full overflow-hidden mt-8">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
