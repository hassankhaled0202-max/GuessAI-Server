import React, { useState } from 'react';
import { Trophy, Award, Star, Flame, Crown, Search, ArrowRight } from 'lucide-react';
import { INITIAL_LEADERBOARD } from '../data/leaderboardData';
import { GameStats, ScreenType } from '../types';

interface LeaderboardScreenProps {
  stats: GameStats;
  onReturnHome: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  stats,
  onReturnHome,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'today'>('all');

  // Include user into leaderboard dynamically
  const userEntry = {
    id: 'user-me',
    rank: 4,
    name: 'أنت (اللاعب)',
    avatar: '😎',
    points: stats.totalPoints,
    wins: stats.wins,
    accuracy: stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 100,
    badgeTitle: stats.wins > 10 ? 'محقق أسطوري' : 'محقق ذكي',
    isUser: true,
  };

  const allEntries = [...INITIAL_LEADERBOARD, userEntry].sort((a, b) => b.points - a.points);
  const rankedEntries = allEntries.map((e, idx) => ({ ...e, rank: idx + 1 }));

  const topThree = rankedEntries.slice(0, 3);
  const restEntries = rankedEntries.slice(3);

  return (
    <div className="w-full max-w-md mx-auto my-3 px-3">
      <div className="bg-[#0A192F] rounded-[36px] border-4 border-[#172A45] shadow-2xl p-5 flex flex-col gap-4 text-right">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-blue-900/50 pb-3">
          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#112240] text-blue-200 hover:bg-[#172A45] transition cursor-pointer border border-blue-800/60"
          >
            <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
            <span>رجوع</span>
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
              لوحة المتصدرين
            </h2>
            <span className="w-2 h-6 bg-yellow-400 rounded-full" />
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex bg-[#112240] p-1 rounded-2xl border border-blue-900/60">
          {[
            { id: 'all', label: 'الأفضل' },
            { id: 'weekly', label: 'الأسبوع' },
            { id: 'today', label: 'اليوم' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeFilter(tab.id as any)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                timeFilter === tab.id
                  ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811] shadow-md'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-1">
          
          {/* #2 Silver */}
          {topThree[1] && (
            <div className="bg-[#112240] border border-blue-800/80 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative">
              <span className="absolute -top-3 w-6 h-6 rounded-full bg-slate-300 text-[#050811] font-black text-xs flex items-center justify-center border border-slate-200">
                2
              </span>
              <span className="text-2xl mt-1 mb-1">{topThree[1].avatar}</span>
              <span className="text-xs font-bold text-blue-100 truncate w-full">{topThree[1].name}</span>
              <span className="text-[10px] text-yellow-400 font-extrabold mt-1">{topThree[1].points} نقطة</span>
            </div>
          )}

          {/* #1 Gold */}
          {topThree[0] && (
            <div className="bg-gradient-to-b from-[#172A45] to-[#112240] border-2 border-yellow-400 rounded-2xl p-3 flex flex-col items-center text-center shadow-xl relative scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <div className="absolute -top-4 w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-[#050811] font-black text-sm flex items-center justify-center border border-yellow-200">
                <Crown className="w-4 h-4 fill-[#050811]" />
              </div>
              <span className="text-3xl mt-2 mb-1">{topThree[0].avatar}</span>
              <span className="text-xs font-black text-yellow-300 truncate w-full">{topThree[0].name}</span>
              <span className="text-[11px] text-yellow-400 font-black mt-1">{topThree[0].points} نقطة</span>
            </div>
          )}

          {/* #3 Bronze */}
          {topThree[2] && (
            <div className="bg-[#112240] border border-yellow-800/40 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative">
              <span className="absolute -top-3 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center border border-amber-600">
                3
              </span>
              <span className="text-2xl mt-1 mb-1">{topThree[2].avatar}</span>
              <span className="text-xs font-bold text-blue-100 truncate w-full">{topThree[2].name}</span>
              <span className="text-[10px] text-yellow-400 font-extrabold mt-1">{topThree[2].points} نقطة</span>
            </div>
          )}

        </div>

        {/* Leaderboard Table / Cards */}
        <div className="space-y-2">
          {restEntries.map((player) => (
            <div
              key={player.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                player.isUser
                  ? 'bg-yellow-500/15 border-yellow-500/50 shadow-md shadow-yellow-500/10'
                  : 'bg-[#112240]/60 border-blue-900/40 hover:border-blue-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                  player.isUser
                    ? 'bg-yellow-500 text-[#050811]'
                    : 'bg-[#172A45] text-blue-300'
                }`}>
                  {player.rank}
                </span>

                <span className="text-xl">{player.avatar}</span>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${player.isUser ? 'text-yellow-300' : 'text-blue-100'}`}>
                      {player.name}
                    </span>
                    {player.isUser && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-yellow-500/30 text-yellow-300 font-bold">
                        أنت
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-blue-400/80 block">{player.badgeTitle}</span>
                </div>
              </div>

              <div className="text-left font-mono">
                <span className="text-xs font-black text-yellow-400 block">{player.points.toLocaleString('ar-EG')}</span>
                <span className="text-[10px] text-blue-400 block">{player.wins} فوز</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer User Rank Summary */}
        <div className="mt-2 pt-3 border-t border-blue-900/50 text-center text-xs text-blue-300">
          مركزك الحالي: <span className="font-bold text-yellow-400">#{rankedEntries.find(e => e.isUser)?.rank || 4}</span> ({stats.totalPoints.toLocaleString('ar-EG')} نقطة)
        </div>

      </div>
    </div>
  );
};
