import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../context/AuthContext'; // Import Auth

const AdminLayout = () => {
  const { user } = useAuth(); // Get real user data
  
  // Theme State Management
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. Sidebar (Fixed Left) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm h-20 flex items-center justify-between px-8 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
          
          <div className="flex items-center space-x-6">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>

            {/* Admin Info - ✅ FIXED to show real email */}
            <div className="flex items-center space-x-3">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {user?.email || "Admin"}
                </span>
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;