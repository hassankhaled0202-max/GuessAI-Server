import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { isGuessCorrect } from './src/utils/guessUtils';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client lazily or safely if API key exists
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}
function buildChatSystemInstruction(characterName: string): string {
  return `أنت تلعب دور الشخصية: ${characterName} في لعبة 20 سؤال.
قواعد صارمة جداً ومميتة:
1. تقمص الشخصية ورد باللهجة العامية المصرية اللطيفة والمرحة.
2. استخدم الإيموجيز المناسبة بذكاء.
3. إجاباتك يجب أن تكون قصيرة جداً ومختصرة (من كلمة إلى 4 كلمات بحد أقصى).
4. ممنوع منعاً باتاً ذكر اسمك الحقيقي.
5. ممنوع منعاً باتاً ذكر أسماء أعمالك المشهورة (مثل لوحة الموناليزا، النظرية النسبية، أو اسم كتاب/اختراع). إذا سألك عن أعمالك، أجب بغموض تام (مثلاً: "عملت حاجات عظيمة 😎" أو "فني بيتكلم عني ✨"). لا تفضح هويتك أبداً!`;
}

function buildChatUserMessage(userMessage: string): string {
  return `سؤال اللاعب: ${userMessage}

[تنبيه إجباري للنظام: رد باللهجة العامية المصرية وبأسلوب مرح مع إيموجيز. الإجابة قصيرة جداً (لا تتعدى 4 كلمات) للإجابة عن السؤال. ممنوع تماماً ذكر اسمك أو إنجازاتك. خليك غامض ودمك خفيف.]`;
}

// Local smart fallback answer builder (Egyptian Vibe)
function getLocalSmartAnswer(character: Record<string, any>, question: string): string {
  const q = question.trim().toLowerCase();
  const attrs = character.attributes || {};
  const isAlive = character.isAlive || false;
  const gender = character.gender || 'male';

  // Questions about living state
  if (q.includes('حي') || q.includes('عايش') || q.includes('تعيش')) {
    return isAlive ? 'أيوة لسه عايش يا سيدي 😎' : 'لأ، أنا من التاريخ وودعت زمان 👻';
  }

  // Gender
  if (q.includes('أنثى') || q.includes('امرأة') || q.includes('بنت') || q.includes('سيدة') || q.includes('ست')) {
    return gender === 'female' ? 'أيوة، أنا ست 👩✨' : 'لأ طبعاً، أنا راجل 👨🏽‍🦱';
  }
  if (q.includes('ذكر') || q.includes('رجل') || q.includes('راجل') || q.includes('ولد')) {
    return gender === 'male' ? 'أيوة أنا راجل 👨🏽‍🦱💪' : 'لأ يا عم، أنا ست 👩✨';
  }

  // Region / Origin
  if (q.includes('عربي') || q.includes('مصر') || q.includes('عرب')) {
    const isArab = character.keywords?.some((k: string) => k.includes('عربي') || k.includes('مصر') || k.includes('بغداد') || k.includes('أندلس'));
    return isArab ? 'أيوة، جذوري من منطقتنا العربية الجميلة 🌴🐪' : 'لأ، أنا مش من العرب 🌍';
  }

  if (q.includes('أوروبا') || q.includes('أمريكا') || q.includes('غربي') || q.includes('أجنبي')) {
    return attrs.nationality?.includes('ألماني') || attrs.nationality?.includes('أمريكي') || attrs.nationality?.includes('فرنسا')
      ? 'أيوة، أنا من الغرب الأجنبي 🗽🏰'
      : 'لأ، مش من أوروبا أو أمريكا 🗺️';
  }

  // Profession: Scientist / Doctor
  if (q.includes('عالم') || q.includes('مخترع') || q.includes('طب')) {
    const isScientist = character.category === 'scientists' || attrs.profession?.includes('عالم');
    return isScientist ? `أيوة، أنا بتاع علم ودراسة 🔬🧠` : 'لأ، ماليش في سكة العلوم دي 🤷‍♂️';
  }

  // Profession: Leader / Ruler
  if (q.includes('ملك') || q.includes('حاكم') || q.includes('قائد') || q.includes('جيش')) {
    const isLeader = character.category === 'leaders' || attrs.rulerOrKing;
    return isLeader ? `أيوة، قدت جيوش وحكمت ناس 👑⚔️` : 'لأ، عمري ما كنت حاكم ولا قائد 🙅‍♂️';
  }

  // Nobel Prize
  if (q.includes('نوبل')) {
    return attrs.nobelPrize ? 'أيوة، أخدت جايزة نوبل كمان 🏆✨' : 'لأ، ما أخدتش نوبل 😅';
  }

  return 'سؤال حلو! دور في حتة تانية أحسن 😉✨';
}

