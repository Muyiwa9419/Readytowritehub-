
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Strictly follow guidelines for initializing with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogIdea = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 catchy and "sleepy/calm" blog post titles and short excerpts for the topic: ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
          },
          required: ["title", "excerpt"]
        }
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const expandContentStream = async (title: string, excerpt: string, onChunk: (text: string) => void) => {
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: `Write a 500-word calm, atmospheric blog post titled "${title}". Focus on the excerpt: "${excerpt}". Use a gentle, soothing tone suitable for a sleepy-themed blog.`,
  });
  
  let fullText = '';
  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      fullText += text;
      onChunk(fullText);
    }
  }
  return fullText;
};

export const fetchMidnightRead = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recommend one classic, public domain book (available for free online) that is perfect for late-night, calm reading. Provide the title, author, a 2-sentence "Why it's perfect for tonight", and a link to read it for free (e.g., Project Gutenberg).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          reason: { type: Type.STRING },
          readUrl: { type: Type.STRING },
          sleepyRating: { type: Type.STRING, description: "A creative rating like '8/10 Moonbeams'" }
        },
        required: ["title", "author", "reason", "readUrl", "sleepyRating"]
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const generateAudioReading = async (text: string): Promise<string | undefined> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this blog post in a very calm, soothing, and slow voice suitable for bedtime: ${text.slice(0, 1500)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateWritingPrompt = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Give me one short, poetic, and sleepy writing prompt for a midnight blog. Focus on themes like moonlight, silence, dreams, or coffee. Max 15 words.",
  });
  return response.text;
};
