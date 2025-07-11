import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" }); // Replace with a valid model

export async function getRecommendations(interests: string, events: any[]) {
  try {
    const prompt = `
      You're an AI assistant helping students discover relevant campus events.

      Interests: ${interests}
      Events:
      ${events.map((event) => `- ${event.title}: ${event.description}`).join('\n')}

      Based on these, recommend 5 exciting and personalized events the student should attend.
      Respond with each event on a new line.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return text;
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    return "Could not get recommendations.";
  }
}

// Test Gemini connection function
export const testGeminiConnection = async (setRecommendations: (text: string) => void) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use the correct model
    const result = await model.generateContent("Say hello from Gemini!");
    const response = await result.response;
    const text = await response.text();
    setRecommendations(text);
  } catch (err: any) {
    console.error("❌ Gemini error:", err);
    setRecommendations("❌ Gemini error: " + (err.message || err));
  }
};
