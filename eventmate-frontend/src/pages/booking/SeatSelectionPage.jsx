import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SeatSelection from '../../components/events/SeatSelection';
import Loader from '../../components/common/Loader';

const SeatSelectionPage = () => {
    const { showTimeId } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [showTime, setShowTime] = useState(null);
    const [seats, setSeats] = useState([]); // Raw seat data from API
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // 1. Fetch Showtime Details (for Grid Config like rows/cols)
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // You might need an endpoint like /api/showtimes/{id} to get event details
                // For now, assuming we get the showtime populated with event data
                const res = await api.get(`/api/showtimes/${showTimeId}`);
                setShowTime(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load showtime", error);
                setLoading(false);
            }
        };
        fetchDetails();
    }, [showTimeId]);

    // 2. Poll for Seat Status Updates (Real-time feel)
    useEffect(() => {
        const fetchSeatLayout = async () => {
            try {
                const res = await api.get(`/api/seats/layout/${showTimeId}`);
                setSeats(res.data); // Returns [{seatLabel: "A1", status: "LOCKED"}, ...]
            } catch (error) {
                console.error("Failed to load layout", error);
            }
        };

        fetchSeatLayout(); // Initial load
        const interval = setInterval(fetchSeatLayout, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [showTimeId]);

    // Helper: Convert API Seat Status to "Occupied" list for the UI component
    // The UI component expects a list of strings ["A1", "B2"] that are NOT available.
    const getOccupiedSeats = () => {
        return seats
            .filter(s => s.status !== 'AVAILABLE')
            .map(s => s.seatLabel);
    };

    // 3. Handle Local Selection
    const handleSeatClick = (seatLabel, price) => {
        if (selectedSeats.includes(seatLabel)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatLabel));
            setTotalPrice(prev => prev - price);
        } else {
            // Optional: Limit max seats
            if (selectedSeats.length >= 6) {
                alert("You can only select up to 6 seats.");
                return;
            }
            setSelectedSeats(prev => [...prev, seatLabel]);
            setTotalPrice(prev => prev + price);
        }
    };

    // 4. Handle "Proceed to Pay" (Locking Logic)
    const handleProceed = async () => {
        if (!user) {
            alert("Please login to continue.");
            navigate('/login');
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        try {
            // Call Backend to LOCK seats
            await api.post('/api/seats/lock', {
                showTimeId: parseInt(showTimeId),
                userId: user.id,
                seatLabels: selectedSeats
            });

            // If successful, navigate to payment
            // Pass necessary data to payment page
            navigate('/payment', {
                state: {
                    bookingData: {
                        showTimeId,
                        seats: selectedSeats.join(","),
                        amount: totalPrice,
                        eventTitle: showTime?.event?.title,
                        showDate: showTime?.showDate,
                        showTime: showTime?.showTime
                    }
                }
            });

        } catch (error) {
            console.error("Lock error", error);
            alert(error.response?.data || "Someone just took those seats! Please choose others.");
            // Force refresh layout immediately
            const res = await api.get(`/api/seats/layout/${showTimeId}`);
            setSeats(res.data);
            // Clear invalid selection
            setSelectedSeats([]);
            setTotalPrice(0);
        }
    };

    if (loading) return <Loader />;
    if (!showTime) return <div className="text-center mt-10">Showtime not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Info */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{showTime.event.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    {showTime.showDate} at {showTime.showTime} | {showTime.event.location}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Seat Grid */}
                <div className="flex-1">
                    <SeatSelection 
                        rows={showTime.event.totalRows || 10}
                        cols={showTime.event.totalCols || 12}
                        occupiedSeats={getOccupiedSeats()} 
                        selectedSeats={selectedSeats}
                        onSeatClick={handleSeatClick}
                        seatConfig={showTime.event.seatConfig}
                    />
                </div>

                {/* Right: Summary Panel */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Screen</span>
                                <span className="font-medium dark:text-gray-200">Screen 1 (Standard)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Seats</span>
                                <span className="font-medium dark:text-gray-200 break-words w-1/2 text-right">
                                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Quantity</span>
                                <span className="font-medium dark:text-gray-200">{selectedSeats.length}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 dark:border-gray-600 my-4"></div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
                        </div>

                        <button
                            onClick={handleProceed}
                            disabled={selectedSeats.length === 0}
                            className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${
                                selectedSeats.length === 0 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            Confirm Selection
                        </button>
                        
                        <p className="text-xs text-center text-gray-400 mt-4">
                            Seats are locked for 10 mins once you proceed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelectionPage;