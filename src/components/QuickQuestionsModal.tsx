import React, { useState } from 'react';
import { X, HelpCircle, MessageSquarePlus, Sparkles } from 'lucide-react';
import { QUICK_QUESTIONS } from '../data/quickQuestions';

interface QuickQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (questionText: string) => void;
}

export const QuickQuestionsModal: React.FC<QuickQuestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
}) => {
  if (!isOpen) return null;

  const categories = Array.from(new Set(QUICK_QUESTIONS.map((q) => q.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');

  const filteredQuestions = QUICK_QUESTIONS.filter(
    (q) => q.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A192F] border-4 border-[#172A45] rounded-t-3xl sm:rounded-[32px] p-5 shadow-2xl text-right max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/50">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#112240] text-blue-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-yellow-400 text-base">أسئلة شائعة وسريعة</span>
            <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
          </div>
        </div>

        <p className="text-xs text-blue-200 my-2.5">
          اختر أي سؤال جاهز لطرحه فوراً دون حاجة للكتابة:
        </p>

        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-sm'
                  : 'bg-[#112240] text-blue-300 border-blue-900/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar my-1">
          {filteredQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                onSelectQuestion(q.text);
                onClose();
              }}
              className="w-full text-right p-3 rounded-xl bg-[#112240] hover:bg-[#172A45] border border-blue-900/60 hover:border-yellow-500/40 text-blue-100 text-xs font-medium transition-all active:scale-[0.99] flex items-center justify-between gap-2 cursor-pointer group"
            >
              <span className="leading-relaxed">{q.text}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:text-yellow-400 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        {/* Bottom Close */}
        <div className="pt-3 border-t border-blue-900/50 mt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#112240] hover:bg-[#172A45] text-blue-200 font-bold text-xs border border-blue-800/60 transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
