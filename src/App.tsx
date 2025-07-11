import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import ParticleBackground from './components/ParticleBackground';
import './index.css';

// Initialize Firebase (app & analytics)


function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-gradient-to-br from-[#181824] via-[#232336] to-[#181824]">
        <ParticleBackground />
        <div className="relative z-10">
          <Navbar />
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
