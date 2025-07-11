import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import GlassContainer from './GlassContainer';
import { getEvents } from '../utils/firebaseUtils';
import { getRecommendations } from '../utils/geminiPrompt';
import { GoogleGenerativeAI } from "@google/generative-ai";

const RecommendationInput: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Move this function inside the component
  const testGeminiConnection = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API key is missing");
      setRecommendations("❌ Gemini API key is missing");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      const result = await model.generateContent("Say hello from Gemini!");
      const response = await result.response;
      const text = await response.text();

      console.log("✅ Gemini says:", text);
      setRecommendations(text);
    } catch (err) {
      console.error("❌ Gemini error:", err);
      setRecommendations("❌ Gemini error: " + err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setIsLoading(true);

    try {
      const events = await getEvents();
      console.log("Events:", events);
      const recs = await getRecommendations(interests, events);
      setRecommendations(typeof recs === 'string' ? recs : JSON.stringify(recs, null, 2));
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations("Oops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassContainer className="mb-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            AI Event Recommendations
          </span>
        </div>
        <p className="text-white/70">
          Tell us your interests and we'll recommend the perfect events for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            What are your interests?
          </label>
          <textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., technology, programming, AI, startups, networking..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50 text-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!interests.trim() || isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Getting Recommendations...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Get Personalized Recommendations</span>
            </>
          )}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg"
        onClick={testGeminiConnection}
      >
        Test Gemini API (Say Hello)
      </button>

      {recommendations && (
        <div className="mt-6 p-4 rounded-lg bg-white/10 text-white whitespace-pre-wrap">
          <strong>Recommended Events:</strong>
          <br />
          {recommendations}
        </div>
      )}
    </GlassContainer>
  );
};

export default RecommendationInput;
