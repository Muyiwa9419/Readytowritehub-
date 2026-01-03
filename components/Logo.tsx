
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80 Q 50 20 80 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="40" r="10" fill="currentColor" fillOpacity="0.2" />
    <path d="M40 60 L60 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 70 L55 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="80" cy="20" r="4" fill="#fbbf24" />
  </svg>
);

export default Logo;
