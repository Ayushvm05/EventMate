import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About EventMate</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          We are on a mission to bring people together through live experiences. 
          Whether it's a tech conference, a music festival, or a local workshop, EventMate makes it easy.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-3xl font-bold text-blue-600">10k+</h3>
            <p className="text-gray-600 dark:text-gray-400">Events Hosted</p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-3xl font-bold text-blue-600">500k+</h3>
            <p className="text-gray-600 dark:text-gray-400">Tickets Sold</p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-xl">
            <h3 className="text-3xl font-bold text-blue-600">4.8/5</h3>
            <p className="text-gray-600 dark:text-gray-400">User Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;