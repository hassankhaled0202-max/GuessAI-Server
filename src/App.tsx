import React, { useState, useEffect } from 'react';
import { ScreenType, CharacterCategory, DifficultyLevel, Character, GameStats, Achievement } from './types';
import { getRandomCharacter } from './data/characters';
import { MAX_QUESTIONS } from './constants/game';
import { getStoredStats, saveStoredStats, getStoredAchievements, saveStoredAchievements, getSoundPreference, setSoundPreference } from './utils/aiEngine';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { RewardsScreen } from './components/RewardsScreen';
import { GuessModal } from './components/GuessModal';
import { QuickQuestionsModal } from './components/QuickQuestionsModal';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('home');
  const [category, setCategory] = useState<CharacterCategory>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  // Game active state
  const [currentCharacter, setCurrentCharacter] = useState<Character>(() => getRandomCharacter('all', 'medium'));
  const [gameSessionKey, setGameSessionKey] = useState(0);
  const [isGuessSubmitting, setIsGuessSubmitting] = useState(false);
  
  // Modals
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isQuickQuestionsOpen, setIsQuickQuestionsOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  
  // Game End State
  const [lastGameVictory, setLastGameVictory] = useState(false);
  const [lastQuestionsUsed, setLastQuestionsUsed] = useState(0);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);

  // Player Guess Attempt passed to GameScreen
  const [pendingGuessAttempt, setPendingGuessAttempt] = useState<string | null>(null);

  // Stats & Achievements
  const [stats, setStats] = useState<GameStats>(() => getStoredStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getStoredAchievements());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getSoundPreference());

  // Save changes to localStorage
  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  useEffect(() => {
    saveStoredAchievements(achievements);
  }, [achievements]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setSoundPreference(next);
  };

  // Start a new game round
  const handleStartGame = () => {
    const nextChar = getRandomCharacter(category, difficulty);
    setCurrentCharacter(nextChar);
    setPendingGuessAttempt(null);
    setIsVictoryModalOpen(false);
    setIsGuessSubmitting(false);
    setGameSessionKey((k) => k + 1);
    setScreen('game');
  };

  // Handle game conclusion
  const handleGameEnd = (isWin: boolean, questionsUsed: number, points: number) => {
    setLastGameVictory(isWin);
    setLastQuestionsUsed(questionsUsed);
    setLastEarnedPoints(points);

    // Update Stats
    setStats((prev) => {
      const nextWins = isWin ? prev.wins + 1 : prev.wins;
      const nextStreak = isWin ? prev.currentStreak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);
      const nextTotalPoints = prev.totalPoints + (isWin ? points : 10);

      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: nextWins,
        currentStreak: nextStreak,
        bestStreak: nextBestStreak,
        totalPoints: nextTotalPoints,
      };
    });

    // Check achievement unlocks
    if (isWin) {
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'first_win' && !ach.unlocked) {
            return { ...ach, unlocked: true, progress: 1 };
          }
          if (ach.id === 'quick_thinker' && questionsUsed <= 5 && !ach.unlocked) {
            return { ...ach, unlocked: true, progress: 1 };
          }
          if (ach.id === 'streak_master' && !ach.unlocked && stats.currentStreak + 1 >= 3) {
            return { ...ach, unlocked: true, progress: 3 };
          }
          return ach;
        })
      );
    }

    setIsVictoryModalOpen(true);
  };

  // Submit guess from modal
  const handleModalGuessSubmit = (guessText: string) => {
    setIsGuessModalOpen(false);
    setPendingGuessAttempt(guessText);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header */}
      <Header
        currentScreen={screen}
        setScreen={setScreen}
        points={stats.totalPoints}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center">
        {screen === 'home' && (
          <HomeScreen
            setScreen={setScreen}
            selectedCategory={category}
            setSelectedCategory={setCategory}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            stats={stats}
            onStartGame={handleStartGame}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            key={gameSessionKey}
            character={currentCharacter}
            onGameEnd={handleGameEnd}
            onOpenGuessModal={() => setIsGuessModalOpen(true)}
            onOpenQuickQuestions={() => setIsQuickQuestionsOpen(true)}
            soundEnabled={soundEnabled}
            onReturnHome={() => setScreen('home')}
            userGuessAttempt={pendingGuessAttempt}
            clearUserGuessAttempt={() => setPendingGuessAttempt(null)}
            onGuessStart={() => setIsGuessSubmitting(true)}
            onGuessEnd={() => setIsGuessSubmitting(false)}
            isGameOver={isVictoryModalOpen}
          />
        )}

        {screen === 'leaderboard' && (
          <LeaderboardScreen
            stats={stats}
            onReturnHome={() => setScreen('home')}
          />
        )}

        {screen === 'rewards' && (
          <RewardsScreen
            achievements={achievements}
            stats={stats}
            onReturnHome={() => setScreen('home')}
          />
        )}
      </main>

      {/* Guess Character Modal */}
      <GuessModal
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onSubmitGuess={handleModalGuessSubmit}
        isSubmitting={isGuessSubmitting}
      />

      {/* Quick Questions Modal */}
      <QuickQuestionsModal
        isOpen={isQuickQuestionsOpen}
        onClose={() => setIsQuickQuestionsOpen(false)}
        onSelectQuestion={(qText) => {
          setPendingGuessAttempt(null);
          // Directly pass quick question to GameScreen by simulating input
          const event = new CustomEvent('quick_question_selected', { detail: qText });
          window.dispatchEvent(event);
        }}
      />

      {/* Victory / Game End Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        isVictory={lastGameVictory}
        character={currentCharacter}
        questionsUsed={lastQuestionsUsed}
        maxQuestions={MAX_QUESTIONS}
        earnedPoints={lastEarnedPoints}
        onPlayAgain={handleStartGame}
        onClose={() => {
          setIsVictoryModalOpen(false);
          setScreen('home');
        }}
      />

    </div>
  );
}