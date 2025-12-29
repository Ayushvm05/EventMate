import React from 'react';

const RevenueChart = () => {
  // Mock Data for the graph
  const data = [40, 70, 45, 90, 60, 80, 50]; 
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Revenue Analytics</h3>
      
      {/* Chart Container */}
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.map((height, index) => (
          <div key={index} className="flex flex-col items-center flex-1 group">
            
            {/* Tooltip on hover */}
            <div className="opacity-0 group-hover:opacity-100 mb-2 text-xs bg-gray-800 text-white p-1 rounded transition">
              ${height * 100}
            </div>

            {/* The Bar */}
            <div 
              className="w-full bg-blue-100 hover:bg-blue-500 rounded-t transition-all duration-300 relative"
              style={{ height: `${height}%` }}
            ></div>
            
            {/* The Label */}
            <p className="text-xs text-gray-500 mt-2">{days[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;