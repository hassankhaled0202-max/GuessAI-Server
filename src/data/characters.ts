import { Character, CharacterCategory, CharacterTopic, DifficultyLevel } from '../types';

export const CHARACTERS: Character[] = [
  // ─── Easy ───────────────────────────────────────────────
  {
    id: 'saladin',
    name: 'صلاح الدين الأيوبي',
    acceptedNames: ['صلاح الدين الأيوبي', 'صلاح الدين', 'الايوبي', 'صلاح الدين الايوبي'],
    title: 'محرر القدس ومؤسس الدولة الأيوبية',
    category: 'leaders',
    difficulty: 'easy',
    era: 'القرن الـ12 الميلادي',
    region: 'تكريت / مصر والشام',
    description: 'قائد عسكري وبطل إسلامي قاد المعارك ضد الصليبيين واستعاد القدس في معركة حطين.',
    isAlive: false,
    gender: 'male',
    hints: ['قاد المسلمين في معركة حطين عام 1187م.', 'أسس الدولة الأيوبية.', 'اشتهر بنبله حتى مع أعدائه.'],
    keywords: ['حطين', 'القدس', 'أيوبي', 'قائد', 'سلطان'],
    attributes: { profession: 'قائد عسكري وسلطان', nationality: 'كردي / إسلامي', famousFor: 'تحرير القدس', rulerOrKing: true },
  },
  {
    id: 'albert_einstein',
    name: 'ألبرت أينشتاين',
    acceptedNames: ['ألبرت أينشتاين', 'أينشتاين', 'انشتاين', 'البرت انشتاين', 'albert einstein'],
    title: 'عبقري الفيزياء الحديثة',
    category: 'scientists',
    difficulty: 'easy',
    era: 'القرن الـ20 الميلادي',
    region: 'ألمانيا / أمريكا',
    description: 'عالم فيزياء نظري غيّر مفاهيم الزمان والمكان بنظريتي النسبية.',
    isAlive: false,
    gender: 'male',
    hints: ['حاز على جائزة نوبل في الفيزياء.', 'صاحب معادلة E=mc².', 'اشتهر بشعره المنفوش.'],
    keywords: ['فيزياء', 'نسبية', 'نوبل', 'ألمانيا'],
    attributes: { profession: 'عالم فيزياء', nationality: 'ألماني / أمريكي', famousFor: 'النظرية النسبية', nobelPrize: true, writtenBooks: true },
  },
  {
    id: 'leonardo_da_vinci',
    name: 'ليوناردو دافنشي',
    acceptedNames: ['ليوناردو دافنشي', 'ليوناردو دافينشي', 'دافنشي', 'دافينشي', 'leonardo da vinci'],
    title: 'عبقري عصر النهضة',
    category: 'art',
    difficulty: 'easy',
    era: 'القرن الـ15 والـ16 الميلادي',
    region: 'فلورنسا / إيطاليا',
    description: 'فنان ومخترع وعالم موسوعي إيطالي أبدع في الرسم والتشريح والهندسة.',
    isAlive: false,
    gender: 'male',
    hints: ['رسّم لوحة الموناليزا.', 'صمّم مخططات طائرات وآلات.', 'عاش في فلورنسا وميلانو.'],
    keywords: ['فنان', 'موناليزا', 'اختراع', 'عصر النهضة', 'إيطاليا'],
    attributes: { profession: 'فنان ومخترع', nationality: 'إيطالي', famousFor: 'لوحة الموناليزا', writtenBooks: true },
  },
  {
    id: 'cleopatra',
    name: 'كليوباترا',
    acceptedNames: ['كليوباترا', 'cleopatra'],
    title: 'ملكة مصر الأخيرة',
    category: 'leaders',
    difficulty: 'easy',
    era: 'القرن الأول قبل الميلاد',
    region: 'الإسكندرية / مصر',
    description: 'آخر حكام الدولة البطلمية في مصر، اشتهرت بالذكاء والدبلوماسية.',
    isAlive: false,
    gender: 'female',
    hints: ['كانت تتحدث أكثر من 9 لغات.', 'عاشت في الإسكندرية.', 'ارتبطت بيوليوس قيصر.'],
    keywords: ['ملكة', 'مصر', 'إسكندرية', 'بطلمية'],
    attributes: { profession: 'ملكة وحاكمة', nationality: 'بطلمية', famousFor: 'حكم مصر', rulerOrKing: true },
  },
  {
    id: 'muhammad_ali',
    name: 'محمد علي كلاي',
    acceptedNames: ['محمد علي كلاي', 'محمد علي', 'علي كلاي', 'muhammad ali', 'كاسيوس clay'],
    title: 'أسطورة الملاكمة العالمية',
    category: 'sports',
    difficulty: 'easy',
    era: 'القرن الـ20 الميلادي',
    region: 'أمريكا / العالم',
    description: 'ملاكم أمريكي يُلقب بـ "الفراشة"، من أعظم رياضيي القرن العشرين.',
    isAlive: false,
    gender: 'male',
    hints: ['لُقب بـ "الأعظم" في الملاكمة.', 'رفض التجنيد وحُرّم من اللقب.', 'اشتهر بسرعته وذكائه داخل الحلبة.'],
    keywords: ['ملاكمة', 'رياضة', 'أمريكا', 'بطولة'],
    attributes: { profession: 'ملاكم محترف', nationality: 'أمريكي', famousFor: 'بطولة العالم للوزن الثقيل' },
  },

  // ─── Medium ─────────────────────────────────────────────
  {
    id: 'ibn_sina',
    name: 'ابن سينا',
    acceptedNames: ['ابن سينا', 'avicenna'],
    title: 'الشيخ الرئيس وأمير الأطباء',
    category: 'scientists',
    difficulty: 'medium',
    era: 'القرن الـ10 - الـ11 الميلادي',
    region: 'بخارى / الشرق الأوسط',
    description: 'طبيب وفيلسوف وعالم بخاري، صاحب كتاب القانون في الطب.',
    isAlive: false,
    gender: 'male',
    hints: ['ألّف كتاب القانون في الطب.', 'يُلقب بالشيخ الرئيس.', 'ولد قرب بخارى.'],
    keywords: ['طب', 'فلسفة', 'بخارى', 'طبيب'],
    attributes: { profession: 'طبيب وفيلسوف', nationality: 'فارسي / إسلامي', famousFor: 'كتاب القانون في الطب', writtenBooks: true },
  },
  {
    id: 'marie_curie',
    name: 'ماري كوري',
    acceptedNames: ['ماري كوري', 'ماري', 'كوري', 'marie curie'],
    title: 'سيدة الراديوم',
    category: 'scientists',
    difficulty: 'medium',
    era: 'القرن الـ19 والـ20 الميلادي',
    region: 'بولندا / فرنسا',
    description: 'عالمة فيزياء وكيمياء اكتشفت الراديوم والبولونيوم، أول امرأة تفوز بنوبل.',
    isAlive: false,
    gender: 'female',
    hints: ['فازت بنوبل مرتين في مجالين مختلفين.', 'اكتشفت النشاط الإشعاعي.', 'عملت في فرنسا.'],
    keywords: ['راديوم', 'إشعاع', 'نوبل', 'كيمياء'],
    attributes: { profession: 'عالمة فيزياء وكيمياء', nationality: 'بولندية / فرنسية', famousFor: 'اكتشاف الراديوم', nobelPrize: true },
  },
  {
    id: 'mutanabbi',
    name: 'المتنبي',
    acceptedNames: ['المتنبي', 'متنبي', 'ابو الطيب المتنبي', 'ابو الطيب'],
    title: 'شاعر العرب الأكبر',
    category: 'poets',
    difficulty: 'medium',
    era: 'القرن الـ10 الميلادي',
    region: 'الكوفة / حلب',
    description: 'أبو الطيب المتنبي، أشهر شعراء العربية وأصحاب القصائد الفخرية.',
    isAlive: false,
    gender: 'male',
    hints: ['صاحب بيت "الخيل والليل والبيضاء".', 'ارتبط بسيف الدولة الحمداني.', 'قُتل بسبب بيت شعر.'],
    keywords: ['شعر', 'قصيدة', 'سيف الدولة', 'أدب'],
    attributes: { profession: 'شاعر', nationality: 'عربي', famousFor: 'روائع الشعر العربي', writtenBooks: true },
  },
  {
    id: 'ibn_battuta',
    name: 'ابن بطوطة',
    acceptedNames: ['ابن بطوطة', 'ابن batuta', 'ابن بطوطه', 'ibn battuta'],
    title: 'أمير الرحالة المسلمين',
    category: 'historical',
    difficulty: 'medium',
    era: 'القرن الـ14 الميلادي',
    region: 'طنجة / المغرب',
    description: 'رحالة مغربي قطع أكثر من 120 ألف كيلومتر حول العالم القديم.',
    isAlive: false,
    gender: 'male',
    hints: ['ألّف كتاب تحفة النظار.', 'ولد في طنجة.', 'زار الصين والهند وأفريقيا.'],
    keywords: ['رحالة', 'سفر', 'طنجة', 'المغرب'],
    attributes: { profession: 'رحالة ومؤرخ', nationality: 'مغربي', famousFor: 'الرحلات الاستكشافية', writtenBooks: true },
  },
  {
    id: 'naguib_mahfouz',
    name: 'نجيب محفوظ',
    acceptedNames: ['نجيب محفوظ', 'محفوظ', 'naguib mahfouz', 'نجيب'],
    title: 'أديب النوبل العربي',
    category: 'poets',
    difficulty: 'medium',
    era: 'القرن الـ20 الميلادي',
    region: 'القاهرة / مصر',
    description: 'روائي مصري شهير بالثلاثية، أول أديب عربي يفوز بنوبل في الأدب.',
    isAlive: false,
    gender: 'male',
    hints: ['فاز بنوبل للأدب عام 1988.', 'من أشهر أعماله الثلاثية.', 'كتب عن الحارة المصرية.'],
    keywords: ['رواية', 'نوبل', 'أدب', 'مصر'],
    attributes: { profession: 'روائي', nationality: 'مصري', famousFor: 'الثلاثية ونوبل', nobelPrize: true, writtenBooks: true },
  },
  {
    id: 'umar_ibn_khattab',
    name: 'عمر بن الخطاب',
    acceptedNames: ['عمر بن الخطاب', 'عمر', 'الفاروق', 'عمر الخطاب'],
    title: 'الفاروق وثاني الخلفاء الراشدين',
    category: 'islamic',
    difficulty: 'medium',
    era: 'القرن الـ7 الميلادي',
    region: 'مكة / المدينة',
    description: 'ثاني الخلفاء الراشدين، عُرف بالعدل وتأسيس التقويم الهجري والدواوين.',
    isAlive: false,
    gender: 'male',
    hints: ['يُلقب بالفاروق.', 'أنشأ التاريخ الهجري.', 'اتسعت الفتوحات في عهده.'],
    keywords: ['خليفة', 'فاروق', 'صحابي', 'عدل'],
    attributes: { profession: 'خليفة', nationality: 'عربي / صحابي', famousFor: 'العدل والدواوين', rulerOrKing: true },
  },

  // ─── Hard ───────────────────────────────────────────────
  {
    id: 'khwarizmi',
    name: 'الخوارزمي',
    acceptedNames: ['الخوارزمي', 'خوارزmi', 'al khwarizmi', 'محمد بن موسى الخوارزمي'],
    title: 'مؤسس علم الجبر',
    category: 'scientists',
    difficulty: 'hard',
    era: 'القرن الـ9 الميلادي',
    region: 'خوارزم / بغداد',
    description: 'رياضياتي وفلكي أحدث ثورة في الرياضيات باختراع علم الجبر.',
    isAlive: false,
    gender: 'male',
    hints: ['منه اشتق اسم الخوارزمية.', 'ألّف كتاب الجبر والمقابلة.', 'عمل في بيت الحكمة.'],
    keywords: ['جبر', 'رياضيات', 'بيت الحكمة', 'بغداد'],
    attributes: { profession: 'عالم رياضيات', nationality: 'إسلامي', famousFor: 'تأسيس علم الجبر', writtenBooks: true },
  },
  {
    id: 'ibn_khaldun',
    name: 'ابن خلدون',
    acceptedNames: ['ابن خلدون', 'خلدون', 'ibn khaldun', 'عبد الرحمن بن خلدون'],
    title: 'مؤسس علم الاجتماع',
    category: 'scientists',
    difficulty: 'hard',
    era: 'القرn الـ14 الميلادي',
    region: 'تونس / القاهرة',
    description: 'مؤرخ وفيلسوف تونسي أرسى قواعد علم الاجتماع في مقدمته الشهيرة.',
    isAlive: false,
    gender: 'male',
    hints: ['صاحب مقدمة ابن خلدون.', 'تحدث عن العصبية ودورة الدول.', 'عاش بين تونس ومصر.'],
    keywords: ['اجتماع', 'مقدمة', 'تاريخ', 'تونس'],
    attributes: { profession: 'مؤرخ وفيلسوف', nationality: 'تونسي', famousFor: 'مقدمة ابن خلدون', writtenBooks: true },
  },
  {
    id: 'ibn_haytham',
    name: 'ابن الهيثم',
    acceptedNames: ['ابن الهيثم', 'الهيثم', 'ibn al haytham', 'ابن al-haytham'],
    title: 'أبو البصريات',
    category: 'scientists',
    difficulty: 'hard',
    era: 'القرn الـ10 - الـ11 الميلادي',
    region: 'البصرة / القاهرة',
    description: 'عالم مسلم أحدث ثورة في علم الضوء والبصريات، صاحب كتاب المناظر.',
    isAlive: false,
    gender: 'male',
    hints: ['ألّف كتاب المناظر.', 'شرح عمل الكامera obscura.', 'أثبت أن الرؤية بالضوء.'],
    keywords: ['بصريات', 'ضوء', 'المناظر', 'فيزياء'],
    attributes: { profession: 'عالم بصريات', nationality: 'عربي', famousFor: 'كتاب المناظر', writtenBooks: true },
  },
  {
    id: 'abbas_firnas',
    name: 'عباس بن فرناس',
    acceptedNames: ['عباس بن فرناس', 'ابن فرناس', 'فرناس', 'abbas ibn firnas'],
    title: 'رائد الطيران الأول',
    category: 'scientists',
    difficulty: 'hard',
    era: 'القرn الـ9 الميلادي',
    region: 'قرطبة / الأندلس',
    description: 'مخترع وعالم أندلسي قام بأول محاولة طيران شراعي في التاريخ.',
    isAlive: false,
    gender: 'male',
    hints: ['صنع جناحين وقفز من جبل في قرطبة.', 'صنع الميقاتة والقبة السماوية.', 'عاش في الأندلس.'],
    keywords: ['طيران', 'أندلس', 'قرطبة', 'اختراع'],
    attributes: { profession: 'مخترع وعالم', nationality: 'أندلسي', famousFor: 'أول محاولة طيران' },
  },
  {
    id: 'ahmed_zewail',
    name: 'أحمد زويل',
    acceptedNames: ['أحمد زويل', 'زويل', 'ahmed zewail', 'احمد زويل'],
    title: 'أبو كيمياء الفيمتو',
    category: 'scientists',
    difficulty: 'hard',
    era: 'القرn الـ20 والـ21 الميلادي',
    region: 'مصر / أمريكا',
    description: 'عالم كيمياء مصري أمريكي اخترع ميكروسكوب الفيمتو ثانية، حائز نوبل.',
    isAlive: false,
    gender: 'male',
    hints: ['حصل على نوبل في الكيمياء 1999.', 'التقط حركة الجزيئات بالفيمتو ثانية.', 'أسس مدينة زويل في مصر.'],
    keywords: ['كيمياء', 'فيمتو', 'نوبل', 'مصر'],
    attributes: { profession: 'عالم كيمياء', nationality: 'مصري', famousFor: 'الفيمتو ثانية', nobelPrize: true },
  },
  {
    id: 'tariq_ziyad',
    name: 'طارق بن زياد',
    acceptedNames: ['طارق بن زياد', 'طارق', 'bin ziyad', 'طارق بن زياد'],
    title: 'فاتح الأندلس',
    category: 'leaders',
    difficulty: 'hard',
    era: 'القرn الـ8 الميلادي',
    region: 'شمال أفريقيا / الأندلس',
    description: 'قائد عسكري إسلامي فتح شبه الجزيرة الإيبيرية وعُرف بمضيق جبل طارق.',
    isAlive: false,
    gender: 'male',
    hints: ['سمي المضيق باسمه.', 'انتصر في وادي لكة 711م.', 'تُنسب له خطبة "البحر من ورائكم".'],
    keywords: ['أندلس', 'فاتح', 'جبل طارق', 'قائد'],
    attributes: { profession: 'قائد عسكري', nationality: 'أمازيغي / إسلامي', famousFor: 'فتح الأندلس' },
  },
];

