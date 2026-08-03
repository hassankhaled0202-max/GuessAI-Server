import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, HelpCircle, Sparkles, Lightbulb, CheckCircle2, MessageSquarePlus, Eye, ArrowRight, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { Character, ChatMessage } from '../types';
import { MAX_QUESTIONS } from '../constants/game';
import { askAiQuestion, askAiHint, verifyGuess } from '../utils/aiEngine';
import { playSound } from '../utils/soundEffects';

interface GameScreenProps {
  character: Character;
  onGameEnd: (isWin: boolean, questionsUsed: number, points: number) => void;
  onOpenGuessModal: () => void;
  onOpenQuickQuestions: () => void;
  soundEnabled: boolean;
  onReturnHome: () => void;
  userGuessAttempt?: string | null;
  clearUserGuessAttempt?: () => void;
  onGuessStart?: () => void;
  onGuessEnd?: () => void;
  isGameOver?: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  character,
  onGameEnd,
  onOpenGuessModal,
  onOpenQuickQuestions,
  soundEnabled,
  onReturnHome,
  userGuessAttempt,
  clearUserGuessAttempt,
  onGuessStart,
  onGuessEnd,
  isGameOver = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(MAX_QUESTIONS);
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [hasShownExhaustedMessage, setHasShownExhaustedMessage] = useState(false);

