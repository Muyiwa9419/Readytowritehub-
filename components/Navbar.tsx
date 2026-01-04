
import React, { useState } from 'react';
import Logo from './Logo.tsx';
import MoonWidget from './MoonWidget.tsx';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  onToggleTheme?: () => void;
  isDayMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onToggleTheme, isDayMode }) => {
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
        <Logo className={`h-8 w-8 md:h-10 md:w-10 transition-transform duration-500 group-hover:rotate-12 ${isDayMode ? 'text-indigo-600' : 'text-indigo-400'}`} />
        <div>
          <h1 className={`text-lg md:text-xl font-bold tracking-tight leading-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>readytowritehub</h1>
          <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium ${isDayMode ? 'text-indigo-600/60' : 'text-indigo-300/60'}`}>The Quiet Space</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onToggleTheme}
          className={`p-2 rounded-full transition-all border ${isDayMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white/5 border-white/10 text-indigo-300'}`}
          title={isDayMode ? "Switch to Night" : "Switch to Day"}
        >
          {isDayMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        <div className="hidden sm:block">
          <MoonWidget />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => handleNavClick('landing')}
            className={`text-sm font-medium transition-colors ${currentView === 'landing' ? (isDayMode ? 'text-indigo-600' : 'text-indigo-400') : (isDayMode ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-white')}`}
          >
            Welcome
          </button>
          <button 
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium transition-colors ${currentView === 'home' ? (isDayMode ? 'text-indigo-600' : 'text-indigo-400') : (isDayMode ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-white')}`}
          >
            The Feed
          </button>
          <button 
            onClick={scrollToLibrary}
            className={`text-sm font-medium transition-colors ${isDayMode ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-indigo-300'}`}
          >
            Library
          </button>
          <button 
            onClick={() => handleNavClick('author')}
            className={`text-sm font-medium transition-colors ${currentView === 'author' ? (isDayMode ? 'text-indigo-600' : 'text-indigo-400') : (isDayMode ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-white')}`}
          >
            The Scribe
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`lg:hidden p-2 focus:outline-none transition-colors ${isDayMode ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-400 hover:text-white'}`}
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
        <div className={`lg:hidden absolute top-full left-0 right-0 border-t animate-in fade-in slide-in-from-top-4 duration-300 p-8 flex flex-col gap-8 items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${isDayMode ? 'bg-white border-slate-100' : 'bg-slate-950 border-white/10'}`}>
          <button onClick={() => handleNavClick('landing')} className={`text-xl font-medium transition-colors ${currentView === 'landing' ? 'text-indigo-600' : (isDayMode ? 'text-slate-700' : 'text-slate-300')}`}>Welcome</button>
          <button onClick={() => handleNavClick('home')} className={`text-xl font-medium transition-colors ${currentView === 'home' ? 'text-indigo-600' : (isDayMode ? 'text-slate-700' : 'text-slate-300')}`}>The Feed</button>
          <button onClick={scrollToLibrary} className={`text-xl font-medium transition-colors ${isDayMode ? 'text-slate-700' : 'text-slate-300'}`}>Library</button>
          <button onClick={() => handleNavClick('author')} className={`text-xl font-medium transition-colors ${currentView === 'author' ? 'text-indigo-600' : (isDayMode ? 'text-slate-700' : 'text-slate-300')}`}>The Scribe</button>
          <div className="pt-6 sm:hidden w-full flex justify-center border-t border-white/5">
            <MoonWidget />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
