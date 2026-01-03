
import React, { useState, useEffect } from 'react';
import { fetchMidnightRead } from '../services/geminiService.ts';

interface BookRec {
  title: string;
  author: string;
  reason: string;
  readUrl: string;
  sleepyRating: string;
}

const MidnightLibrary: React.FC = () => {
  const [book, setBook] = useState<BookRec | null>(null);
  const [loading, setLoading] = useState(true);

  const getNewRecommendation = async () => {
    setLoading(true);
    try {
      const rec = await fetchMidnightRead();
      setBook(rec);
    } catch (error) {
      console.error("Failed to fetch book recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNewRecommendation();
  }, []);

  return (
    <section id="library" className="relative">
      <div className="absolute -top-12 md:-top-24 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="glass-card rounded-[2rem] md:rounded-[3.5rem] border border-white/5 p-8 md:p-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-600/5 blur-[80px] md:blur-[120px] -z-10 group-hover:bg-indigo-600/10 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Visual Book Placeholder */}
          <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 flex flex-col items-center justify-center p-6 md:p-8 text-center relative shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="w-16 h-24 md:w-24 md:h-32 bg-white/5 rounded mx-auto" />
                <div className="w-16 h-2 bg-white/10 rounded mx-auto" />
              </div>
            ) : (
              <div className="relative z-10 space-y-3 md:space-y-4">
                <span className="text-3xl md:text-4xl mb-2 md:mb-4 block">📖</span>
                <h4 className="text-white font-bold text-base md:text-lg leading-tight">{book?.title}</h4>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">{book?.author}</p>
                <div className="pt-2 md:pt-4">
                   <span className="text-[9px] md:text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                     {book?.sleepyRating}
                   </span>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          </div>

          <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-indigo-400">The Midnight Library</span>
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">Tonight's Free Reading</h3>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
              </div>
            ) : (
              <p className="text-slate-400 text-base md:text-lg serif italic leading-relaxed">
                "{book?.reason}"
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4 justify-center md:justify-start">
              <a 
                href={book?.readUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-3 md:py-4 bg-indigo-500 text-white rounded-full font-bold text-sm md:text-base hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95"
              >
                Read for Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <button 
                onClick={getNewRecommendation}
                className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Shuffle
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MidnightLibrary;
