export type ScreenType = 'home' | 'game' | 'leaderboard' | 'rewards';

export type CharacterTopic = 'historical' | 'scientists' | 'leaders' | 'poets' | 'islamic' | 'world' | 'art' | 'sports';

export type CharacterCategory = 'all' | CharacterTopic;

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Character {
  id: string;
  name: string;
  acceptedNames: string[];
  title: string;
  category: CharacterTopic;
  difficulty: DifficultyLevel;
  era: string; // e.g. "القرن التاسع الميلادي"
  region: string; // e.g. "الشرق الأوسط / العباسي"
  description: string;
  isAlive: boolean;
  gender: 'male' | 'female';
  hints: string[];
  keywords: string[]; // For mock matcher
  attributes: {
    profession: string;
    nationality: string;
    famousFor: string;
    nobelPrize?: boolean;
    writtenBooks?: boolean;
    rulerOrKing?: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'system' | 'ai';
  text: string;
  timestamp: string;
  type?: 'question' | 'answer' | 'hint' | 'guess_result' | 'system_info';
  isCorrectGuess?: boolean;
}

export interface QuickQuestion {
  id: string;
  category: string;
  text: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  wins: number;
  accuracy: number; // e.g. 92%
  badgeTitle: string;
  isUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rewardPoints: number;
  unlockedAt?: string;
}

export interface GameStats {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
  hintsUsed: number;
  questionsAskedCount: number;
}
