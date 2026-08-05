import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// دالة التحقق من التخمين مدمجة مباشرة لتجنب مشاكل المسارات
function isGuessCorrect(userGuess: string, acceptedNames: string[]): boolean {
  if (!userGuess || !acceptedNames || acceptedNames.length === 0) return false;
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/^(ال|ألف ال|إلخ)/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[^a-z0-9u0600-u06ff\s]/g, '');

  const cleanUserGuess = normalize(userGuess);
  return acceptedNames.some(name => {
    const cleanName = normalize(name);
    return cleanName === cleanUserGuess || cleanName.includes(cleanUserGuess) || cleanUserGuess.includes(cleanName);
  });
}

// Initialize Gemini Client
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

function buildChatSystemInstruction(character: Record<string, any>): string {
  const aliveStatus = character.isAlive ? "أنت ما زلت على قيد الحياة في العصر الحالي." : "أنت شخصية تاريخية وتوفيت منذ زمن طويل (أنت ميت الآن).";
  
  return `أنت تلعب دور الشخصية: ${character.name} في لعبة 20 سؤال.
معلومة هامة عنك: ${aliveStatus}
قواعد صارمة جداً ومميتة:
1. التزم تماماً باللهجة العامية المصرية اللطيفة والمرحة في كل إجاباتك، ممنوع الفصحى نهائياً!
2. إذا سألك اللاعب إذا كنت حياً أم ميتاً، أجب بصدق بناءً على معلومتك (${aliveStatus}) بأسلوب مرح (مثال: "أنا ودعت من زمان"، أو "لسه عايش يا سيدي").
3. استخدم الإيموجيز المناسبة بذكاء.
4. إجاباتك قصيرة جداً ومختصرة (من كلمة إلى 4 كلمات بحد أقصى).
5. ممنوع منعاً باتاً ذكر اسمك الحقيقي أو أعمالك. خليك غامض جداً!`;
}

function buildChatUserMessage(userMessage: string): string {
  return `سؤال اللاعب: ${userMessage}

[تنبيه إجباري للنظام: رد باللهجة العامية المصرية وبأسلوب مرح مع إيموجيز. الإجابة قصيرة جداً (لا تتعدى 4 كلمات). ممنوع تماماً ذكر اسمك أو إنجازاتك.]`;
}

function getLocalSmartAnswer(character: Record<string, any>, question: string): string {
  const q = question.trim().toLowerCase();
  const isAlive = character.isAlive || false;
  const gender = character.gender || 'male';

  if (q.includes('حي') || q.includes('عايش') || q.includes('تعيش')) {
    return isAlive ? 'أيوة لسه عايش يا سيدي 😎' : 'لأ، أنا من التاريخ وودعت زمان 👻';
  }
  if (q.includes('أنثى') || q.includes('امرأة') || q.includes('بنت') || q.includes('ست')) {
    return gender === 'female' ? 'أيوة، أنا ست 👩✨' : 'لأ طبعاً، أنا راجل 👨🏽‍🦱';
  }
  if (q.includes('عربي') || q.includes('مصر') || q.includes('عرب')) {
    return 'أيوة، جذوري عربية 🌴🐪';
  }
  return 'سؤال حلو! دور في حتة تانية أحسن 😉✨';
}

function getLocalSmartHint(character: Record<string, any>): string {
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
            // التعديل هنا: تمرير الكائن character بالكامل بدل character.name
            systemInstruction: buildChatSystemInstruction(character),
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
        const prompt = `الشخصية السرية هي: "${character.name}" (${character.title}). قدم تلميحاً ذكياً ولطيفاً وغير مباشر باللهجة العامية المصرية وبدون ذكر الاسم.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { temperature: 0.7 },
        });

        if (response && response.text) {
          return res.json({ hint: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn('Gemini hint generation failed:', geminiError);
      }
    }

    const localHint = getLocalSmartHint(character);
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