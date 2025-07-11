import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Plus, Sparkles, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassContainer from './GlassContainer';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/add-event', label: 'Add Event', icon: Plus },
    { path: '/recommendations', label: 'AI Recommendations', icon: Sparkles }
  ];

  return (
    <nav className="p-4 sticky top-0 z-50">
      <GlassContainer className="flex items-center justify-between" hover={false}>
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Calendar className="h-8 w-8 text-[#00f2fe]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#00f2fe] to-[#7a5fff] rounded-full animate-pulse"></div>
          </motion.div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#00f2fe] via-[#7a5fff] to-[#00c6fb] bg-clip-text text-transparent">
              EventSync
            </span>
            <div className="text-xs text-[#00f2fe] font-medium">Campus Events</div>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="relative group"
            >
              <motion.div
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-gradient-to-r from-[#00f2fe]/30 to-[#7a5fff]/30 text-[#00f2fe] shadow-lg'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{label}</span>
              </motion.div>
              {location.pathname === path && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-[#00f2fe] to-[#7a5fff] rounded-full"
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </GlassContainer>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4"
        >
          <GlassContainer className="space-y-2" hover={false}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-gradient-to-r from-[#00f2fe]/30 to-[#7a5fff]/30 text-[#00f2fe]'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </GlassContainer>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;