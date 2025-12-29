import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const RecommendedEvents = () => {
  const { user } = useAuth(); // Get auth status
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if user is logged in
    if (user) {
      const fetchRecommendations = async () => {
        try {
          const response = await api.get('/api/recommendations');
          setEvents(response.data);
        } catch (error) {
          console.error("Failed to load recommendations", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Don't show anything if not logged in or no recommendations found
  if (!user || events.length === 0) return null;

  return (
    <div className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          ✨ Recommended for You
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Based on your booking history
        </p>

        {loading ? (
          <div className="text-gray-500">Loading your picks...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link 
                to={`/events/${event.id}`} 
                key={event.id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={event.imageUrl || 'https://via.placeholder.com/400x200'} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {event.category}
                  </span>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <span className="font-bold text-blue-600">₹{event.price}</span>
                    <span className="text-xs text-gray-400 hover:text-blue-500">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedEvents;