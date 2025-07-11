import React, { useState } from 'react';
import { Filter, Search, Calendar, MapPin, Users, X, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassContainer from './GlassContainer';

interface FilterPanelProps {
  onFiltersChange?: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts & Sciences',
    'Student Life',
    'Sports & Recreation'
  ];

  const eventTypes = [
    { name: 'Workshop', color: 'from-blue-500 to-cyan-500' },
    { name: 'Seminar', color: 'from-green-500 to-emerald-500' },
    { name: 'Social', color: 'from-pink-500 to-rose-500' },
    { name: 'Competition', color: 'from-orange-500 to-red-500' },
    { name: 'technology', color: 'from-purple-500 to-indigo-500' },
    { name: 'Sports', color: 'from-yellow-500 to-orange-500' }
  ];

  // Helper to notify parent of filter changes
  const notifyFiltersChange = (overrides = {}) => {
    if (onFiltersChange) {
      onFiltersChange({
        searchTerm,
        department: selectedDepartment,
        date: selectedDate,
        types: selectedTypes,
        ...overrides
      });
    }
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    notifyFiltersChange({ types: newTypes });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedDate('');
    setSelectedTypes([]);
    if (onFiltersChange) {
      onFiltersChange({
        searchTerm: '',
        department: '',
        date: '',
        types: []
      });
    }
  };

  return (
    <GlassContainer className="h-fit sticky top-24">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-lg font-semibold">
            <Filter className="h-5 w-5 text-pink-400" />
            <span>Smart Filters</span>
          </div>
          <motion.button
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Sliders className="h-4 w-4" />
          </motion.button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                <Search className="h-4 w-4 inline mr-2" />
                Search Events
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, club, or keyword..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Call parent on change
                    setTimeout(() => notifyFiltersChange({ searchTerm: e.target.value }), 0);
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-white/50 text-white transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTimeout(() => notifyFiltersChange({ searchTerm: '' }), 0);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                <Users className="h-4 w-4 inline mr-2" />
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setTimeout(() => notifyFiltersChange({ department: e.target.value }), 0);
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-gray-800">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date Range
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setTimeout(() => notifyFiltersChange({ date: e.target.value }), 0);
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white transition-all duration-300"
              />
            </div>

            {/* Event Types */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-4">Event Types</h4>
              <div className="grid grid-cols-2 gap-2">
                {eventTypes.map((type) => (
                  <motion.button
                    key={type.name}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedTypes.includes(type.name)
                        ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTypeToggle(type.name)}
                  >
                    {type.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <motion.button
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </GlassContainer>
  );
};

export default FilterPanel;