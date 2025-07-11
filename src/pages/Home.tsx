import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import FilterPanel from '../components/FilterPanel';
import GlassContainer from '../components/GlassContainer';
import AnimatedSection from '../components/AnimatedSection';
import { Calendar, TrendingUp, Users, Sparkles, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEvents, Event } from '../utils/firebaseUtils';

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: '',
    date: '',
    types: [] as string[],
  });

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
    // Search term: match title, club, or tags (case-insensitive)
    const search = filters.searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      event.title?.toLowerCase().includes(search) ||
      event.club?.toLowerCase().includes(search) ||
      (Array.isArray(event.tags) && event.tags.some(tag => tag.toLowerCase().includes(search)));

    // Department filter
    const matchesDepartment = !filters.department || event.department === filters.department;

    // Date filter (exact match)
    const matchesDate = !filters.date || event.date === filters.date;

    // Types filter (at least one type matches, case-insensitive)
    const matchesTypes =
      !filters.types.length ||
      (Array.isArray(event.tags) &&
        filters.types.some(type =>
          event.tags.some(tag => tag.toLowerCase() === type.toLowerCase())
        )
      );

    return matchesSearch && matchesDepartment && matchesDate && matchesTypes;
  });

  return (
    <div className="p-6">
      <AnimatedSection>
        <GlassContainer className="mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome to EventSync
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Discover amazing events, connect with your community, and create unforgettable experiences on campus
              </p>
            </motion.div>
          </div>
        </GlassContainer>
      </AnimatedSection>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterPanel onFiltersChange={setFilters} />
        <div className="flex-1">
          {loading ? (
            <div className="text-center text-white/70 text-lg">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-white/70 text-lg">No events found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;