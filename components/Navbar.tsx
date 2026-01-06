
import React, { useState } from 'react';
import Logo from './Logo.tsx';
import GreetingWidget from './GreetingWidget.tsx';
import { View } from '../types.ts';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  logoUrl?: string;
  siteName: string;
  tagline: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, logoUrl, siteName, tagline }) => {
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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card px-4 md:px-8 py-4 md:py-5 flex items-center justify-between transition-all bg-white/70 shadow-lg shadow-slate-200/20 border-b border-slate-100/50">
      <div 
        className="flex items-center gap-3 md:gap-4 cursor-pointer group"
        onClick={() => handleNavClick('landing')}
      >
        <Logo className={`h-10 w-10 md:h-12 md:w-12 transition-transform duration-500 group-hover:rotate-12`} src={logoUrl} />
        <div>
          <h1 className={`text-lg md:text-2xl font-bold tracking-tighter leading-tight text-slate-900 uppercase`}>{siteName}</h1>
          <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-indigo-600/60`}>{tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 md:gap-10">
        <div className="hidden sm:block">
          <GreetingWidget />
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => handleNavClick('landing')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'landing' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            Origins
          </button>
          <button 
            onClick={() => handleNavClick('home')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            The Feed
          </button>
          <button 
            onClick={scrollToLibrary}
            className={`text-xs font-bold uppercase tracking-widest transition-colors text-slate-400 hover:text-indigo-600`}
          >
            Library
          </button>
          <button 
            onClick={() => handleNavClick('author')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'author' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            The Scribe
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`lg:hidden p-2 focus:outline-none transition-colors text-slate-400 hover:text-slate-900`}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 border-t animate-in fade-in slide-in-from-top-4 duration-300 p-10 flex flex-col gap-10 items-center text-center shadow-2xl bg-white border-slate-100`}>
          <button onClick={() => handleNavClick('landing')} className={`text-xl font-bold uppercase tracking-[0.2em] transition-colors ${currentView === 'landing' ? 'text-indigo-600' : 'text-slate-400'}`}>Origins</button>
          <button onClick={() => handleNavClick('home')} className={`text-xl font-bold uppercase tracking-[0.2em] transition-colors ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>The Feed</button>
          <button onClick={scrollToLibrary} className={`text-xl font-bold uppercase tracking-[0.2em] transition-colors text-slate-400`}>Library</button>
          <button onClick={() => handleNavClick('author')} className={`text-xl font-bold uppercase tracking-[0.2em] transition-colors ${currentView === 'author' ? 'text-indigo-600' : 'text-slate-400'}`}>The Scribe</button>
          <div className="pt-8 sm:hidden w-full flex justify-center border-t border-slate-50">
            <GreetingWidget />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
