import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center space-x-3 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md transition-all"
      : "flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-3 rounded-lg transition-all";
  };

  return (
    <div className="bg-gray-900 w-64 min-h-screen flex flex-col border-r border-gray-800">
      {/* 1. Admin Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">
          Event<span className="text-blue-600">Admin</span>
        </h1>
      </div>

      {/* 2. Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        
        <Link to="/admin" className={getLinkClass('/admin')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* ✅ NEW: Cinema Halls Tab (For Movies) */}
        <Link to="/admin/halls" className={getLinkClass('/admin/halls')}>
          <span className="text-xl w-5 flex justify-center">🎬</span>
          <span className="font-medium">Cinema Halls</span>
        </Link>

        <Link to="/admin/events" className={getLinkClass('/admin/events')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span className="font-medium">All Events</span>
        </Link>

        <Link to="/admin/create-event" className={getLinkClass('/admin/create-event')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="font-medium">Create Event</span>
        </Link>

        <Link to="/admin/bookings" className={getLinkClass('/admin/bookings')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <span className="font-medium">Bookings</span>
        </Link>

        <Link to="/admin/reviews" className={getLinkClass('/admin/reviews')}>
          <span className="text-xl w-5 flex justify-center">⭐</span> 
          <span className="font-medium">Reviews</span>
        </Link>

        <Link to="/admin/users" className={getLinkClass('/admin/users')}>
          <span className="text-xl w-5 flex justify-center">👥</span> 
          <span className="font-medium">Users</span>
        </Link>

        <Link to="/admin/notifications" className={getLinkClass('/admin/notifications')}>
          <span className="text-xl w-5 flex justify-center">📢</span>
          <span className="font-medium">Announcements</span>
        </Link>

        <Link to="/admin/profile" className={getLinkClass('/admin/profile')}>
          <span className="text-xl w-5 flex justify-center">⚙️</span>
          <span className="font-medium">Profile</span>
        </Link>

      </nav>

      {/* 3. Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 text-red-500 hover:text-red-400 hover:bg-gray-800 px-4 py-3 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;