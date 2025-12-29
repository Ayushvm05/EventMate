import React, { useState } from 'react';

const FAQPage = () => {
  const faqs = [
    { q: "How do I book a ticket?", a: "Simply search for an event, select your ticket type (General or VIP), and proceed to payment." },
    { q: "Can I get a refund?", a: "Refund policies vary by organizer. Please check the specific event details page." },
    { q: "Where is my ticket?", a: "After booking, your ticket is sent to your email and is also available in your Dashboard > My Bookings." },
    { q: "How do I contact support?", a: "You can use the Contact Us page or email support@eventmate.com." }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
            <button 
              className="w-full text-left p-4 font-semibold flex justify-between items-center text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.q}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 border-t dark:border-gray-700">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;