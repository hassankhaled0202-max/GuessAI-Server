import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Share2, Sparkles, BookOpen, Clock, Globe, Target, Flame } from 'lucide-react';
import { Character } from '../types';

interface VictoryModalProps {
  isOpen: boolean;
  isVictory: boolean;
  character: Character | null;
  questionsUsed: number;
  maxQuestions: number;
  earnedPoints: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  isVictory,
  character,
  questionsUsed,
  maxQuestions,
  earnedPoints,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (isOpen && isVictory) {
      // انفجار الاحتفال الأساسي
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#00BFFF', '#FF4500', '#32CD32'],
      });

      // مدافع جانبية بعد جزء من الثانية
      const timer = setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: ['#FFD700', '#FFA500'] });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: ['#FFD700', '#00BFFF'] });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isVictory]);

  if (!isOpen || !character) return null;

  const shareText = `لقد ${isVictory ? 'تغلبت على' : 'جربت'} لعبة GuessAI وكشفت الشخصية الغامضة "${character.name}" في ${questionsUsed} سؤال فقط! 🎯✨`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GuessAI - خمن الشخصية',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('تم نسخ النتيجة بنجاح!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050811]/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm bg-[#0A192F] border-4 border-[#172A45] rounded-[36px] p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-right relative overflow-hidden flex flex-col items-center">
        
        {/* خلفية مضيئة */}
        <div className={`absolute top-0 inset-x-0 h-40 ${isVictory ? 'bg-gradient-to-b from-yellow-500/20 to-transparent' : 'bg-gradient-to-b from-rose-500/15 to-transparent'} blur-2xl -z-10`} />

        {/* الأيقونة العلوية (الكأس أو الكتاب) */}
        <div className="mb-3 relative">
          {isVictory ? (
            <>
              <div className="absolute inset-0 bg-yellow-500/40 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] via-[#FFA500] to-[#B8860B] flex items-center justify-center shadow-lg border-4 border-yellow-200 z-10">
                <Trophy className="w-10 h-10 text-[#050811]" />
              </div>
            </>
          ) : (
            <div className="relative w-20 h-20 rounded-full bg-[#112240] border-4 border-rose-900/60 flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-rose-400" />
            </div>
          )}
        </div>

        <h2 className={`text-3xl font-black mb-1 ${isVictory ? 'text-white' : 'text-rose-100'}`}>
          {isVictory ? '🎉 مبروك! فوز ساحق!' : '🍀 حظ أوفر!'}
        </h2>
        
        <p className="text-xs text-blue-200/80 font-bold mb-5 text-center px-4">
          {isVictory
            ? `لقد نجحت في كشف الهوية السرية لـ "${character.name}" ببراعة.`
            : `الشخصية السرية كانت "${character.name}". لا تستسلم، حاول مرة أخرى!`}
        </p>

        {/* كارت تحليل الأداء */}
        <div className="w-full bg-[#112240] border border-blue-800/60 rounded-2xl p-4 mb-4 text-right shadow-md">
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-3 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
              <Target className="w-4 h-4 text-yellow-400" />
              <span>أداء الجولة</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
              isVictory ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {isVictory ? (questionsUsed <= 5 ? '⚡ عبقري' : questionsUsed <= 10 ? '🎯 محقق' : '🔥 صبور') : '🛡️ مستكشف'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-blue-100 font-bold">
              <span>الأسئلة المستهلكة:</span>
              <span>{questionsUsed} / {maxQuestions}</span>
            </div>
            {/* شريط تقدم للأسئلة المستهلكة */}
            <div className="w-full h-2 bg-[#0A192F] rounded-full overflow-hidden border border-blue-900/50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isVictory ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${(questionsUsed / Math.max(1, maxQuestions)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* كارت معلومات الشخصية */}
        <div className="w-full bg-gradient-to-b from-[#172A45] to-[#112240] border border-blue-700/40 rounded-2xl p-4 mb-5 text-right shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/5 blur-2xl rounded-full" />
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded text-blue-200 bg-blue-900/50">
              {character.category}
            </span>
            <span className="text-sm font-black text-yellow-400">
              {character.name}
            </span>
          </div>

          <p className="text-xs font-bold text-white mb-2">{character.title}</p>
          <p className="text-[11px] text-blue-200/90 leading-relaxed mb-3 line-clamp-2">
            {character.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-blue-300 pt-3 border-t border-blue-800/50">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{character.era}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{character.region}</span>
            </div>
          </div>
        </div>

        {/* شريط النقاط (يظهر في حالة الفوز فقط) */}
        {isVictory && (
          <div className="w-full bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border border-yellow-500/40 rounded-xl py-3 px-4 flex items-center justify-between mb-5 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <div className="flex items-center gap-2 text-xs font-extrabold text-yellow-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>النقاط المكتسبة:</span>
            </div>
            <span className="text-xl font-black text-white">+{earnedPoints}</span>
          </div>
        )}

        {/* أزرار التحكم */}
        <div className="w-full flex gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-b from-yellow-400 to-amber-600 text-[#050811] font-black text-sm shadow-lg shadow-yellow-500/20 hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4.5 h-4.5" />
            <span>العب جولة جديدة</span>
          </button>

          <button
            onClick={handleShare}
            className="w-14 rounded-xl bg-[#172A45] hover:bg-[#1f375a] text-blue-200 border border-blue-700/50 transition active:scale-95 flex items-center justify-center shadow-md"
            title="مشاركة النتيجة"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};