  const questionsUsed = MAX_QUESTIONS - questionsLeft;
  const inputDisabled = questionsLeft <= 0 || isLoadingAi || isGameOver;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    setSpeechSupported(true);
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInputQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoiceInput = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || inputDisabled) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [isListening, inputDisabled]);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'init-1',
      sender: 'ai',
      text: `مرحباً بك في GuessAI! لقد اخترت شخصية تاريخية في سِرّي. لديك ${MAX_QUESTIONS} أسئلة كحد أقصى للتخمين. يمكنك كتابة أسئلتك أو الاستعانة بالأزرار السريعة.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      type: 'system_info',
    };
    setMessages([welcomeMessage]);
  }, [character]);

  // Notify player when questions are exhausted
  useEffect(() => {
    if (questionsLeft <= 0 && !hasShownExhaustedMessage && !isGameOver) {
      setHasShownExhaustedMessage(true);
      const exhaustedMsg: ChatMessage = {
        id: `exhausted-${Date.now()}`,
        sender: 'system',
        text: '⏳ انتهت أسئلتك! حان وقت التخمين — اضغط على زر «تخمين الشخصية» الآن لكشف هويتك.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        type: 'system_info',
      };
      setMessages((prev) => [...prev, exhaustedMsg]);
    }
  }, [questionsLeft, hasShownExhaustedMessage, isGameOver]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingAi]);

  // Handle guess submitted from modal
  useEffect(() => {
    if (userGuessAttempt) {
      handleCheckGuess(userGuessAttempt);
      if (clearUserGuessAttempt) clearUserGuessAttempt();
    }
  }, [userGuessAttempt]);

  // Handle quick question event
  useEffect(() => {
    const handleQuickQuestion = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleSendQuestion(customEvent.detail);
      }
    };

    window.addEventListener('quick_question_selected', handleQuickQuestion);
    return () => {
      window.removeEventListener('quick_question_selected', handleQuickQuestion);
    };
  }, [questionsLeft, isLoadingAi, character, isGameOver]);

  // Send a user question
  const handleSendQuestion = async (qText?: string) => {
    const textToSend = qText || inputQuestion;
    if (!textToSend.trim() || inputDisabled) return;

    playSound('question', soundEnabled);

    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: timeStr,
      type: 'question',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoadingAi(true);
    setQuestionsLeft((prev) => prev - 1);

    try {
      const aiResponseText = await askAiQuestion(character, textToSend.trim());
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        type: 'answer',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.',
        timestamp: timeStr,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Check character guess
  const handleCheckGuess = async (guessName: string) => {
    if (isGameOver) return;

    onGuessStart?.();
    setIsLoadingAi(true);

    try {
      const result = await verifyGuess(character, guessName);

      if (result.isCorrect) {
        playSound('victory', soundEnabled);
        const calculatedPoints = Math.max(100, 300 - questionsUsed * 10 - hintsUsedCount * 30);
        onGameEnd(true, questionsUsed, calculatedPoints);
      } else {
        playSound('defeat', soundEnabled);
        onGameEnd(false, questionsUsed, 0);
      }
    } finally {
      setIsLoadingAi(false);
      onGuessEnd?.();
    }
  };

  // Request AI Hint
  const handleRequestHint = async () => {
    if (hintsLeft <= 0 || isLoadingAi || isGameOver || questionsLeft <= 0) return;
    playSound('hint', soundEnabled);

    setIsLoadingAi(true);
    setHintsLeft((prev) => prev - 1);
    setHintsUsedCount((prev) => prev + 1);

    try {
      const generatedHint = await askAiHint(character, messages);

      const hintMsg: ChatMessage = {
        id: `hint-${Date.now()}`,
        sender: 'system',
        text: generatedHint,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        type: 'hint',
      };
      setMessages((prev) => [...prev, hintMsg]);
    } catch {
      const fallbackHintText = character.hints[hintsUsedCount % character.hints.length] || `الشخصية اشتهرت بـ: ${character.title}`;
      const fallbackMsg: ChatMessage = {
        id: `hint-${Date.now()}`,
        sender: 'system',
        text: fallbackHintText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        type: 'hint',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Give Up & Reveal
  const handleGiveUp = () => {
    if (isGameOver) return;
    if (confirm('هل أنت متأكد من الاستسلام وتود كشف الشخصية الآن؟')) {
      playSound('defeat', soundEnabled);
      onGameEnd(false, questionsUsed, 0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-2 flex flex-col h-[calc(100vh-75px)] bg-[#0A192F] border-4 border-[#172A45] rounded-[36px] text-right overflow-hidden relative shadow-2xl">
      
      {/* Top Game Bar */}
      <div className="bg-[#112240]/70 border-b border-blue-900/50 px-3.5 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnHome}
            className="p-1 rounded-lg bg-[#172A45] text-blue-200 hover:bg-[#1f375a] transition cursor-pointer"
            title="خروج"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-full text-yellow-400 font-extrabold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>شخصية غامضة</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestHint}
            disabled={hintsLeft <= 0 || questionsLeft <= 0 || isGameOver}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              hintsLeft > 0 && questionsLeft > 0 && !isGameOver
                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30'
                : 'bg-[#172A45] text-blue-400/50 border-blue-900 opacity-50'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            <span>تلميح ({hintsLeft})</span>
          </button>
        </div>
      </div>

      {/* Modern Question Progress Bar */}
      <div className="bg-[#0A192F] px-4 py-3 border-b border-blue-900/40 shadow-sm z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-blue-300">الأسئلة المتبقية</span>
          <span className={`text-[12px] font-extrabold ${questionsLeft <= 3 ? 'text-rose-400 animate-pulse' : 'text-yellow-400'}`}>
            {questionsLeft} / {MAX_QUESTIONS}
          </span>
        </div>
        <div className="w-full h-2 bg-[#172A45] rounded-full overflow-hidden border border-blue-900/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              questionsLeft <= 3 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(250,204,21,0.4)]'
            }`}
            style={{ width: `${(questionsLeft / MAX_QUESTIONS) * 100}%` }}
          />
        </div>
        {questionsLeft <= 0 && (
          <p className="text-center text-[10.5px] text-rose-300 font-bold mt-2.5 flex justify-center items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            انتهت الأسئلة! استخدم زر التخمين الآن.
          </p>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            if (msg.type === 'hint') {
              return (
                <div key={msg.id} className="flex justify-center my-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-w-[92%] px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed text-right bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 text-yellow-100 border border-yellow-500/40 shadow-lg shadow-yellow-500/10 flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center shrink-0 text-yellow-400 mt-0.5">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] font-extrabold text-yellow-400">💡 تلميح تحليلي من الذكاء الاصطناعي</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/30 text-yellow-200 font-bold">بناءً على الحوار</span>
                      </div>
                      <p className="text-yellow-100/90 leading-relaxed font-medium">
                        {msg.text.replace(/^💡\s*تلميح:\s*/, '').replace(/^تلميح ذكي:\s*/, '')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex justify-center my-1">
                <div className={`max-w-[90%] px-3.5 py-2 rounded-2xl text-xs font-semibold leading-relaxed text-center border shadow-sm ${
                  msg.type === 'guess_result'
                    ? 'bg-rose-500/15 text-rose-200 border-rose-500/30'
                    : msg.type === 'system_info' && questionsLeft <= 0
                      ? 'bg-amber-500/15 text-amber-200 border-amber-500/40'
                      : 'bg-[#112240] text-blue-200 border-blue-800/60'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? 'justify-start flex-row-reverse' : 'justify-start'}`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isUser
                  ? 'bg-[#172A45] text-yellow-400 border-blue-800'
                  : 'bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-[#050811] border-yellow-300/50 shadow-md'
              }`}>
                {isUser ? '👤' : <Sparkles className="w-4 h-4 stroke-[2.5]" />}
              </div>

              {/* Chat Bubble */}
              <div className={`max-w-[82%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed border shadow-md ${
                isUser
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white border-yellow-500/30 rounded-tl-none'
                  : 'bg-[#112240] text-blue-100 border-blue-900/60 rounded-tr-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="block text-[9px] text-blue-300/70 mt-1 text-left">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoadingAi && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center text-[#050811] border border-yellow-300">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl rounded-tr-none bg-[#112240] border border-blue-900/60 text-yellow-300 text-xs flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
              <span>جاري التفكير في السؤال...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Interaction Buttons Bar */}
      <div className="px-3 py-2 bg-[#050811]/90 border-t border-blue-900/50 grid grid-cols-3 gap-2">
        
        {/* Button 1: 'تخمين الشخصية' */}
        <button
          onClick={onOpenGuessModal}
          disabled={isGameOver}
          className={`py-2.5 px-2 rounded-xl font-bold text-xs shadow-md active:scale-98 transition cursor-pointer flex items-center justify-center gap-1 col-span-3 ${
            questionsLeft <= 0 && !isGameOver
              ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/20 border-2 border-yellow-400/60 text-yellow-300 animate-pulse hover:from-yellow-500/40'
              : 'bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20'
          } disabled:opacity-40`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تخمين الشخصية</span>
        </button>

        {/* Button 2: 'أسئلة شائعة' */}
        <button
          onClick={onOpenQuickQuestions}
          disabled={inputDisabled}
          className="py-2.5 px-2 rounded-xl bg-blue-500/10 border border-blue-500/40 text-blue-300 font-bold text-xs transition hover:bg-blue-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>أسئلة شائعة</span>
        </button>

        {/* Button 3: 'كشف / استسلام' */}
        <button
          onClick={handleGiveUp}
          disabled={isGameOver}
          className="py-2.5 px-2 rounded-xl bg-[#112240] hover:bg-rose-950/60 text-blue-300 hover:text-rose-300 font-bold text-xs border border-blue-800/60 transition active:scale-98 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>كشف السر</span>
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#050811] border-t border-blue-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder={
              isGameOver
                ? 'انتهت الجولة'
                : questionsLeft > 0
                  ? 'اكتب سؤالك هنا...'
                  : 'انتهت الأسئلة — استخدم زر «تخمين الشخصية»'
            }
            disabled={inputDisabled}
            className="flex-1 py-3 px-4 rounded-xl bg-[#112240] border border-white/10 focus:border-yellow-500/50 text-white text-xs font-medium outline-none transition placeholder:text-blue-300/50 text-right"
          />

          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={inputDisabled}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                  : 'bg-[#112240] border-white/10 text-blue-300 hover:border-yellow-500/40 hover:text-yellow-400'
              } disabled:opacity-40`}
              title={isListening ? 'إيقاف الاستماع' : 'تحدث بالعربية'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={!inputQuestion.trim() || inputDisabled}
            className="w-11 h-11 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811] font-bold flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition disabled:opacity-40 cursor-pointer shrink-0"
            title="إرسال"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </form>
      </div>

    </div>
  );
};