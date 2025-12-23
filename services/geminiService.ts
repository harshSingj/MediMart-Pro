
import { GoogleGenAI } from "@google/genai";

export const getPharmacyAssistance = async (query: string) => {
  try {
    // Correct initialization as per Google GenAI SDK guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional medical business assistant for MediMart Pro (Harsh Enterprises). 
      Answer the following customer query professionally and accurately. 
      Only provide general medical logistics/info, advise consulting a doctor for specific health issues.
      
      Query: ${query}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please contact our support team directly.";
  }
};
