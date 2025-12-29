import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../components/events/EventCard';
import api from '../../services/api'; 
import Loader from '../../components/common/Loader';
import AiChatWidget from '../../components/AiChatWidget';
import { useAuth } from '../../context/AuthContext'; 

// ✅ UPDATED: Added "Movies" to the filter list
const CATEGORIES = ["All", "Movies", "Music", "Technology", "Workshop", "Business", "Sports", "Others"];

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW: State to control how many events are visible
  const [visibleCount, setVisibleCount] = useState(6);

  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // 1. Fetch All Events (Catalog)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events');
        
        // ✅ NEW: Sort Events (Movies First, then Nearest Date)
        const sortedData = response.data.sort((a, b) => {
            // Priority 1: Movies always at the top (Now Showing)
            if (a.eventType === 'MOVIE' && b.eventType !== 'MOVIE') return -1;
            if (a.eventType !== 'MOVIE' && b.eventType === 'MOVIE') return 1;
            
            // Priority 2: Sort by Date (Nearest Upcoming First)
            const dateA = new Date(a.date || '2099-12-31');
            const dateB = new Date(b.date || '2099-12-31');
            return dateA - dateB;
        });

        setEvents(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load events", error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Fetch Recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      setRecLoading(true);
      try {
        const res = await api.get('/api/bookings/my-bookings');
        const allBookings = Array.isArray(res.data) ? res.data : [];

        if (allBookings.length > 0) {
            allBookings.sort((a, b) => b.id - a.id);
            const lastEventId = allBookings[0].event.id;
            const recRes = await api.get(`/api/events/recommendations/${lastEventId}`);
            setRecommendations(recRes.data || []);
        } else {
            const fallbackRes = await api.get('/api/events');
            if (Array.isArray(fallbackRes.data)) {
                setRecommendations(fallbackRes.data.slice(0, 4));
            }
        }
      } catch (error) {
        console.error("Failed to load recommendations", error);
      } finally {
        setRecLoading(false);
      }
    };

    if (user) {
        fetchRecommendations();
    }
  }, [user]);

  // Filter Logic
  const filteredEvents = events.filter(event => {
    // ✅ Handle "Movies" category mapping to 'Movies' or eventType
    const matchesCategory = activeCategory === "All" || 
                            (activeCategory === "Movies" ? event.eventType === "MOVIE" : event.category === activeCategory);
    
    // ✅ FIX: Enhanced Search Logic
    // Now searches Title, Location, Category, AND Description
    const query = searchQuery.toLowerCase();
    const matchesSearch = event.title?.toLowerCase().includes(query) || 
                          event.location?.toLowerCase().includes(query) ||
                          event.category?.toLowerCase().includes(query) ||
                          event.description?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // ✅ Reset visible count when filters change
  useEffect(() => {
      setVisibleCount(6);
  }, [activeCategory, searchQuery]);

  // ✅ Slice for display limit
  const displayedEvents = filteredEvents.slice(0, visibleCount);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12"> 
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 pt-20 pb-32 px-4 rounded-b-[3rem] shadow-xl mb-12 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative container mx-auto text-center z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Amazing Events</span><br/>Happening Near You
            </h1>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Your gateway to live concerts, tech workshops, sports, and unforgettable experiences.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-2xl p-2">
                    <span className="pl-6 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search for events, artists, venues..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 px-4 rounded-full focus:outline-none text-gray-700 dark:text-white dark:bg-transparent text-lg"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg transform active:scale-95">
                        Search
                    </button>
                </div>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-20 relative z-20">
        
        {/* Category Filter */}
        {!searchQuery && (
            <section className="mb-12 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex justify-center gap-3 min-w-max px-2">
                {CATEGORIES.map(cat => (
                    <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                        activeCategory === cat 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" 
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 hover:shadow-md"
                    }`}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </section>
        )}

        {/* AI Recommendations Section */}
        {user && !searchQuery && recommendations.length > 0 && (
            <div className="mb-16 animate-fadeIn">
            <div className="flex items-center mb-6 pl-2 border-l-4 border-yellow-400">
                    <div className="ml-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended for You</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Curated based on your interests</p>
                    </div>
            </div>
            
            {recLoading ? (
                <div className="flex justify-center p-10"><Loader /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
            </div>
        )}

        {/* Events Grid */}
        <section>
            <div className="flex justify-between items-end mb-8 px-2">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {searchQuery 
                        ? `Results for "${searchQuery}"` 
                        : (activeCategory === "All" ? "Upcoming Events" : `${activeCategory} Events`)
                    }
                </h2>
                <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
            </div>
            <span className="text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                Showing {displayedEvents.length} of {filteredEvents.length} Events
            </span>
            </div>

            {filteredEvents.length > 0 ? (
            <>
                {/* ✅ GRID LIMITED TO 'visibleCount' */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {displayedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {/* ✅ VIEW ALL BUTTON */}
                {filteredEvents.length > visibleCount && (
                    <div className="flex justify-center mt-8 mb-12">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm hover:shadow-md flex items-center"
                        >
                            View More Events <span className="ml-2">↓</span>
                        </button>
                    </div>
                )}
            </>
            ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any events matching your criteria.</p>
                <button onClick={() => {setActiveCategory("All"); setSearchQuery("")}} className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                View all events
                </button>
            </div>
            )}
        </section>

      </div>

      <AiChatWidget eventId={null} />
    </div>
  );
};

export default HomePage;