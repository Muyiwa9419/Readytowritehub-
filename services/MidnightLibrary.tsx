
import React, { useState, useEffect } from 'react';
import { fetchMidnightRead } from '../views/services/geminiService.ts';

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
      console.error("Failed book fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNewRecommendation();
  }, []);

  return (
    <section id="library" className="relative">
      <div className="glass-card rounded-[2.5rem] border border-slate-100 p-8 md:p-12 overflow-hidden relative group bg-white/90 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
          <div className="w-full md:w-1/3 aspect-[3/4] bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center p-8 text-center relative shadow-xl overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse bg-slate-50" />
            ) : (
              <div className="relative z-10 space-y-4">
                <span className="text-4xl block">📖</span>
                <h4 className="text-slate-900 font-bold text-lg leading-tight">{book?.title}</h4>
                <p className="text-slate-400 text-[10px] uppercase font-bold">{book?.author}</p>
                <span className="inline-block text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{book?.sleepyRating}</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-600">Morning Library</span>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Recommended Free Reading</h3>
            </div>
            
            <p className="text-slate-500 text-base md:text-lg serif italic leading-relaxed">
              "{book?.reason}"
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a 
                href={book?.readUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all text-sm uppercase tracking-widest"
              >
                Read for Free
              </a>
              <button 
                onClick={getNewRecommendation}
                className="text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
              >
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
