import React, { useState } from 'react';
import { X, CheckCircle2, Search, HelpCircle, Sparkles } from 'lucide-react';
import { CHARACTERS } from '../data/characters';

interface GuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGuess: (guessText: string) => void;
  isSubmitting: boolean;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  isOpen,
  onClose,
  onSubmitGuess,
  isSubmitting,
}) => {
  const [guessInput, setGuessInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGuessInput(val);

    if (val.trim().length > 0) {
      const filtered = CHARACTERS.filter((c) =>
        c.name.includes(val.trim()) || c.title.includes(val.trim())
      ).map((c) => c.name);
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setGuessInput(name);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim()) {
      onSubmitGuess(guessInput.trim());
      setGuessInput('');
      setSuggestions([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0A192F] border-4 border-[#172A45] rounded-[32px] p-5 shadow-2xl text-right">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#112240] text-blue-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-yellow-400 text-base">تخمين الشخصية النهائية</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        <p className="text-xs text-blue-200 my-3 leading-relaxed">
          هل عرفت هويت الشخصية الغامضة؟ اكتب اسم الشخصية بالكامل لتأكيد إجابتك:
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={guessInput}
              onChange={handleInputChange}
              placeholder="مثال: ابن سينا، صلاح الدين الأيوبي..."
              className="w-full py-3 px-4 rounded-xl bg-[#112240] border border-white/10 focus:border-yellow-500/50 text-white text-xs font-medium outline-none transition placeholder:text-blue-300/50 text-right"
              autoFocus
            />

            {/* Suggestions drop */}
            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-[#112240] border border-blue-900 rounded-xl overflow-hidden shadow-xl z-20">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleSelectSuggestion(name)}
                    className="w-full text-right px-4 py-2 text-xs font-bold text-yellow-400 hover:bg-[#172A45] border-b border-blue-900/50 last:border-0 transition cursor-pointer"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={!guessInput.trim() || isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 text-[#050811] font-bold text-xs shadow-md hover:brightness-110 active:scale-98 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تأكيد التخمين</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-[#112240] hover:bg-[#172A45] text-blue-200 font-bold text-xs transition border border-blue-800/60 cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