const CATEGORY_LABELS: Record<CharacterTopic, string> = {
  historical: 'تاريخ',
  scientists: 'علوم',
  leaders: 'قادة',
  poets: 'أدب',
  islamic: 'إسلامي',
  world: 'عالمي',
  art: 'فن',
  sports: 'رياضة',
};

export function getCategoryLabel(category: CharacterTopic): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function filterCharacters(
  category: CharacterCategory = 'all',
  difficulty?: DifficultyLevel
): Character[] {
  let pool = CHARACTERS;

  if (difficulty) {
    pool = pool.filter((c) => c.difficulty === difficulty);
  }

  if (category && category !== 'all') {
    const filtered = pool.filter((c) => c.category === category);
    if (filtered.length > 0) pool = filtered;
  }

  return pool;
}

export function getCharacterPoolSize(
  category: CharacterCategory = 'all',
  difficulty?: DifficultyLevel
): number {
  return filterCharacters(category, difficulty).length;
}

export function getRandomCharacter(
  category: CharacterCategory = 'all',
  difficulty: DifficultyLevel = 'medium'
): Character {
  let pool = filterCharacters(category, difficulty);

  if (pool.length === 0) {
    pool = CHARACTERS.filter((c) => c.difficulty === difficulty);
  }
  if (pool.length === 0) {
    pool = CHARACTERS;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/** @deprecated استخدم getRandomCharacter */
export function getRandomStarterCharacter(): Character {
  return getRandomCharacter('all', 'easy');
}
