import React from 'react';
import { Link } from 'react-router-dom';

const BookingSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your tickets have been sent to your email. You can also view them in your dashboard.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            to="/dashboard" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/30"
          >
            Go to My Bookings
          </Link>
          
          <Link 
            to="/" 
            className="block w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;