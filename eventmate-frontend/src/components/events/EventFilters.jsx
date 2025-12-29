import React from 'react';

const EventFilters = ({ selectedCategory, setSelectedCategory, onReset }) => {
  
  // Matches the list in EventListPage for consistency
  const categories = ["All", "Music", "Technology", "Workshop", "Business", "Sports"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Filters</h3>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="radio" 
                  name="category" 
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all"
                />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100">
                  <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className={`ml-2 text-sm transition-colors ${selectedCategory === cat ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg transition duration-200"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default EventFilters;