import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6">
      <div className="container mx-auto px-4">
        
        {/* Grid Layout: 1 column on mobile, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">EventMate</h2>
            <p className="text-sm leading-relaxed">
              Discover and book the best events near you. 
              From concerts to workshops, we bring people together.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/events" className="hover:text-blue-400 transition">Browse Events</Link></li>
              
              {/* ✅ ADDED: Required Info Pages */}
              <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span>📍 123 Tech Park, India</span>
              </li>
              <li className="flex items-center">
                <span>📧 support@eventmate.com</span>
              </li>
              <li className="flex items-center">
                <span>📞 +91 98765 43210</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">Subscribe to get the latest event updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full px-3 py-2 text-gray-900 rounded-l focus:outline-none"
              />
              <button className="bg-blue-600 px-4 py-2 text-white rounded-r hover:bg-blue-700 transition">
                Go
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} EventMate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;