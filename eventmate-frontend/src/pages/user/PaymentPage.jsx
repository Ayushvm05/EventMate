import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // <--- Import API

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { event, ticketCount, totalPrice, bookingId } = location.state || { 
    event: { title: "Unknown Event", date: "N/A", location: "N/A" }, 
    ticketCount: 1, 
    totalPrice: 0 
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Call Backend to Process Payment
      await api.post('/api/payments/process', {
        bookingId: bookingId,
        paymentMethod: "Credit Card" 
      });

      // 2. Success! Redirect
      navigate('/booking-success');

    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please check your details.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
        
        {/* LEFT: PAYMENT FORM */}
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Payment Details</h2>
          
          <form onSubmit={handlePayment}>
            {/* Cardholder Name */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>

            {/* Card Number */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Card Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full p-3 pl-12 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" 
                  maxLength="19"
                  required 
                />
                <span className="absolute left-3 top-3 text-gray-400">💳</span>
              </div>
            </div>

            {/* Expiry & CVC */}
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">CVC</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500" 
                  maxLength="3"
                  required 
                />
              </div>
            </div>

            {/* Pay Button */}
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-4 rounded-lg font-bold text-white transition duration-300 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${totalPrice}`}
            </button>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Order Summary</h3>
            
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="font-semibold text-gray-800 dark:text-gray-200">{event.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{event.date} at {event.location}</p>
            </div>

            <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
              <span>{ticketCount} x Ticket</span>
              <span>₹{totalPrice / ticketCount}</span>
            </div>
            
            <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300">
              <span>Tax & Fees (5%)</span>
              <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 font-bold text-xl text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{(totalPrice * 1.05).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;