
import React, { useState, useEffect } from 'react';

const DreamJournal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(() => localStorage.getItem('rtwh_dream_note') || '');

  useEffect(() => {
    localStorage.setItem('rtwh_dream_note', note);
  }, [note]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-24 z-[90] p-4 rounded-full bg-white border border-indigo-100 text-indigo-600 shadow-xl hover:scale-110 transition-all group hover:bg-indigo-50"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 group-hover:rotate-12 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-lg">Reflect</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in duration-300 backdrop-blur-md bg-white/20">
          <div className="glass-card w-full max-w-xl rounded-[3rem] border border-slate-200 p-8 md:p-12 relative overflow-hidden bg-white shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-600 to-transparent" />
            
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">The Archive</h3>
                <p className="text-slate-500 text-sm md:text-base serif italic font-medium">Pen your thoughts before the morning fades.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-900 p-2 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start your reflection..."
              className="w-full h-[55vh] md:h-96 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all serif italic leading-relaxed text-lg md:text-xl shadow-inner"
            />

            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Preserved Locally
              </div>
              <span className="text-indigo-600/60 font-mono tracking-normal">{note.length} CHARS WRITTEN</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DreamJournal;
