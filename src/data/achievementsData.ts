import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'أول انتصار 🎯',
    description: 'تمكن من تخمين أول شخصية تاريخية بنجاح.',
    icon: '🏆',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rewardPoints: 100,
    unlockedAt: 'مكتمل'
  },
  {
    id: 'quick_thinker',
    title: 'سريع البديهة ⚡',
    description: 'خمن الشخصية الصحيحة في أقل من 5 أسئلة.',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardPoints: 250
  },
  {
    id: 'history_buff',
    title: 'حافظ التاريخ 📚',
    description: 'فز في 5 جولات في قسم القادة والشخصيات التاريخية.',
    icon: '⚔️',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rewardPoints: 300
  },
  {
    id: 'science_genius',
    title: 'صديق العلماء 🔬',
    description: 'خمن 3 شخصيات من قسم العلماء والمخترعين.',
    icon: '🧪',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rewardPoints: 200
  },
  {
    id: 'no_hints',
    title: 'عبقري بلا تلميح 🧠',
    description: 'فز بالجولة دون استخدام أي تلميح إضافي.',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rewardPoints: 150
  },
  {
    id: 'streak_master',
    title: 'ملك الانتصارات المتتالية 🔥',
    description: 'حقق سلسلة 3 انتصارات متتالية بدون أي خسارة.',
    icon: '🔥',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rewardPoints: 500
  }
];
