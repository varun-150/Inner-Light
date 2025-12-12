import { GoogleGenAI, Type } from "@google/genai";
import { BeliefSystem, GeminiJSONResponse } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.error("❌ Gemini API_KEY is missing or empty from environment variables.");
    console.error("💡 Make sure .env.local contains: GEMINI_API_KEY=your_key_here");
    console.error("🔄 Restart the dev server after adding the API key.");
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("❌ Failed to initialize Google GenAI client:", error);
    throw new Error("Failed to initialize AI client. Please check your API key.");
  }
};

// Helper to convert File to Base64 for Gemini
const fileToPart = async (file: File) => {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise as string,
      mimeType: file.type,
    },
  };
};

/**
 * Detects emotion and provides spiritual guidance using Gemini Flash Lite for low latency.
 */
export const analyzeEmotion = async (
  text: string,
  belief: BeliefSystem
): Promise<GeminiJSONResponse> => {
  const ai = getAiClient();

  const prompt = `
    Analyze the following journal entry written by a youth who believes in ${belief}.
    Text: "${text}"

    Task:
    1. Detect the dominant emotion (e.g., Happy, Neutral, Stressed, Sad, Anxious).
    2. Write a 1-2 line calming, empathetic message.
    3. Provide a short piece of spiritual wisdom or quote strictly from ${belief}.
    4. Suggest one simple calming action (e.g., "Deep breathing", "Drink water", "Short walk").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: { type: Type.STRING },
            calmingMessage: { type: Type.STRING },
            spiritualWisdom: { type: Type.STRING },
            suggestedAction: { type: Type.STRING },
          },
          required: ["emotion", "calmingMessage", "spiritualWisdom", "suggestedAction"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
};

/**
 * Reframes overthinking using Gemini Flash Lite for speed.
 */
export const reframeWorry = async (
  worry: string,
  belief: BeliefSystem
): Promise<GeminiJSONResponse> => {
  const ai = getAiClient();

  const prompt = `
    The user is overthinking: "${worry}".
    Belief System: ${belief}.

    Reframe this thought into something calm, logical, constructive, and spiritually aligned with their belief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reframedThought: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["reframedThought", "explanation"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error reframing worry:", error);
    throw error;
  }
};

/**
 * Generates daily wisdom.
 */
export const getDailyWisdom = async (belief: BeliefSystem): Promise<{ quote: string; source: string }> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `Give me one inspiring, short spiritual quote from ${belief} for a young person today. Return JSON with 'quote' and 'source'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            source: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { quote: "Peace comes from within.", source: "Unknown" };
  }
}

/**
 * Chatbot functionality using Gemini 3 Pro Preview with Thinking Mode.
 */
export const sendChatMessage = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  belief: BeliefSystem
): Promise<string> => {
  try {
    const ai = getAiClient();

    const systemInstruction = `You are InnerLight, a wise, empathetic, and spiritual companion for a young person. 
    Their belief system is ${belief}. Always answer in a way that is supportive, non-judgmental, and aligned with their faith/spirituality.`;

    const chat = ai.chats.create({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: message,
    });

    return result.text || "I am here with you.";
  } catch (error: any) {
    console.error("💬 Chat Error Details:", {
      error: error,
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText
    });

    // Check for specific error types
    if (error?.message?.includes('API key')) {
      throw new Error("API Key error: Please check your Gemini API configuration.");
    } else if (error?.status === 429) {
      return "I'm receiving many requests right now. Please wait a moment and try again.";
    } else if (error?.status === 500) {
      return "The AI service is experiencing difficulties. Please try again in a moment.";
    } else if (error?.message?.includes('quota')) {
      return "The API quota has been exceeded. Please try again later.";
    }

    return "I am having trouble connecting to the spiritual network right now. Please try again.";
  }
};

/**
 * Search Grounding for factual queries using Gemini 2.5 Flash + Google Search.
 */
export const searchWisdom = async (query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User question: ${query}. Find the most accurate, up-to-date spiritual or mental wellness information relevant to this.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return {
      text: response.text || "I couldn't find specific information on that.",
      sources
    };
  } catch (error) {
    console.error("Search error:", error);
    return { text: "Search is currently unavailable.", sources: [] };
  }
}

/**
 * Analyze Video content using Gemini 3 Pro.
 */
export const analyzeVideoContent = async (videoFile: File, prompt: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const filePart = await fileToPart(videoFile);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ]
      }
    });
    return response.text || "I could not analyze the video.";
  } catch (error) {
    console.error("Video analysis error:", error);
    throw error;
  }
}