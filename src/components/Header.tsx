import React from 'react';
import { Sparkles, Volume2, VolumeX, Trophy, Award, Home, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  points: number;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  setScreen,
  points,
  soundEnabled,
  toggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#050811]/90 border-b border-[#172A45] px-4 py-3 shadow-lg transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Left/Right controls (RTL) */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' ? (
            <button
              onClick={() => setScreen('home')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#112240] hover:bg-[#172A45] text-blue-100 border border-blue-800/80 transition active:scale-95 cursor-pointer"
              title="الرئيسية"
            >
              <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
              <span>الرئيسية</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#112240] border border-yellow-500/30 text-yellow-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-blue-200 text-[11px]">ذكاء اصطناعي</span>
            </div>
          )}
        </div>

        {/* Center Title Logo */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:scale-105 transition-transform">
            <span className="text-[#050811] font-black text-lg leading-none">G</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 block leading-tight">
              GuessAI
            </span>
          </div>
        </button>

        {/* Right side controls: Sound & Points */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-[#112240] hover:bg-[#172A45] border border-blue-800/80 text-blue-200 transition active:scale-95 cursor-pointer"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-yellow-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <div className="bg-[#112240] px-3 py-1.5 rounded-full border border-yellow-500/20 flex items-center gap-1.5 shadow-inner">
            <span className="text-yellow-400 font-bold text-xs">{points.toLocaleString('ar-EG')}</span>
            <span className="text-[10px] text-blue-200">نقطة</span>
          </div>
        </div>

      </div>
    </header>
  );
};
