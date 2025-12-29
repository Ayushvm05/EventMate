import React from 'react';

const RatingStars = ({ rating }) => {
  // Create an array of 5 elements
  const stars = [...Array(5)];

  return (
    <div className="flex items-center text-yellow-400">
      {stars.map((_, index) => {
        const starValue = index + 1;
        return (
          <svg 
            key={index} 
            className={`w-5 h-5 ${starValue <= rating ? 'fill-current' : 'text-gray-300 fill-current'}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
      <span className="ml-2 text-gray-600 text-sm">({rating} / 5)</span>
    </div>
  );
};

export default RatingStars;