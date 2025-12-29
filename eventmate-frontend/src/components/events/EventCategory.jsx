import React from 'react';

const EventCategory = ({ name }) => {
  // Define colors based on category names if you want variety
  const colors = {
    Music: "bg-purple-100 text-purple-600",
    Technology: "bg-blue-100 text-blue-600",
    Workshop: "bg-green-100 text-green-600",
    Business: "bg-gray-100 text-gray-600",
    default: "bg-blue-100 text-blue-600"
  };

  const colorClass = colors[name] || colors.default;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {name}
    </span>
  );
};

export default EventCategory;