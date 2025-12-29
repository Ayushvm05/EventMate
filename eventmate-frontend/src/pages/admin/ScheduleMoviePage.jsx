import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa'; // ✅ Imported Delete Icon

const ScheduleMoviePage = () => {
  const { id } = useParams(); // Event ID
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [halls, setHalls] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  
  // Form State
  const [selectedHall, setSelectedHall] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
        const [movieRes, hallRes, showRes] = await Promise.all([
            api.get(`/api/events/${id}`),
            api.get('/api/halls/my-halls'),
            api.get(`/api/showtimes/event/${id}`)
        ]);
        setMovie(movieRes.data);
        setHalls(hallRes.data);
        setShowtimes(showRes.data);
    } catch (error) {
        toast.error("Failed to load data.");
        console.error(error);
    }
  };

  const handleAddShowtime = async (e) => {
    e.preventDefault();
    if(!selectedHall || !date || !time) {
        toast.error("Please fill all fields");
        return;
    }

    setLoading(true);
    try {
        const payload = {
            eventId: id,
            hallId: selectedHall,
            showDate: date,
            showTime: time + ":00" // Ensure HH:mm:ss format
        };

        const response = await api.post('/api/showtimes/create', payload);
        setShowtimes([...showtimes, response.data]);
        toast.success("Showtime Added!");
        
        // Reset Time only (keep Hall/Date for ease of adding multiple)
        setTime('');
    } catch (error) {
        console.error("Add showtime failed", error);
        toast.error("Failed to add showtime.");
    } finally {
        setLoading(false);
    }
  };

  // ✅ NEW: Delete Showtime Function
  const handleDeleteShowtime = async (showId) => {
      if(!window.confirm("Are you sure you want to delete this showtime?")) return;

      try {
          await api.delete(`/api/showtimes/${showId}`);
          // Remove from UI immediately
          setShowtimes(showtimes.filter(show => show.id !== showId));
          toast.success("Showtime deleted successfully");
      } catch (error) {
          console.error("Delete failed", error);
          toast.error("Failed to delete showtime");
      }
  };

  if (!movie) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Schedule Movie</h1>
            <p className="text-gray-500">Managing shows for: <span className="text-blue-600 font-bold">{movie.title}</span></p>
        </div>
        <button onClick={() => navigate('/admin/events')} className="text-gray-500 hover:text-gray-700">
            &larr; Back to Events
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Add Schedule Form */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Add Showtime</h3>
                <form onSubmit={handleAddShowtime} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Select Screen</label>
                        <select 
                            value={selectedHall} 
                            onChange={(e) => setSelectedHall(e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white"
                            required
                        >
                            <option value="">-- Choose Hall --</option>
                            {halls.map(hall => (
                                <option key={hall.id} value={hall.id}>
                                    {hall.name} ({hall.totalCapacity} seats)
                                </option>
                            ))}
                        </select>
                        {halls.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">
                                No halls found. <span className="underline cursor-pointer" onClick={() => navigate('/admin/halls')}>Create one here.</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border rounded-lg dark:text-white"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                    >
                        {loading ? "Adding..." : "Add to Schedule"}
                    </button>
                </form>
            </div>
        </div>

        {/* RIGHT: Current Schedule */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Current Schedule</h3>
                    <span className="text-sm text-gray-500">{showtimes.length} Shows Configured</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Screen / Hall</th>
                                <th className="px-6 py-4">Availability</th>
                                {/* ✅ ADDED: Action Column Header */}
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {showtimes.length > 0 ? (
                                showtimes
                                .sort((a,b) => new Date(a.showDate + 'T' + a.showTime) - new Date(b.showDate + 'T' + b.showTime))
                                .map((show) => (
                                    <tr key={show.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {show.showDate}
                                        </td>
                                        <td className="px-6 py-4 text-blue-600 font-bold">
                                            {show.showTime}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {show.hall ? show.hall.name : 'Main Hall'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                                Open
                                            </span>
                                        </td>
                                        {/* ✅ ADDED: Delete Button Cell */}
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleDeleteShowtime(show.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                                title="Delete Showtime"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                        No shows scheduled yet. Add one from the left.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMoviePage;