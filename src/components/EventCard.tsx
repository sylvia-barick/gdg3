import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Tag, Heart, Share2, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  department: string;
  club: string;
  tags: string[];
  attendees?: number;
  maxAttendees?: number;
  image?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  time,
  location,
  department,
  club,
  tags,
  attendees = 0,
  maxAttendees = 100,
  image
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAttendanceColor = () => {
    const percentage = (attendees / maxAttendees) * 100;
    if (percentage >= 80) return 'text-red-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <motion.div
      className="group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#232336]/80 to-[#181824]/90 shadow-2xl border border-[#2e2e3a]/60 backdrop-blur-xl transition-all duration-300 hover:shadow-pink-500/20 hover:border-pink-400/30"
      whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.15)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-20">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 pointer-events-none" />

      <div className="relative space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <motion.h3 
              className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors mb-2 drop-shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              {title}
            </motion.h3>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-3 py-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full text-pink-300 text-sm font-medium border border-pink-400/30 shadow-sm">
                {club}
              </span>
            </div>
            <p className="text-white/60 text-sm">{department}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1 text-white/80 bg-white/10 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{formatDate(date)}</span>
            </div>
            <div className="flex items-center space-x-1 text-white/80 bg-white/10 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{time}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/80 leading-relaxed line-clamp-3 min-h-[3.5em]">{description}</p>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-white/70">
            <MapPin className="h-5 w-5 text-pink-400" />
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className={`h-5 w-5 ${getAttendanceColor()}`} />
            <span className={`font-medium ${getAttendanceColor()}`}>
              {attendees}/{maxAttendees} attending
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.span
              key={index}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full text-xs text-indigo-300 border border-indigo-400/30 shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </motion.span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-3">
            <motion.button
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-400 bg-red-400/20' : 'text-white/60 hover:text-red-400 hover:bg-red-400/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <motion.button
              className="p-2 rounded-full text-white/60 hover:text-blue-400 hover:bg-blue-400/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'text-yellow-400 bg-yellow-400/20' : 'text-white/60 hover:text-yellow-400 hover:bg-yellow-400/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          <motion.button
            className={`px-8 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg ${
              isJoined
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
            }`}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.98 }}
            style={{ willChange: 'transform' }}
            onClick={() => setIsJoined(!isJoined)}
          >
            {isJoined ? 'Joined ✓' : 'Join Event'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;