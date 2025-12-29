import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext'; // Import Auth Context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = () => {
    // 1. Navigate to Home FIRST (Move away from protected pages)
    navigate('/');
    
    // 2. Clear Session (Small timeout ensures navigation happens first)
    setTimeout(() => {
        logout();
        setIsOpen(false); 
    }, 50);
  };

  const isActive = (path) => 
    location.pathname === path 
      ? "text-blue-600 dark:text-blue-400 font-bold" 
      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO SECTION */}
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Event<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/events" className={isActive('/events')}>Browse Events</Link>
            
            {/* THEME TOGGLE BUTTON */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>

            {/* AUTH BUTTONS OR USER PROFILE */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* User Name Link -> Dashboard */}
                <Link 
                  to={user.role === 'ROLE_ADMIN' || user.role === 'ROLE_ORGANIZER' ? "/admin" : "/dashboard"}
                  className="font-bold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Hi, {user.name || "User"}
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-semibold border border-red-200 dark:border-red-800 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-xl">
               {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Home</Link>
            <Link to="/events" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Browse Events</Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'ROLE_ADMIN' || user.role === 'ROLE_ORGANIZER' ? "/admin" : "/dashboard"}
                  className="block px-3 py-2 text-blue-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  Dashboard ({user.name})
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-blue-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;