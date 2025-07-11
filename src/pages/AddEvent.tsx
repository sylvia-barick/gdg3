import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Users, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';
import { addEvent, testFirebaseConnection } from '../utils/firebaseUtils';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    department: '',
    club: '',
    maxAttendees: '',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Test Firebase connection on component mount
  React.useEffect(() => {
    testFirebaseConnection();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.club.trim()) newErrors.club = 'Club/Organization is required';
    
    // Validate date is not in the past
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    // Validate max attendees if provided
    if (formData.maxAttendees && (parseInt(formData.maxAttendees) < 1 || parseInt(formData.maxAttendees) > 10000)) {
      newErrors.maxAttendees = 'Max attendees must be between 1 and 10,000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Process tags
      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Save event to Firestore
      const result = await addEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        department: formData.department,
        club: formData.club,
        tags: processedTags,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        attendees: 0
      });

      console.log("✅ Event saved to Firestore:", result);
      
      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          department: '',
          club: '',
          maxAttendees: '',
          tags: ''
        });
        setSubmitStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error creating event:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts & Sciences',
    'Student Life',
    'Sports & Recreation',
    'Medicine',
    'Law',
    'Education'
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AnimatedSection>
        <GlassContainer className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
            <Plus className="h-8 w-8 text-teal-300" />
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Create New Event
            </span>
          </div>
          <p className="text-white/70 text-lg">
            Share your amazing event with the campus community
          </p>
        </GlassContainer>
      </AnimatedSection>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl flex items-center space-x-3"
          >
            <CheckCircle className="h-6 w-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">Event Created Successfully!</h3>
              <p className="text-green-200/80 text-sm">Your event has been added to the campus calendar.</p>
            </div>
          </motion.div>
        </AnimatedSection>
      )}

      {submitStatus === 'error' && (
        <AnimatedSection>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl flex items-center space-x-3"
          >
            <AlertCircle className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="font-semibold text-red-300">Error Creating Event</h3>
              <p className="text-red-200/80 text-sm">Please try again or contact support if the problem persists.</p>
            </div>
          </motion.div>
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.2}>
        <GlassContainer>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 ${
                    errors.title ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Enter event title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Club/Organization *
                </label>
                <input
                  type="text"
                  name="club"
                  value={formData.club}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 ${
                    errors.club ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Enter organizing club/organization"
                />
                {errors.club && <p className="text-red-400 text-sm mt-1">{errors.club}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Event Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 resize-none transition-all duration-300 ${
                  errors.description ? 'border-red-400/50' : 'border-white/20'
                }`}
                placeholder="Describe your event in detail..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white transition-all duration-300 ${
                    errors.date ? 'border-red-400/50' : 'border-white/20'
                  }`}
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white transition-all duration-300 ${
                    errors.time ? 'border-red-400/50' : 'border-white/20'
                  }`}
                />
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Users className="h-4 w-4 inline mr-2" />
                  Max Attendees
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 ${
                    errors.maxAttendees ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="100"
                />
                {errors.maxAttendees && <p className="text-red-400 text-sm mt-1">{errors.maxAttendees}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 ${
                    errors.location ? 'border-red-400/50' : 'border-white/20'
                  }`}
                  placeholder="Enter event location"
                />
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white transition-all duration-300 ${
                    errors.department ? 'border-red-400/50' : 'border-white/20'
                  }`}
                >
                  <option value="" className="bg-gray-800">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-gray-800">
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                placeholder="e.g., technology, workshop, networking, technology"
              />
              <p className="text-white/50 text-xs mt-1">Separate multiple tags with commas</p>
            </div>

            <div className="flex gap-4 pt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none flex items-center justify-center space-x-2"
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Create Event</span>
                  </>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    department: '',
                    club: '',
                    maxAttendees: '',
                    tags: ''
                  });
                  setErrors({});
                }}
                className="px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Form
              </motion.button>
            </div>
          </form>
        </GlassContainer>
      </AnimatedSection>
    </div>
  );
};

export default AddEvent;