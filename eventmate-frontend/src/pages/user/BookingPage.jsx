import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api'; 
import Button from '../../components/common/Button';
import PaymentModal from '../../components/payment/PaymentModal';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  
  // Retrieve data passed from EventDetailsPage
  // ✅ NOW INCLUDES 'showTime' object
  const { event, ticketCount, totalPrice, seats, ticketType, showTime } = location.state || {};

  if (!event) return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Session Expired</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Please select an event again.</p>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
  );

  // Calculation Logic
  const baseAmount = Number(totalPrice); 
  
  // ✅ FIX: Service fee should depend on total price, not just base event price
  // If baseAmount > 0, charge service fee.
  const serviceFee = baseAmount > 0 ? 5 : 0;
  
  const finalAmount = baseAmount + serviceFee;

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      const payload = {
        eventId: event.id,
        ticketCount: ticketCount, 
        seats: seats || "", 
        totalPrice: finalAmount,
        
        // ✅ CRITICAL: Pass the Showtime ID if it exists (for Movies)
        showTimeId: showTime ? showTime.id : null 
      };

      // 1. Call Backend to Create Initial Booking (PENDING)
      const response = await api.post('/api/bookings/create', payload);
      const newBookingId = response.data.id; 
      setBookingId(newBookingId);

      // 2. Logic: Free vs Paid
      if (finalAmount === 0) {
        // Auto-confirm as "Free"
        await api.put(`/api/bookings/confirm/${newBookingId}`);
        navigate('/dashboard?payment=success');
      } else {
        // Paid: Open Stripe Payment Modal
        setShowPaymentModal(true);
      }

    } catch (error) {
      console.error("Booking failed:", error);
      const backendMessage = error.response?.data?.message || error.response?.data || "Failed to reserve tickets. Please try again.";
      alert(`⚠️ ${backendMessage}`); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    navigate('/booking-success'); 
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Review Your Booking</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        
        {/* Decorative Receipt Top */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Event Summary */}
        <div className="flex gap-6 mb-8 border-b border-gray-100 dark:border-gray-700 pb-8">
          <img 
            src={event.imageUrl || 'https://via.placeholder.com/150'} 
            alt={event.title} 
            className="w-28 h-28 object-cover rounded-lg shadow-sm" 
          />
          <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{event.title}</h2>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    {/* ✅ SHOW CORRECT DATE/TIME FOR MOVIES */}
                    <span>📅</span> 
                    {showTime 
                        ? `${showTime.showDate} at ${showTime.showTime.substring(0,5)}` 
                        : `${event.date} at ${event.time}`
                    }
                </p>
                
                {/* ✅ SHOW HALL NAME IF AVAILABLE */}
                {showTime && showTime.hall && (
                    <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span>🎬</span> {showTime.hall.name}
                    </p>
                )}

                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>📍</span> {event.location}
                </p>

                {seats ? (
                    <p className="text-blue-600 font-semibold mt-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit">
                        Seats: {seats}
                    </p>
                ) : (
                    <p className="text-gray-500 mt-2">
                        {ticketType} Ticket x {ticketCount}
                    </p>
                )}
             </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-8 text-gray-700 dark:text-gray-300 text-sm">
          <div className="flex justify-between">
            <span>{seats ? "Seat Selection Cost" : "Ticket Price"}</span>
            <span className="font-medium">
                {/* ✅ FIX: Correct Price Display Logic */}
                {seats 
                    ? (baseAmount > 0 ? `₹${baseAmount}` : "Free")  // For Movies/Seated: Check calculated total
                    : (event.price === 0 ? "Free" : `₹${event.price} x ${ticketCount}`) // For Standard: Check base price
                }
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span>{serviceFee === 0 ? "Waived" : `₹${serviceFee}`}</span>
          </div>

          <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-4 mt-2 flex justify-between items-end">
            <span className="font-bold text-lg">Total Payable</span>
            <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)} className="w-1/3" disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="w-2/3 flex items-center justify-center gap-2"
            disabled={isProcessing}
            onClick={handleConfirmBooking}
          >
            {isProcessing ? (
                <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Processing...
                </>
            ) : (
                finalAmount === 0 ? 'Confirm (Free)' : 'Confirm & Pay'
            )}
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
        🔒 Secure 256-bit SSL Encrypted Payment
      </p>

      {showPaymentModal && bookingId && (
        <PaymentModal 
          bookingId={bookingId}
          amount={finalAmount} 
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};

export default BookingPage;