
import React from 'react';
import Logo from './Logo.tsx';
import MoonWidget from './MoonWidget.tsx';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const scrollToLibrary = () => {
    if (currentView !== 'home') {
      setView('home');
      setTimeout(() => {
        const el = document.getElementById('library');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('library');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => setView('landing')}
      >
        <Logo className="h-10 w-10 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">readytowritehub</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300/60 font-medium">The Quiet Space</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:block">
          <MoonWidget />
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('landing')}
            className={`text-sm font-medium transition-colors ${currentView === 'landing' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            Welcome
          </button>
          <button 
            onClick={() => setView('home')}
            className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            The Feed
          </button>
          <button 
            onClick={scrollToLibrary}
            className="text-sm font-medium text-slate-400 hover:text-indigo-300 transition-colors"
          >
            Library
          </button>
          <button 
            onClick={() => setView('author')}
            className={`text-sm font-medium transition-colors ${currentView === 'author' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            The Scribe
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
