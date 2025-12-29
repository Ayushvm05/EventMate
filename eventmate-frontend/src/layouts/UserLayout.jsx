import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AiChatWidget from '../components/common/AiChatWidget'; // <--- 1. ADD THIS IMPORT

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative"> {/* Added relative for positioning */}
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* 2. PLUG IN THE WIDGET HERE */}
      <AiChatWidget /> 
    </div>
  );
};

export default UserLayout;