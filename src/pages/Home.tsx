import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import FilterPanel from '../components/FilterPanel';
import GlassContainer from '../components/GlassContainer';
import AnimatedSection from '../components/AnimatedSection';
import { Calendar, TrendingUp, Users, Sparkles, Zap, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { getEvents, Event } from '../utils/firebaseUtils';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: '',
    date: '',
    types: [] as string[],
  });

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const firebaseEvents = await getEvents();
        setEvents(firebaseEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filtering logic
  const filteredEvents = events.filter(event => {
    const search = filters.searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      event.title?.toLowerCase().includes(search) ||
      event.club?.toLowerCase().includes(search) ||
      (Array.isArray(event.tags) && event.tags.some(tag => tag.toLowerCase().includes(search)));

    const matchesDepartment = !filters.department || event.department === filters.department;
    const matchesDate = !filters.date || event.date === filters.date;
    const matchesTypes =
      !filters.types.length ||
      (Array.isArray(event.tags) &&
        filters.types.some(type =>
          event.tags.some(tag => tag.toLowerCase() === type.toLowerCase())
        )
      );

    return matchesSearch && matchesDepartment && matchesDate && matchesTypes;
  });

  const stats = [
    { icon: Calendar, label: 'Events', value: events.length, color: 'from-blue-400 to-cyan-400' },
    { icon: Users, label: 'Participants', value: '12.5K+', color: 'from-purple-400 to-pink-400' },
    { icon: TrendingUp, label: 'Growth', value: '+24%', color: 'from-green-400 to-emerald-400' },
    { icon: Star, label: 'Rating', value: '4.9', color: 'from-yellow-400 to-orange-400' },
  ];

  return (
    <div className="p-6 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Hero Section */}
      <AnimatedSection>
        <GlassContainer className="mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl"></div>
          <div className="relative z-10 p-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Welcome to EventSync
                </span>
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Discover amazing events, connect with your community, and create unforgettable experiences on campus
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full overflow-hidden shadow-2xl hover:shadow-pink-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Events
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:border-white/30 transition-all duration-300 group-hover:bg-white/15">
                      <div className={`inline-flex p-2 rounded-full bg-gradient-to-r ${stat.color} mb-2`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-white/60 text-xs">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </GlassContainer>
      </AnimatedSection>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        <FilterPanel onFiltersChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <motion.div
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <motion.div
                    className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto"
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                  />
                </div>
                <p className="text-white/70 text-lg">Loading events...</p>
              </div>
            </motion.div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">No events found</h3>
                <p className="text-white/70 mb-6">Try adjusting your filters or check back later for new events.</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="transform transition-all duration-300"
                >
                  <EventCard {...event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
