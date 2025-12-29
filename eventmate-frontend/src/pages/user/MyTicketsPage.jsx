import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Restored Link for "Browse Events"
import api from '../../services/api'; 
import TicketViewer from '../../components/bookings/TicketViewer'; 
import Loader from '../../components/common/Loader'; 

const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the modal
  const [selectedBooking, setSelectedBooking] = useState(null); 

  // Fetch Logic
  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const res = await api.get('/api/bookings/my-bookings'); 
              setBookings(res.data);
          } catch (error) {
              console.error("Failed to fetch bookings", error);
          } finally {
              setLoading(false);
          }
      };
      fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Tickets</h1>

       {bookings.length === 0 ? (
           // ✅ RESTORED: Better Empty State from Old Code
           <div className="text-center py-10 bg-white dark:bg-gray-800 rounded shadow">
             <p className="text-gray-500 dark:text-gray-400">You haven't booked any events yet.</p>
             <Link to="/events" className="text-blue-600 dark:text-blue-400 font-bold mt-2 inline-block">Browse Events</Link>
           </div>
       ) : (
           <div className="grid gap-4">
               {bookings.map(booking => (
                  <div key={booking.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-md">
                     
                     {/* Left side info */}
                     <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{booking.event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {booking.event.date} • {booking.event.time}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{booking.event.location}</p>

                        <div className="mt-2 flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {booking.status}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                {booking.ticketsCount} Ticket(s)
                            </span>
                             <span className="text-sm text-gray-500">
                                (Total: ₹{booking.totalPrice})
                            </span>
                        </div>
                     </div>

                     {/* Right side buttons */}
                     {booking.status === 'CONFIRMED' && (
                         <button 
                            onClick={() => setSelectedBooking(booking)} 
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2 font-semibold text-sm"
                         >
                            <span className="text-lg">🎟️</span> 
                            Show {booking.ticketsCount} Ticket{booking.ticketsCount > 1 ? 's' : ''}
                         </button>
                     )}
                  </div>
               ))}
           </div>
       )}

       {/* ✅ Render the Modal conditionally */}
       {selectedBooking && (
          <TicketViewer 
             booking={selectedBooking} 
             onClose={() => setSelectedBooking(null)} 
          />
       )}
    </div>
  );
};

export default MyTicketsPage;