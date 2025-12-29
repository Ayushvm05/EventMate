import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast'; // ✅ Standard import
import { useAuth } from '../context/AuthContext'; // ✅ Added Auth Context

const ReviewSection = ({ eventId }) => {
  const { user } = useAuth(); // ✅ Get current user
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/api/reviews/event/${eventId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        toast.error("Please log in to submit a review.");
        return;
    }
    if (!newReview.trim()) return;

    setIsSubmitting(true);
    try {
      // 🚀 Post to backend
      const response = await api.post('/api/reviews/create', {
        eventId: eventId,
        content: newReview,
        rating: rating
      });

      toast.success(response.data); // Shows backend message (e.g. "Review posted! Sentiment: POSITIVE")
      setNewReview("");
      setRating(5);
      fetchReviews(); // Refresh list to show new review
    } catch (error) {
      console.error(error);
      // ✅ Feature: Show specific error from backend (e.g., "You must book ticket first")
      const errorMessage = error.response?.data || "Failed to post review.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render sentiment badge
  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return null;
    const s = sentiment.toUpperCase();
    let color = "bg-gray-200 text-gray-800"; // Neutral
    let icon = "😐";

    if (s.includes("POSITIVE")) {
      color = "bg-green-100 text-green-800 border border-green-200";
      icon = "😊";
    } else if (s.includes("NEGATIVE")) {
      color = "bg-red-100 text-red-800 border border-red-200";
      icon = "😞";
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full font-semibold ml-2 ${color}`}>
        {icon} {s}
      </span>
    );
  };

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Reviews & Feedback
      </h3>

      {/* --- Write Review Form (Only if Logged In) --- */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="flex items-center mb-4">
            <span className="mr-3 font-medium text-gray-700 dark:text-gray-300">Your Rating:</span>
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                    <FaStar />
                </button>
                ))}
            </div>
          </div>
          
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder={`How was the event, ${user.name}? Share your experience...`}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            rows="3"
            required
          ></textarea>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white font-bold transition-all ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
              }`}
            >
              {isSubmitting ? "Analyzing..." : "Post Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center border border-blue-100 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-200 mb-2 font-medium">Want to write a review?</p>
            <p className="text-sm text-blue-600 dark:text-blue-300">Please <a href="/login" className="underline font-bold">Log In</a> and ensure you have booked this event.</p>
        </div>
      )}

      {/* --- Review List --- */}
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
             <p className="italic">No reviews yet.</p>
             <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <FaUserCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">
                      {review.user?.name || "Anonymous User"}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      {/* ✨ AI BADGE HERE ✨ */}
                      {getSentimentBadge(review.sentiment)}
                    </div>
                  </div>
                </div>
                {/* Fixed Star Display: Shows 5 stars, filled based on rating */}
                <div className="flex text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;