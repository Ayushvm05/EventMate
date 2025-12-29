import React, { useState } from 'react';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Contact Us</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Have questions? We'd love to hear from you.</p>

      {submitted ? (
        <div className="bg-green-100 text-green-700 p-6 rounded-lg text-center">
          ✅ Message sent! We'll get back to you shortly.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Name</label>
              <input type="text" className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Email</label>
              <input type="email" className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Message</label>
              <textarea rows="4" className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white" required></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Send Message</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContactPage;