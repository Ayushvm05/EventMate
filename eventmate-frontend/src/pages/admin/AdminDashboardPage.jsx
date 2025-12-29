import React, { useState, useEffect } from 'react';
import StatisticCard from '../../components/dashboard/StatisticCard';
import api from '../../services/api'; 

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [eventInsights, setEventInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Stats
        const statsRes = await api.get('/api/admin/stats');
        setStats(statsRes.data);

        // 2. Fetch Recent Bookings (Strict Endpoint)
        const bookingsRes = await api.get('/api/admin/bookings-recent');
        setRecentBookings(bookingsRes.data); 

        // 3. Fetch Event Insights
        const insightsRes = await api.get('/api/admin/event-insights');
        setEventInsights(insightsRes.data.slice(0, 5)); 

        setLoading(false);
      } catch (error) {
        console.error("Failed to load admin data.", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Admin Overview</h1>

      {/* 1. Important Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticCard 
            title="Total Revenue" 
            value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} 
            increase="Lifetime" 
            color="bg-green-100 text-green-600" 
            icon="💰" 
        />
        <StatisticCard 
            title="Total Bookings" 
            value={stats.totalBookings || 0} 
            increase="Confirmed" 
            color="bg-blue-100 text-blue-600" 
            icon="🎟️" 
        />
        <StatisticCard 
            title="Total Events" 
            value={stats.totalEvents || 0} 
            increase="My Events" 
            color="bg-purple-100 text-purple-600" 
            icon="📅" 
        />
        <StatisticCard 
            title="Total Users" 
            value={stats.totalUsers || 0} 
            increase="Platform Wide" 
            color="bg-orange-100 text-orange-600" 
            icon="👥" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* 2. Top Performing Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Top Performing Events</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="min-w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                 <tr>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Tickets Sold</th>
                    <th className="px-6 py-4">Revenue</th>
                    <th className="px-6 py-4">Occupancy</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {eventInsights.length > 0 ? (
                      eventInsights.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-[150px]" title={event.title}>
                                {event.title}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                {event.ticketsSold} / {event.capacity}
                            </td>
                            <td className="px-6 py-4 font-bold text-green-600">
                                ₹{(event.revenue || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <span className="text-xs font-semibold mr-2">{(event.occupancy || 0).toFixed(0)}%</span>
                                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                                        <div 
                                            className={`h-full rounded-full ${event.occupancy > 80 ? 'bg-green-500' : event.occupancy > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${event.occupancy || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr><td colSpan="4" className="px-6 py-6 text-center text-gray-500">No events found.</td></tr>
                  )}
               </tbody>
             </table>
          </div>
        </div>

        {/* 3. Recent Bookings Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Recent Bookings</h3>
            </div>
            
            <div className="overflow-x-auto">
            <table className="min-w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                <tr>
                    {/* UPDATED: Changed Header ID to # */}
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentBookings.length > 0 ? (
                        /* UPDATED: Added index parameter to map function */
                        recentBookings.map((booking, index) => (
                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                {/* UPDATED: Displaying index + 1 instead of booking.id */}
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">#{index + 1}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                    {booking.user?.name || 'User'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                    {booking.event?.title}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No bookings yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;