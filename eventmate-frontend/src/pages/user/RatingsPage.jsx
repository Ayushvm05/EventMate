import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RatingsPage = () => {
  const { id } = useParams(); // This is the Event ID (or Booking ID depending on your router, usually Event ID for reviews)
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // 🚀 CALL BACKEND
        await api.post('/api/reviews/add', {
            eventId: id, // Ensure this matches the ID from URL
            rating: rating,
            comment: review
        });

        alert("Thank you! Your review has been submitted. 🌟");
        navigate('/dashboard'); 

    } catch (error) {
        console.error("Review failed:", error);
        alert("Failed to submit review. Have you booked this event?");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full border border-gray-100 dark:border-gray-700">
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">Write a Review</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          How was your experience? Your feedback helps others.
        </p>

        <form onSubmit={handleSubmit}>
          
          {/* Star Rating Section */}
          <div className="flex justify-center space-x-4 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Review Text Area */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Your Comments
            </label>
            <textarea
              rows="5"
              className="w-full border dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Tell us what you liked or didn't like..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 py-3 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={rating === 0}
              className={`w-1/2 py-3 rounded-lg font-bold text-white transition shadow-md ${
                rating === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Submit Review
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RatingsPage;