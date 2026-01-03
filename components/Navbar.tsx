
import React, { useState } from 'react';
import Logo from './Logo.tsx';
import MoonWidget from './MoonWidget.tsx';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToLibrary = () => {
    setIsMenuOpen(false);
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

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => handleNavClick('landing')}
      >
        <Logo className="h-8 w-8 md:h-10 md:w-10 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">readytowritehub</h1>
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-indigo-300/60 font-medium">The Quiet Space</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden sm:block">
          <MoonWidget />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => handleNavClick('landing')}
            className={`text-sm font-medium transition-colors ${currentView === 'landing' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            Welcome
          </button>
          <button 
            onClick={() => handleNavClick('home')}
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
            onClick={() => handleNavClick('author')}
            className={`text-sm font-medium transition-colors ${currentView === 'author' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
          >
            The Scribe
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-2xl border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-300 p-8 flex flex-col gap-8 items-center text-center shadow-2xl">
          <button onClick={() => handleNavClick('landing')} className={`text-xl font-medium ${currentView === 'landing' ? 'text-indigo-400' : 'text-slate-300'}`}>Welcome</button>
          <button onClick={() => handleNavClick('home')} className={`text-xl font-medium ${currentView === 'home' ? 'text-indigo-400' : 'text-slate-300'}`}>The Feed</button>
          <button onClick={scrollToLibrary} className="text-xl font-medium text-slate-300">Library</button>
          <button onClick={() => handleNavClick('author')} className={`text-xl font-medium ${currentView === 'author' ? 'text-indigo-400' : 'text-slate-300'}`}>The Scribe</button>
          <div className="pt-6 sm:hidden w-full flex justify-center border-t border-white/5">
            <MoonWidget />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
