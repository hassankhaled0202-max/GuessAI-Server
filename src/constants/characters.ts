export interface Character {
    id: string;
    name: string;
    acceptedNames: string[];
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    description: string;
  }
  
  export const CHARACTERS: Character[] = [
    // المستوى السهل (Easy)
    {
      id: 'einstein',
      name: 'ألبرت أينشتاين',
      acceptedNames: ['ألبرت أينشتاين', 'أينشتاين', 'انشتاين', 'البرت انشتاين'],
      category: 'علوم',
      difficulty: 'easy',
      description: 'عالم وفيزيائي شهير صاحب النظرية النسبية.'
    },
    {
      id: 'salah',
      name: 'صلاح الدين الأيوبي',
      acceptedNames: ['صلاح الدين الأيوبي', 'صلاح الدين', 'الايوبي'],
      category: 'تاريخ',
      difficulty: 'easy',
      description: 'قائد إسلامي أسس الدولة الأيوبية وقاد المسلمين في معركة حطين.'
    },
    {
      id: 'vinci',
      name: 'ليوناردو دافنشي',
      acceptedNames: ['ليوناردو دافنشي', 'ليوناردو دافينشي', 'دافنشي', 'دافينشي'],
      category: 'فن',
      difficulty: 'easy',
      description: 'رسام وفنان عالمي رسم لوحة الموناليزا.'
    },
  
    // المستوى المتوسط (Medium)
    {
      id: 'ibn_sina',
      name: 'ابن سينا',
      acceptedNames: ['ابن سينا', 'الشيخ الرئيس'],
      category: 'علوم',
      difficulty: 'medium',
      description: 'طبيب وفيلسوف إسلامي، ألف كتاب القانون في الطب.'
    },
    {
      id: 'cleopatra',
      name: 'كليوباترا',
      acceptedNames: ['كليوباترا', 'الملكة كليوباترا'],
      category: 'تاريخ',
      difficulty: 'medium',
      description: 'آخر ملكات الأسرة البطلمية في مصر.'
    },
    {
      id: 'shakespeare',
      name: 'ويليام شكسبير',
      acceptedNames: ['ويليام شكسبير', 'شكسبير'],
      category: 'أدب',
      difficulty: 'medium',
      description: 'كاتب مسرحي وشاعر إنجليزي شهير، صاحب مسرحية هاملت.'
    },
  
    // المستوى الصعب (Hard)
    {
      id: 'ibn_khaldun',
      name: 'ابن خلدون',
      acceptedNames: ['ابن خلدون', 'عبد الرحمن ابن خلدون'],
      category: 'تاريخ',
      difficulty: 'hard',
      description: 'مؤسس علم الاجتماع وصاحب المقدمة الشهيرة.'
    },
    {
      id: 'tesla',
      name: 'نيكولا تسلا',
      acceptedNames: ['نيكولا تسلا', 'تسلا'],
      category: 'علوم',
      difficulty: 'hard',
      description: 'مهندس ومخترع صسربى أمريكي اشتهر بأعماله في التيار المتناوب.'
    },
    {
      id: 'ibn_battuta',
      name: 'ابن بطوطة',
      acceptedNames: ['ابن بطوطة', 'محمد بن عبد الله اللواتي'],
      category: 'تاريخ',
      difficulty: 'hard',
      description: 'رحالة ومؤرخ مسلم قضى 30 عاماً في الرحلات.'
    }
  ];