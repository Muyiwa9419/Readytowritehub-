
import React from 'react';

interface LogoProps {
  className?: string;
  src?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8", src }) => {
  // Fallback to a default thematic image if no src is provided
  const defaultLogo = "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=200";
  
  return (
    <div className={`${className} rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-slate-900 shadow-lg`}>
      <img 
        src={src || defaultLogo} 
        alt="Hub Logo" 
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultLogo;
        }}
      />
    </div>
  );
};

export default Logo;
