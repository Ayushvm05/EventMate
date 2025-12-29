import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; 
import Button from '../common/Button'; 

const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false); 

  const qrData = JSON.stringify({
    bookingId: booking.id,
    event: booking.eventTitle,
    tickets: booking.tickets,
    valid: true
  });

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition">
        {/* Event Image */}
        <img 
          src={booking.image || 'https://via.placeholder.com/150'} 
          alt={booking.eventTitle} 
          className="w-full md:w-32 h-32 object-cover rounded-md" 
        />
        
        {/* Ticket Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{booking.eventTitle}</h3>
            <span className={`px-2 py-1 text-xs font-bold rounded ${
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-1">📅 {booking.date} • ⏰ {booking.time}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">📍 {booking.location}</p>
          
          <div className="mt-4 flex items-center justify-between">
             <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{booking.tickets} Ticket(s)</span>
                <span className="mx-2">|</span>
                <span>Total: ₹{booking.totalPrice}</span>
             </div>
             
             {/* Show Buttons ONLY if Confirmed */}
             {booking.status === 'CONFIRMED' && (
               <div className="flex gap-2">
                 {/* ✅ Rate Event: Navigates using EVENT ID */}
                 <Button 
                    variant="primary" 
                    className="text-xs py-1 px-3"
                    onClick={() => navigate(`/rate-event/${booking.eventId}`)}
                 >
                   ★ Rate Event
                 </Button>

                 {/* Show E-Ticket */}
                 <Button 
                    variant="outline" 
                    className="text-xs py-1 px-3 flex items-center gap-1"
                    onClick={() => setShowQR(true)} 
                 >
                   <span className="text-lg">📱</span> Show E-Ticket
                 </Button>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* QR CODE MODAL */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center relative">
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">E-Ticket Check In</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Show this QR code at the entrance.</p>
            <div className="bg-white p-4 rounded-lg inline-block border border-gray-200">
              <QRCode value={qrData} size={200} level="H" />
            </div>
            <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Booking ID</p>
                <p className="font-mono text-lg font-bold text-blue-600">#{booking.id}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;