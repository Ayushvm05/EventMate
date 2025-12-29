import React from 'react';

const Logo = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      fill="none" 
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" /> {/* Blue-500 */}
          <stop offset="100%" stopColor="#8B5CF6" /> {/* Violet-500 */}
        </linearGradient>
      </defs>
      
      {/* Modern Geometric Star / Spark Shape */}
      <path 
        d="M50 0 
           C60 35 65 40 100 50 
           C65 60 60 65 50 100 
           C40 65 35 60 0 50 
           C35 40 40 35 50 0 Z" 
        fill="url(#logoGradient)" 
      />
      
      {/* Optional: Inner accent for depth */}
      <circle cx="50" cy="50" r="10" fill="white" fillOpacity="0.2" />
    </svg>
  );
};

export default Logo;