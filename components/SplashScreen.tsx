
import React, { useEffect, useState } from 'react';
import { APP_CONFIG } from '../constants';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className={`transition-all duration-1000 ease-out transform ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <img 
          src={APP_CONFIG.logoUrl} 
          alt="MediMart Pro Logo" 
          className="w-32 h-32 mb-6 object-contain"
        />
      </div>
      <div className={`transition-all duration-1000 delay-500 ease-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl font-bold text-blue-700 tracking-tight">MediMart Pro</h1>
        <p className="text-center text-slate-500 font-medium mt-2">By Harsh Enterprises</p>
      </div>
      <div className="absolute bottom-10">
        <div className="w-12 h-1 bg-blue-100 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
