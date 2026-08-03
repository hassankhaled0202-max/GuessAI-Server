// تطبيع النص العربي لإزالة التشابه والهمزات والمسافات الزائدة
export function normalizeArabicForComparison(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[\sإأآا]/g, '') // إزالة المسافات وكل أنواع الألفات
    .replace(/ة/g, 'ه')     // توحيد التاء المربوطة والهاء
    .replace(/ى/g, 'ي')     // توحيد الالف اللينة والياء
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
}

// دالة التحقق من صحة تخمين اللاعب مع دعم الأسماء البديلة والقبول المرن
export function isGuessCorrect(guess: string, acceptedNames: string[]): boolean {
  if (!guess || !acceptedNames || acceptedNames.length === 0) return false;
  
  const cleanGuess = normalizeArabicForComparison(guess);
  
  return acceptedNames.some(validName => {
    const cleanValid = normalizeArabicForComparison(validName);
    return cleanGuess === cleanValid;
  });
}