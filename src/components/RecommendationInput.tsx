import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import GlassContainer from './GlassContainer';

interface RecommendationInputProps {
  onGetRecommendations: (interests: string) => void;
  isLoading?: boolean;
}

const RecommendationInput: React.FC<RecommendationInputProps> = ({ 
  onGetRecommendations, 
  isLoading = false 
}) => {
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.trim()) {
      onGetRecommendations(interests.trim());
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
            placeholder="e.g., technology, programming, AI, startups, networking, technology development..."
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
    </GlassContainer>
  );
};

export default RecommendationInput;