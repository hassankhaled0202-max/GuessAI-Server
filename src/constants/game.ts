import { CHARACTERS, Character } from './characters';

// دالة لاختيار شخصية عشوائية بناءً على مستوى الصعوبة
export function getRandomCharacter(difficulty?: 'easy' | 'medium' | 'hard'): Character {
  let filtered = CHARACTERS;
  
  if (difficulty) {
    filtered = CHARACTERS.filter(c => c.difficulty === difficulty);
    // لو المستوى مش موجود لأي سبب، نرجع للقائمة كلها كاحتياطي
    if (filtered.length === 0) {
      filtered = CHARACTERS;
    }
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// أقصى عدد للأسئلة في الجولة
export const MAX_QUESTIONS = 15;