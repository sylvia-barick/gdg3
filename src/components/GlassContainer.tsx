import React from 'react';
import { motion } from 'framer-motion';

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => (
  <motion.div
    className={`backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-3xl p-6 shadow-2xl ${className}`}
    whileHover={hover ? { 
      scale: 1.02, 
      boxShadow: '0 25px 50px rgba(20, 184, 166, 0.4)',
      borderColor: 'rgba(20, 184, 166, 0.6)'
    } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default GlassContainer;