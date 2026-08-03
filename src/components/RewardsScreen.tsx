import React from 'react';
import { Award, Star, Lock, CheckCircle2, Flame, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { Achievement, GameStats } from '../types';

interface RewardsScreenProps {
  achievements: Achievement[];
  stats: GameStats;
  onReturnHome: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  achievements,
  stats,
  onReturnHome,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Level calculation
  const level = Math.floor(stats.totalPoints / 250) + 1;
  const levelTitles = ['مبتدئ الألغاز', 'باحث الذكاء', 'محقق خبير', 'حافظ التاريخ', 'أسطورة GuessAI'];
  const currentTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

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
              الجوائز والأوسمة
            </h2>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-[#112240] border border-yellow-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811]">
              مستوى {level}
            </span>
            <span className="text-sm font-black text-yellow-400">{currentTitle}</span>
          </div>

          <div className="w-full bg-[#0A192F] rounded-full h-3 border border-blue-900 p-0.5 my-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, ((stats.totalPoints % 250) / 250) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-blue-200">
            <span>{stats.totalPoints} / {level * 250} نقطة للمستوى القادم</span>
            <span className="text-yellow-400 font-bold">{unlockedCount}/{achievements.length} أوسمة</span>
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="bg-[#112240]/80 border border-blue-900/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md">
          <div className="w-11 h-11 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-extrabold text-yellow-400">تحدي اليوم الغامض</span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-yellow-500/20 text-yellow-300 font-extrabold">+150 نقطة</span>
            </div>
            <p className="text-[11px] text-blue-200 leading-relaxed">
              خمن شخصية من قسم "علماء ومفكرون" في أقل من 7 أسئلة!
            </p>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-yellow-400 border-r-2 border-yellow-400 pr-2">
            قائمة الأوسمة والمكافآت
          </h3>

          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                ach.unlocked
                  ? 'bg-[#112240] border-yellow-500/40 shadow-md'
                  : 'bg-[#112240]/40 border-blue-900/40 opacity-70'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#0A192F] border border-blue-900 flex items-center justify-center text-xl shrink-0 shadow-inner">
                {ach.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-blue-100">{ach.title}</span>
                  <span className="text-[11px] font-bold text-yellow-400">+{ach.rewardPoints} نقطة</span>
                </div>
                
                <p className="text-[11px] text-blue-300/80 leading-relaxed mb-1.5">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-[#0A192F] rounded-full h-1.5 overflow-hidden border border-blue-900/50">
                  <div
                    className={`h-full rounded-full ${ach.unlocked ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-blue-900'}`}
                    style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0">
                {ach.unlocked ? (
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#172A45] text-blue-400/50 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
