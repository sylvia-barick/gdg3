import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';
import AnimatedSection from '../components/AnimatedSection';

const NotFound = () => {
  return (
    <div className="p-6 min-h-[80vh] flex items-center justify-center">
      <AnimatedSection>
        <GlassContainer className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-6xl font-bold text-white mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-white/80 mb-4">Page Not Found</h2>
            <p className="text-white/60 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </GlassContainer>
      </AnimatedSection>
    </div>
  );
};

export default NotFound;