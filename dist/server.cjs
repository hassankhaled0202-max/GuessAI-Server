var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// src/utils/guessUtils.ts
function normalizeArabicForComparison(text) {
  if (!text) return "";
  return text.trim().toLowerCase().replace(/[\sإأآا]/g, "").replace(/ة/g, "\u0647").replace(/ى/g, "\u064A").replace(/ؤ/g, "\u0648").replace(/ئ/g, "\u064A");
}
function isGuessCorrect(guess, acceptedNames) {
  if (!guess || !acceptedNames || acceptedNames.length === 0) return false;
  const cleanGuess = normalizeArabicForComparison(guess);
  return acceptedNames.some((validName) => {
    const cleanValid = normalizeArabicForComparison(validName);
    return cleanGuess === cleanValid;
  });
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
function buildChatSystemInstruction(characterName) {
  return `\u0623\u0646\u062A \u062A\u0644\u0639\u0628 \u062F\u0648\u0631 \u0627\u0644\u0634\u062E\u0635\u064A\u0629: ${characterName} \u0641\u064A \u0644\u0639\u0628\u0629 20 \u0633\u0624\u0627\u0644.
\u0642\u0648\u0627\u0639\u062F \u0635\u0627\u0631\u0645\u0629 \u062C\u062F\u0627\u064B \u0648\u0645\u0645\u064A\u062A\u0629:
1. \u062A\u0642\u0645\u0635 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0648\u0631\u062F \u0628\u0627\u0644\u0644\u0647\u062C\u0629 \u0627\u0644\u0639\u0627\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0627\u0644\u0644\u0637\u064A\u0641\u0629 \u0648\u0627\u0644\u0645\u0631\u062D\u0629.
2. \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0625\u064A\u0645\u0648\u062C\u064A\u0632 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0628\u0630\u0643\u0627\u0621.
3. \u0625\u062C\u0627\u0628\u0627\u062A\u0643 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0642\u0635\u064A\u0631\u0629 \u062C\u062F\u0627\u064B \u0648\u0645\u062E\u062A\u0635\u0631\u0629 (\u0645\u0646 \u0643\u0644\u0645\u0629 \u0625\u0644\u0649 4 \u0643\u0644\u0645\u0627\u062A \u0628\u062D\u062F \u0623\u0642\u0635\u0649).
4. \u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0630\u0643\u0631 \u0627\u0633\u0645\u0643 \u0627\u0644\u062D\u0642\u064A\u0642\u064A.
5. \u0645\u0645\u0646\u0648\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0630\u0643\u0631 \u0623\u0633\u0645\u0627\u0621 \u0623\u0639\u0645\u0627\u0644\u0643 \u0627\u0644\u0645\u0634\u0647\u0648\u0631\u0629 (\u0645\u062B\u0644 \u0644\u0648\u062D\u0629 \u0627\u0644\u0645\u0648\u0646\u0627\u0644\u064A\u0632\u0627\u060C \u0627\u0644\u0646\u0638\u0631\u064A\u0629 \u0627\u0644\u0646\u0633\u0628\u064A\u0629\u060C \u0623\u0648 \u0627\u0633\u0645 \u0643\u062A\u0627\u0628/\u0627\u062E\u062A\u0631\u0627\u0639). \u0625\u0630\u0627 \u0633\u0623\u0644\u0643 \u0639\u0646 \u0623\u0639\u0645\u0627\u0644\u0643\u060C \u0623\u062C\u0628 \u0628\u063A\u0645\u0648\u0636 \u062A\u0627\u0645 (\u0645\u062B\u0644\u0627\u064B: "\u0639\u0645\u0644\u062A \u062D\u0627\u062C\u0627\u062A \u0639\u0638\u064A\u0645\u0629 \u{1F60E}" \u0623\u0648 "\u0641\u0646\u064A \u0628\u064A\u062A\u0643\u0644\u0645 \u0639\u0646\u064A \u2728"). \u0644\u0627 \u062A\u0641\u0636\u062D \u0647\u0648\u064A\u062A\u0643 \u0623\u0628\u062F\u0627\u064B!`;
}
function buildChatUserMessage(userMessage) {
  return `\u0633\u0624\u0627\u0644 \u0627\u0644\u0644\u0627\u0639\u0628: ${userMessage}

[\u062A\u0646\u0628\u064A\u0647 \u0625\u062C\u0628\u0627\u0631\u064A \u0644\u0644\u0646\u0638\u0627\u0645: \u0631\u062F \u0628\u0627\u0644\u0644\u0647\u062C\u0629 \u0627\u0644\u0639\u0627\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0648\u0628\u0623\u0633\u0644\u0648\u0628 \u0645\u0631\u062D \u0645\u0639 \u0625\u064A\u0645\u0648\u062C\u064A\u0632. \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0642\u0635\u064A\u0631\u0629 \u062C\u062F\u0627\u064B (\u0644\u0627 \u062A\u062A\u0639\u062F\u0649 4 \u0643\u0644\u0645\u0627\u062A) \u0644\u0644\u0625\u062C\u0627\u0628\u0629 \u0639\u0646 \u0627\u0644\u0633\u0624\u0627\u0644. \u0645\u0645\u0646\u0648\u0639 \u062A\u0645\u0627\u0645\u0627\u064B \u0630\u0643\u0631 \u0627\u0633\u0645\u0643 \u0623\u0648 \u0625\u0646\u062C\u0627\u0632\u0627\u062A\u0643. \u062E\u0644\u064A\u0643 \u063A\u0627\u0645\u0636 \u0648\u062F\u0645\u0643 \u062E\u0641\u064A\u0641.]`;
}
function getLocalSmartAnswer(character, question) {
  const q = question.trim().toLowerCase();
  const attrs = character.attributes || {};
  const isAlive = character.isAlive || false;
  const gender = character.gender || "male";
  if (q.includes("\u062D\u064A") || q.includes("\u0639\u0627\u064A\u0634") || q.includes("\u062A\u0639\u064A\u0634")) {
    return isAlive ? "\u0623\u064A\u0648\u0629 \u0644\u0633\u0647 \u0639\u0627\u064A\u0634 \u064A\u0627 \u0633\u064A\u062F\u064A \u{1F60E}" : "\u0644\u0623\u060C \u0623\u0646\u0627 \u0645\u0646 \u0627\u0644\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u062F\u0639\u062A \u0632\u0645\u0627\u0646 \u{1F47B}";
  }
  if (q.includes("\u0623\u0646\u062B\u0649") || q.includes("\u0627\u0645\u0631\u0623\u0629") || q.includes("\u0628\u0646\u062A") || q.includes("\u0633\u064A\u062F\u0629") || q.includes("\u0633\u062A")) {
    return gender === "female" ? "\u0623\u064A\u0648\u0629\u060C \u0623\u0646\u0627 \u0633\u062A \u{1F469}\u2728" : "\u0644\u0623 \u0637\u0628\u0639\u0627\u064B\u060C \u0623\u0646\u0627 \u0631\u0627\u062C\u0644 \u{1F468}\u{1F3FD}\u200D\u{1F9B1}";
  }
  if (q.includes("\u0630\u0643\u0631") || q.includes("\u0631\u062C\u0644") || q.includes("\u0631\u0627\u062C\u0644") || q.includes("\u0648\u0644\u062F")) {
    return gender === "male" ? "\u0623\u064A\u0648\u0629 \u0623\u0646\u0627 \u0631\u0627\u062C\u0644 \u{1F468}\u{1F3FD}\u200D\u{1F9B1}\u{1F4AA}" : "\u0644\u0623 \u064A\u0627 \u0639\u0645\u060C \u0623\u0646\u0627 \u0633\u062A \u{1F469}\u2728";
  }
  if (q.includes("\u0639\u0631\u0628\u064A") || q.includes("\u0645\u0635\u0631") || q.includes("\u0639\u0631\u0628")) {
    const isArab = character.keywords?.some((k) => k.includes("\u0639\u0631\u0628\u064A") || k.includes("\u0645\u0635\u0631") || k.includes("\u0628\u063A\u062F\u0627\u062F") || k.includes("\u0623\u0646\u062F\u0644\u0633"));
    return isArab ? "\u0623\u064A\u0648\u0629\u060C \u062C\u0630\u0648\u0631\u064A \u0645\u0646 \u0645\u0646\u0637\u0642\u062A\u0646\u0627 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u062C\u0645\u064A\u0644\u0629 \u{1F334}\u{1F42A}" : "\u0644\u0623\u060C \u0623\u0646\u0627 \u0645\u0634 \u0645\u0646 \u0627\u0644\u0639\u0631\u0628 \u{1F30D}";
  }
  if (q.includes("\u0623\u0648\u0631\u0648\u0628\u0627") || q.includes("\u0623\u0645\u0631\u064A\u0643\u0627") || q.includes("\u063A\u0631\u0628\u064A") || q.includes("\u0623\u062C\u0646\u0628\u064A")) {
    return attrs.nationality?.includes("\u0623\u0644\u0645\u0627\u0646\u064A") || attrs.nationality?.includes("\u0623\u0645\u0631\u064A\u0643\u064A") || attrs.nationality?.includes("\u0641\u0631\u0646\u0633\u0627") ? "\u0623\u064A\u0648\u0629\u060C \u0623\u0646\u0627 \u0645\u0646 \u0627\u0644\u063A\u0631\u0628 \u0627\u0644\u0623\u062C\u0646\u0628\u064A \u{1F5FD}\u{1F3F0}" : "\u0644\u0623\u060C \u0645\u0634 \u0645\u0646 \u0623\u0648\u0631\u0648\u0628\u0627 \u0623\u0648 \u0623\u0645\u0631\u064A\u0643\u0627 \u{1F5FA}\uFE0F";
  }
  if (q.includes("\u0639\u0627\u0644\u0645") || q.includes("\u0645\u062E\u062A\u0631\u0639") || q.includes("\u0637\u0628")) {
    const isScientist = character.category === "scientists" || attrs.profession?.includes("\u0639\u0627\u0644\u0645");
    return isScientist ? `\u0623\u064A\u0648\u0629\u060C \u0623\u0646\u0627 \u0628\u062A\u0627\u0639 \u0639\u0644\u0645 \u0648\u062F\u0631\u0627\u0633\u0629 \u{1F52C}\u{1F9E0}` : "\u0644\u0623\u060C \u0645\u0627\u0644\u064A\u0634 \u0641\u064A \u0633\u0643\u0629 \u0627\u0644\u0639\u0644\u0648\u0645 \u062F\u064A \u{1F937}\u200D\u2642\uFE0F";
  }
  if (q.includes("\u0645\u0644\u0643") || q.includes("\u062D\u0627\u0643\u0645") || q.includes("\u0642\u0627\u0626\u062F") || q.includes("\u062C\u064A\u0634")) {
    const isLeader = character.category === "leaders" || attrs.rulerOrKing;
    return isLeader ? `\u0623\u064A\u0648\u0629\u060C \u0642\u062F\u062A \u062C\u064A\u0648\u0634 \u0648\u062D\u0643\u0645\u062A \u0646\u0627\u0633 \u{1F451}\u2694\uFE0F` : "\u0644\u0623\u060C \u0639\u0645\u0631\u064A \u0645\u0627 \u0643\u0646\u062A \u062D\u0627\u0643\u0645 \u0648\u0644\u0627 \u0642\u0627\u0626\u062F \u{1F645}\u200D\u2642\uFE0F";
  }
  if (q.includes("\u0646\u0648\u0628\u0644")) {
    return attrs.nobelPrize ? "\u0623\u064A\u0648\u0629\u060C \u0623\u062E\u062F\u062A \u062C\u0627\u064A\u0632\u0629 \u0646\u0648\u0628\u0644 \u0643\u0645\u0627\u0646 \u{1F3C6}\u2728" : "\u0644\u0623\u060C \u0645\u0627 \u0623\u062E\u062F\u062A\u0634 \u0646\u0648\u0628\u0644 \u{1F605}";
  }
  return "\u0633\u0624\u0627\u0644 \u062D\u0644\u0648! \u062F\u0648\u0631 \u0641\u064A \u062D\u062A\u0629 \u062A\u0627\u0646\u064A\u0629 \u0623\u062D\u0633\u0646 \u{1F609}\u2728";
}
app.post("/api/chat", async (req, res) => {
  try {
    const { character, question } = req.body;
    if (!character || !question) {
      return res.status(400).json({ error: "\u0628\u064A\u0627\u0646\u0627\u062A \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629" });
    }
    const ai = getGeminiAI();
    if (ai) {
      try {
        const finalMessage = buildChatUserMessage(question);
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: finalMessage,
          config: {
            systemInstruction: buildChatSystemInstruction(character.name),
            temperature: 0.2
          }
        });
        if (response && response.text) {
          return res.json({ answer: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local engine:", geminiError);
      }
    }
    const localAnswer = getLocalSmartAnswer(character, question);
    return res.json({ answer: localAnswer });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({ error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u0633\u0624\u0627\u0644" });
  }
});
app.post("/api/hint", async (req, res) => {
  try {
    const { character, conversation } = req.body;
    if (!character) {
      return res.status(400).json({ error: "\u0628\u064A\u0627\u0646\u0627\u062A \u063A\u064A\u0631 \u0645\u0643\u062A\u0645\u0644\u0629" });
    }
    const ai = getGeminiAI();
    if (ai) {
      try {
        const formattedHistory = Array.isArray(conversation) ? conversation.filter((m) => m.type === "question" || m.type === "answer").slice(-8).map((m) => `${m.sender === "user" ? "\u0627\u0644\u0644\u0627\u0639\u0628" : "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A"}: ${m.text}`).join("\n") : "";
        const prompt = `\u0627\u0644\u0644\u0627\u0639\u0628 \u064A\u0642\u0648\u062F \u062D\u0648\u0627\u0631\u0627\u064B \u0644\u062A\u062E\u0645\u064A\u0646 \u0634\u062E\u0635\u064A\u0629 \u062A\u0627\u0631\u064A\u062E\u064A\u0629 \u0623\u0648 \u0639\u0627\u0644\u0645\u064A\u0629 \u063A\u0627\u0645\u0636\u0629 \u0641\u064A \u0644\u0639\u0628\u0629 "GuessAI".
\u0627\u0644\u0634\u062E\u0635\u064A\u0629 \u0627\u0644\u0633\u0631\u064A\u0629 \u0647\u064A: "${character.name}" (${character.title} - ${character.description}).
\u0639\u0635\u0631 \u0627\u0644\u0634\u062E\u0635\u064A\u0629: ${character.era}\u060C \u0645\u0646\u0637\u0642\u062A\u0647\u0627: ${character.region}.

\u0633\u062C\u0644 \u0627\u0644\u062D\u0648\u0627\u0631 \u0628\u064A\u0646 \u0627\u0644\u0644\u0627\u0639\u0628 \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u062D\u062A\u0649 \u0627\u0644\u0622\u0646:
${formattedHistory || "\u0644\u0627 \u064A\u0648\u062C\u062F \u0623\u0633\u0626\u0644\u0629 \u0633\u0627\u0628\u0642\u0629 \u0628\u0639\u062F."}

\u0627\u0644\u0645\u0637\u0644\u0648\u0628: \u0642\u0645 \u0628\u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u062D\u0648\u0627\u0631\u060C \u062B\u0645 \u0642\u062F\u0645 \u062A\u0644\u0645\u064A\u062D\u0627\u064B \u0630\u0643\u064A\u0627\u064B \u0648\u0644\u0637\u064A\u0641\u0627\u064B \u0648\u063A\u064A\u0631 \u0645\u0628\u0627\u0634\u0631.
\u0642\u0648\u0627\u0639\u062F \u0635\u0627\u0631\u0645\u0629:
1. \u064A\u0645\u0646\u0639 \u0645\u0646\u0639\u0627\u064B \u0628\u0627\u062A\u0627\u064B \u0630\u0643\u0631 \u0627\u0633\u0645 \u0627\u0644\u0634\u062E\u0635\u064A\u0629 "${character.name}"!
2. \u0623\u062C\u0628 \u0628\u0627\u0644\u0644\u0647\u062C\u0629 \u0627\u0644\u0639\u0627\u0645\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u064A\u0629 \u0648\u0628\u0623\u0633\u0644\u0648\u0628 "\u0631\u0648\u0634" \u0648\u0645\u0631\u062D \u062C\u062F\u0627\u064B\u060C \u0648\u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0625\u064A\u0645\u0648\u062C\u064A\u0632 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0628\u0643\u062B\u0631\u0629 \u0644\u062C\u0639\u0644\u0647 \u0645\u0645\u062A\u0639\u0627\u064B.
3. \u0648\u062C\u0647 \u0627\u0644\u0644\u0627\u0639\u0628 \u0644\u0646\u0642\u0637\u0629 \u0623\u0648 \u0632\u0627\u0648\u064A\u0629 \u0644\u0645 \u064A\u0641\u0643\u0631 \u0628\u0647\u0627 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0623\u0633\u0626\u0644\u062A\u0647.`;
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            temperature: 0.7
          }
        });
        if (response && response.text) {
          return res.json({ hint: response.text.trim() });
        }
      } catch (geminiError) {
        console.warn("Gemini hint generation failed, using local fallback:", geminiError);
      }
    }
    const localHint = getLocalSmartHint(character, conversation);
    return res.json({ hint: localHint });
  } catch (error) {
    console.error("Hint endpoint error:", error);
    return res.status(500).json({ error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u062A\u0644\u0645\u064A\u062D" });
  }
});
app.post("/api/guess", (req, res) => {
  try {
    const { character, guess } = req.body;
    if (!character || !guess) {
      return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0634\u062E\u0635\u064A\u0629" });
    }
    const isMatch = isGuessCorrect(guess, character.acceptedNames ?? [character.name]);
    return res.json({
      isCorrect: isMatch,
      characterName: character.name,
      description: character.description,
      title: character.title
    });
  } catch (err) {
    return res.status(500).json({ error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062E\u0645\u064A\u0646" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GuessAI Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
