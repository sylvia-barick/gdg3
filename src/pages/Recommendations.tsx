import React, { useState } from 'react';
import { Sparkles, Star, Calendar, MapPin, Users } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';
import AnimatedSection from '../components/AnimatedSection';
import RecommendationInput from '../components/RecommendationInput';
import { getEvents } from '../utils/firebaseUtils';
import { getRecommendations } from '../utils/geminiPrompt';

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  date: string;
  department: string;
  club: string;
  tags: string[];
  score: number;
}

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async (interests: string) => {
    setIsLoading(true);
    try {
      const events = await getEvents(); // from Firestore
      const recs = await getRecommendations(interests, events); // Gemini
      setRecommendations(recs);
    } catch (error) {
      console.error("❌ Recommendation error:", error);
      setRecommendations([]);
    }
    setIsLoading(false);
  };
  

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
    if (score >= 80) return 'from-yellow-500/20 to-amber-500/20 border-yellow-400/30';
    return 'from-orange-500/20 to-red-500/20 border-orange-400/30';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AnimatedSection>
        <RecommendationInput 
          onGetRecommendations={handleGetRecommendations}
          isLoading={isLoading}
        />
      </AnimatedSection>

      {recommendations.length > 0 && (
        <AnimatedSection delay={0.3}>
          <GlassContainer className="mb-6">
            <div className="flex items-center space-x-2 text-xl font-bold mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>Your Personalized Recommendations</span>
            </div>
            <p className="text-white/70">
              Based on your interests, here are the events we think you'll love:
            </p>
          </GlassContainer>
        </AnimatedSection>
      )}

      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => (
          <AnimatedSection key={recommendation.id} delay={index * 0.2}>
            <GlassContainer>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {recommendation.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-white/70 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(recommendation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{recommendation.club}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{recommendation.department}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getScoreBackground(recommendation.score)} border text-center`}>
                  <div className={`text-lg font-bold ${getScoreColor(recommendation.score)}`}>
                    {recommendation.score}%
                  </div>
                  <div className="text-xs text-white/60">Match</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 mb-4 border border-blue-400/20">
                <div className="flex items-start space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Why we recommend this:</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {recommendation.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {recommendation.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs text-blue-300 border border-blue-400/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Join Event
                </button>
                <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </GlassContainer>
          </AnimatedSection>
        ))}
      </div>

      {recommendations.length === 0 && !isLoading && (
        <AnimatedSection delay={0.4}>
          <GlassContainer className="text-center py-12">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-yellow-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">
              Ready for Personalized Recommendations?
            </h3>
            <p className="text-white/60">
              Tell us about your interests above and we'll find the perfect events for you!
            </p>
          </GlassContainer>
        </AnimatedSection>
      )}
    </div>
  );
};

export default Recommendations;