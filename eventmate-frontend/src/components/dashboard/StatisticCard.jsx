import React from 'react';

const StatisticCard = ({ title, value, increase, color, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-2">{value}</h3>
        <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold ${color}`}>
          {increase}
        </div>
      </div>
      {/* Optional Icon Placeholder */}
      <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('100', '50')} opacity-80`}>
         {icon}
      </div>
    </div>
  );
};

export default StatisticCard;