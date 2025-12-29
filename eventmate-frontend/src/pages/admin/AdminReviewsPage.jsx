import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaStar, FaTrash, FaUser, FaCalendar } from 'react-icons/fa';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/api/reviews/all');
      // Sort by newest first
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sorted);
    } catch (error) {
      console.error("Failed to load reviews", error);
      toast.error("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success("Review deleted successfully");
      // Remove from UI immediately
      setReviews(reviews.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete review", error);
      toast.error("Failed to delete review.");
    }
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return <span className="text-gray-400 text-xs">N/A</span>;
    const s = sentiment.toUpperCase();
    
    if (s.includes("POSITIVE")) return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">😊 Positive</span>;
    if (s.includes("NEGATIVE")) return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">😞 Negative</span>;
    return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">😐 Neutral</span>;
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Reviews...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Review Management</h1>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
          Total Reviews: {reviews.length}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 w-1/3">Comment</th>
                <th className="px-6 py-4">Sentiment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><FaUser size={12}/></div>
                            <span className="font-medium text-gray-900 dark:text-white text-sm">{review.user?.name || "Unknown"}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {review.event?.title || "Deleted Event"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 italic">
                      "{review.content}"
                    </td>
                    <td className="px-6 py-4">
                        {getSentimentBadge(review.sentiment)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    No reviews found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;