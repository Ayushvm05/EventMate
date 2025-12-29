import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms & Privacy Policy</h1>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1. Introduction</h2>
          <p>Welcome to EventMate. By using our platform, you agree to these terms.</p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">2. Booking Policy</h2>
          <p>Tickets are subject to availability. Prices may change based on demand (Dynamic Pricing).</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">3. Privacy</h2>
          <p>We respect your data. We do not sell your personal information to third parties. We use your data solely to improve your event experience.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;