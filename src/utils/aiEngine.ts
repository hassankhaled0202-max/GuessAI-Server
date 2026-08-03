import { Character, GameStats, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievementsData';
import { isGuessCorrect } from './guessUtils';

// API Fetch helper
export async function askAiQuestion(character: Character, question: string): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, question }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return data.answer || 'عذراً، لم أتمكن من الإجابة حالياً. حاول إعادة صياغة سؤالك.';
  } catch (err) {
    console.warn('API error, using local fallback:', err);
    return getClientLocalFallback(character, question);
  }
}

export async function askAiHint(character: Character, conversation: any[]): Promise<string> {
  try {
    const res = await fetch('/api/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, conversation }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.hint) {
        return data.hint;
      }
    }
  } catch (err) {
    console.warn('API hint error, using client fallback:', err);
  }

  // Client fallback
  const hints = character.hints || [];
  if (hints.length > 0) {
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    return randomHint;
  }
  return `تنتمي هذه الشخصية إلى (${character.region}) واشتهرت بـ (${character.title}).`;
}

export async function verifyGuess(character: Character, guess: string): Promise<{ isCorrect: boolean; characterName: string; title: string; description: string }> {
  try {
    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character, guess }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Guess verification fallback:', e);
  }

  // Client fallback guess check
  const isMatch = isGuessCorrect(guess, character.acceptedNames ?? [character.name]);

  return {
    isCorrect: isMatch,
    characterName: character.name,
    title: character.title,
    description: character.description,
  };
}

function getClientLocalFallback(character: Character, question: string): string {
  const q = question.toLowerCase();
  const attrs = (character.attributes || {}) as Record<string, any>;

  if (q.includes('حي') || q.includes('قيد الحياة')) {
    return character.isAlive ? 'نعم، الشخصية لا تزال حية.' : 'لا، لقد رحلت الشخصية منذ زمن.';
  }
  if (q.includes('أنثى') || q.includes('امرأة')) {
    return character.gender === 'female' ? 'نعم، إنها سيدة ملهمة.' : 'لا، الشخصية رجل.';
  }
  if (q.includes('عربي') || q.includes('شرق أوسط')) {
    return character.keywords?.some(k => k.includes('عربي') || k.includes('مصر') || k.includes('عباسي')) ? 'نعم، تنتمي لمنطقتنا العربية.' : 'لا، لست عربياً.';
  }
  if (q.includes('طبيب') || q.includes('عالم') || q.includes('فيزياء') || q.includes('رياضيات')) {
    const prof = attrs.profession || 'عالم ومفكر';
    return character.category === 'scientists' ? `نعم، أنا ${prof}.` : 'لا، لست عالماً ولا طبيباً.';
  }
  if (q.includes('ملك') || q.includes('قائد') || q.includes('حاكم')) {
    return character.category === 'leaders' ? 'نعم، قدت الجيوش وشعوباً عريقة.' : 'لا، لم أكن حاكماً.';
  }
  if (q.includes('شاعر') || q.includes('أديب') || q.includes('كتاب')) {
    return character.category === 'poets' ? 'نعم، كلماتي وأشعاري خلّدت في كتب التاريخ.' : 'لا، لست شعاراً.';
  }
  if (character.hints && character.hints.length > 0) {
    return `ملاحظة ذكية! إليك هذا المؤشر: ${character.hints[0]}`;
  }
  return 'سؤال جيد! حاول السؤال عن حقبته التاريخية أو مكان ولادته أو أكبر إنجازاته.';
}

// Local Storage Managers
const STATS_KEY = 'guessai_stats_v1';
const ACHIEVEMENTS_KEY = 'guessai_achievements_v1';
const SOUND_KEY = 'guessai_sound_pref';

export function getStoredStats(): GameStats {
  if (typeof window === 'undefined') return { gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0, totalPoints: 120, hintsUsed: 0, questionsAskedCount: 0 };
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return { gamesPlayed: 0, wins: 0, currentStreak: 0, bestStreak: 0, totalPoints: 120, hintsUsed: 0, questionsAskedCount: 0 };
}

export function saveStoredStats(stats: GameStats) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
}

export function getStoredAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}

export function getSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(SOUND_KEY);
  return val !== 'false';
}

export function setSoundPreference(enabled: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOUND_KEY, String(enabled));
  }
}
