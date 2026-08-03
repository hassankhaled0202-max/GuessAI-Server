import React, { useState } from 'react';
import { Play, Trophy, Award, Sparkles, HelpCircle, Flame, Target, Shield, BookOpen } from 'lucide-react';
import { ScreenType, CharacterCategory, DifficultyLevel, GameStats } from '../types';

interface HomeScreenProps {
  setScreen: (screen: ScreenType) => void;
  selectedCategory: CharacterCategory;
  setSelectedCategory: (cat: CharacterCategory) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (diff: DifficultyLevel) => void;
  stats: GameStats;
  onStartGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  setScreen,
  selectedCategory,
  setSelectedCategory,
  difficulty,
  setDifficulty,
  stats,
  onStartGame,
}) => {
  const categories: { id: CharacterCategory; name: string; icon: string }[] = [
    { id: 'all', name: 'جميع الشخصيات', icon: '✨' },
    { id: 'historical', name: 'شخصيات تاريخية', icon: '📜' },
    { id: 'scientists', name: 'علماء ومفكرون', icon: '🔬' },
    { id: 'leaders', name: 'قادة وحكام', icon: '👑' },
    { id: 'poets', name: 'شعراء وأدباء', icon: '✒️' },
    { id: 'islamic', name: 'عصر إسلامي', icon: '🌙' },
    { id: 'world', name: 'شخصيات عالمية', icon: '🌍' },
  ];

  return (
    <div className="w-full max-w-md mx-auto px-3 py-4 flex flex-col items-center justify-between min-h-[calc(100vh-65px)] gap-5 text-right">
      
      {/* Immersive Main Card Container */}
      <div className="w-full bg-[#0A192F] rounded-[36px] border-4 border-[#172A45] shadow-2xl relative overflow-hidden flex flex-col items-center p-6 text-center">
        
        {/* Radial Gold Backdrop Glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Title & Glowing Branding */}
        <div className="z-10 w-full mb-6 flex flex-col items-center">
          <div className="relative mb-3 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] border-2 border-yellow-300/50 transform hover:scale-105 transition-transform">
              <HelpCircle className="w-10 h-10 text-[#050811] stroke-[2.5]" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-yellow-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]">
            GuessAI
          </h1>
          <p className="text-blue-300 text-xs font-medium mt-1.5 opacity-90 max-w-xs leading-relaxed">
            تحدى ذكاء الآلة وخمن الشخصية التاريخية السرية!
          </p>
        </div>

        {/* Category Selection */}
        <div className="z-10 w-full bg-[#112240]/80 rounded-2xl p-3.5 border border-blue-900/50 shadow-md mb-4 text-right">
          <label className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1.5 justify-start">
            <BookOpen className="w-3.5 h-3.5" />
            <span>اختر قسم الشخصيات:</span>
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811] border-yellow-300 shadow-md scale-105 font-extrabold'
                      : 'bg-[#172A45] text-blue-200 border-blue-800/60 hover:border-yellow-500/40 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty Selection */}
          <div className="mt-2.5 pt-2.5 border-t border-blue-900/60 flex items-center justify-between">
            <span className="text-xs font-medium text-blue-300 opacity-80">المستوى:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'easy', label: 'سهل (20)' },
                { id: 'medium', label: 'متوسط (15)' },
                { id: 'hard', label: 'صعب (10)' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id as DifficultyLevel)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                    difficulty === diff.id
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60'
                      : 'bg-[#172A45] text-blue-300 border-blue-900 hover:text-white'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Action Start Button */}
        <div className="z-10 w-full mb-3">
          <button
            onClick={onStartGame}
            className="w-full py-4 bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811] font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <Play className="w-6 h-6 fill-[#050811] transition-transform group-hover:scale-110" />
            <span>ابدأ اللعب</span>
          </button>
        </div>

        {/* Navy Secondary Action Buttons */}
        <div className="z-10 w-full grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setScreen('leaderboard')}
            className="py-3 px-3 bg-[#112240] hover:bg-[#172A45] text-blue-100 font-bold text-xs rounded-2xl border border-blue-800 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Trophy className="w-4 h-4 text-yellow-400 transition-transform group-hover:scale-110" />
            <span>لوحة المتصدرين</span>
          </button>

          <button
            onClick={() => setScreen('rewards')}
            className="py-3 px-3 bg-[#112240] hover:bg-[#172A45] text-blue-100 font-bold text-xs rounded-2xl border border-blue-800 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Award className="w-4 h-4 text-yellow-400 transition-transform group-hover:scale-110" />
            <span>الجوائز والأوسمة</span>
          </button>
        </div>

      </div>

      {/* Footer Stats Banner */}
      <div className="w-full bg-[#0A192F] border-2 border-[#172A45] rounded-2xl p-3 grid grid-cols-3 text-center text-xs text-blue-200">
        <div className="flex flex-col items-center">
          <span className="text-blue-400 text-[10px]">الانتصارات</span>
          <span className="font-extrabold text-yellow-400 text-sm mt-0.5">{stats.wins}</span>
        </div>
        <div className="flex flex-col items-center border-x border-[#172A45]">
          <span className="text-blue-400 text-[10px]">السلسلة الحالية</span>
          <div className="flex items-center gap-1 font-extrabold text-orange-400 text-sm mt-0.5">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            <span>{stats.currentStreak}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-blue-400 text-[10px]">إجمالي النقاط</span>
          <span className="font-extrabold text-yellow-400 text-sm mt-0.5">{stats.totalPoints}</span>
        </div>
      </div>

    </div>
  );
};
