import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa'; // ✅ Imported Icons

const HallManagementPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ NEW: State for editing mode
  const [editingHallId, setEditingHallId] = useState(null);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const response = await api.get('/api/halls/my-halls');
      setHalls(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch halls", error);
      toast.error("Failed to load cinema halls.");
      setLoading(false);
    }
  };

  // ✅ NEW: Handle Edit Click
  const handleEditClick = (hall) => {
      setName(hall.name);
      setRows(hall.totalRows);
      setCols(hall.totalCols);
      setEditingHallId(hall.id); // Set ID to switch form to "Edit Mode"
  };

  // ✅ NEW: Handle Cancel Edit
  const handleCancelEdit = () => {
      setName('');
      setRows(10);
      setCols(15);
      setEditingHallId(null);
  };

  // ✅ NEW: Handle Delete
  const handleDeleteHall = async (id) => {
      if(!window.confirm("Are you sure? This will delete the screen and all associated showtimes.")) return;
      
      try {
          await api.delete(`/api/halls/${id}`);
          setHalls(halls.filter(h => h.id !== id));
          toast.success("Screen deleted successfully.");
      } catch (error) {
          console.error("Delete failed", error);
          toast.error("Failed to delete screen. It might have active bookings.");
      }
  };

  // ✅ UPDATED: Handle Submit (Handles both Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || rows < 1 || cols < 1) {
        toast.error("Please fill in valid details.");
        return;
    }

    setIsSubmitting(true);
    try {
        const payload = {
            name,
            totalRows: parseInt(rows),
            totalCols: parseInt(cols),
            seatConfig: "Standard" 
        };

        if (editingHallId) {
            // Update Logic
            const response = await api.put(`/api/halls/${editingHallId}`, payload);
            setHalls(halls.map(h => h.id === editingHallId ? response.data : h));
            toast.success("Cinema Hall Updated!");
            handleCancelEdit(); // Reset form
        } else {
            // Create Logic
            const response = await api.post('/api/halls/create', payload);
            setHalls([...halls, response.data]);
            toast.success("Cinema Hall Created!");
            // Reset form
            setName('');
            setRows(10);
            setCols(15);
        }
    } catch (error) {
        console.error("Save hall error", error);
        toast.error("Failed to save hall.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Cinema Halls...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Cinema Halls & Screens</h1>
      <p className="text-gray-500 mb-8">Manage your cinema screens and seating layouts.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Create/Edit Hall Form */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    {editingHallId ? "Edit Screen" : "Add New Screen"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Screen Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Screen 1, IMAX Hall" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rows</label>
                            <input 
                                type="number" 
                                min="1"
                                value={rows}
                                onChange={(e) => setRows(e.target.value)}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Columns</label>
                            <input 
                                type="number" 
                                min="1"
                                value={cols}
                                onChange={(e) => setCols(e.target.value)}
                                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                        <strong>Total Capacity:</strong> {rows * cols} Seats
                    </div>

                    <div className="flex gap-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : (editingHallId ? "Update Screen" : "Create Screen")}
                        </button>
                        
                        {/* Cancel Button only shows when editing */}
                        {editingHallId && (
                            <button 
                                type="button" 
                                onClick={handleCancelEdit}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

        {/* RIGHT COLUMN: Existing Halls List */}
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Screens</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Screen Name</th>
                                <th className="px-6 py-4">Layout (R x C)</th>
                                <th className="px-6 py-4">Capacity</th>
                                <th className="px-6 py-4">Status</th>
                                {/* ✅ ADDED: Actions Column */}
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {halls.length > 0 ? (
                                halls.map((hall) => (
                                    <tr key={hall.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-gray-500">#{hall.id}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">{hall.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{hall.totalRows} x {hall.totalCols}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {hall.totalCapacity} Seats
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400 text-sm">Active</span>
                                        </td>
                                        
                                        {/* ✅ ADDED: Actions Buttons */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleEditClick(hall)}
                                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                                                    title="Edit Screen"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteHall(hall.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                                    title="Delete Screen"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No screens added yet. Add one from the left panel.
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

export default HallManagementPage;