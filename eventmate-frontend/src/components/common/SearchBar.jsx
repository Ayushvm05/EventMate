import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      // Redirect to the Events page with the search query in the URL
      navigate(`/events?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-2xl bg-white rounded-full shadow-lg overflow-hidden p-1">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for events, concerts, workshops..." 
        className="w-full px-6 py-3 text-gray-700 outline-none"
      />
      <button 
        onClick={handleSearch}
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;