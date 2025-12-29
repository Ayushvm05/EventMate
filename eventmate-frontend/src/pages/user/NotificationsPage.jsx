import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // <--- Import Real API
import Loader from '../../components/common/Loader';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/notifications/my');
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Notifications 🔔</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {notifications.length > 0 ? (
            notifications.map((note) => (
            <div key={note.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex gap-4">
                {/* Status Indicator */}
                <div className="w-2 bg-blue-500 rounded-full"></div>
                
                <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-white">{note.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{note.message}</p>
                <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(note.createdOn).toLocaleString()}
                </span>
                </div>
            </div>
            ))
        ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No notifications yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;