function getLocalSmartHint(character: Record<string, any>, conversation: any[]): string {
  const hints = character.hints || [];
  if (hints.length > 0) {
    return hints[Math.floor(Math.random() * hints.length)];
  }
  return `فكر في العصر اللي عاشت فيه الشخصية (${character.era}) ومنطقتها (${character.region})! 🤔`;
}

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { character, question } = req.body;
    if (!character || !question) {
      return res.status(400).json({ error: 'بيانات غير مكتملة' });
    }

    const ai = getGeminiAI();
    if (ai) {
      try {
        const finalMessage = buildChatUserMessage(question);

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: finalMessage,
          config: {
            systemInstruction: buildChatSystemInstruction(character.name),
            temperature: 0.2,
          },
        });

        if (response && response.text) {
          return res.json({ answer: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local engine:', geminiError);
      }
    }

    // Local engine fallback
    const localAnswer = getLocalSmartAnswer(character, question);
    return res.json({ answer: localAnswer });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'حدث خطأ في معالجة السؤال' });
  }
});

app.post('/api/hint', async (req, res) => {
  try {
    const { character, conversation } = req.body;
    if (!character) {
      return res.status(400).json({ error: 'بيانات غير مكتملة' });
    }

    const ai = getGeminiAI();
    if (ai) {
      try {
        const formattedHistory = Array.isArray(conversation)
          ? conversation
              .filter((m: any) => m.type === 'question' || m.type === 'answer')
              .slice(-8)
              .map((m: any) => `${m.sender === 'user' ? 'اللاعب' : 'الذكاء الاصطناعي'}: ${m.text}`)
              .join('\n')
          : '';

        const prompt = `اللاعب يقود حواراً لتخمين شخصية تاريخية أو عالمية غامضة في لعبة "GuessAI".
الشخصية السرية هي: "${character.name}" (${character.title} - ${character.description}).
عصر الشخصية: ${character.era}، منطقتها: ${character.region}.

سجل الحوار بين اللاعب والذكاء الاصطناعي حتى الآن:
${formattedHistory || 'لا يوجد أسئلة سابقة بعد.'}

المطلوب: قم بتحليل الحوار، ثم قدم تلميحاً ذكياً ولطيفاً وغير مباشر.
قواعد صارمة:
1. يمنع منعاً باتاً ذكر اسم الشخصية "${character.name}"!
2. أجب باللهجة العامية المصرية وبأسلوب "روش" ومرح جداً، واستخدم الإيموجيز المناسبة بكثرة لجعله ممتعاً.
3. وجه اللاعب لنقطة أو زاوية لم يفكر بها بناءً على أسئلته.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          return res.json({ hint: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn('Gemini hint generation failed, using local fallback:', geminiError);
      }
    }

    const localHint = getLocalSmartHint(character, conversation);
    return res.json({ hint: localHint });
  } catch (error) {
    console.error('Hint endpoint error:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء توليد التلميح' });
  }
});

app.post('/api/guess', (req, res) => {
  try {
    const { character, guess } = req.body;
    if (!character || !guess) {
      return res.status(400).json({ error: 'يرجى إدخال اسم الشخصية' });
    }

    const isMatch = isGuessCorrect(guess, character.acceptedNames ?? [character.name]);

    return res.json({
      isCorrect: isMatch,
      characterName: character.name,
      description: character.description,
      title: character.title,
    });
  } catch (err) {
    return res.status(500).json({ error: 'حدث خطأ أثناء التخمين' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();