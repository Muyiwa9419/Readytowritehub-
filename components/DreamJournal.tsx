
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
        className="fixed bottom-6 right-6 md:bottom-8 md:right-24 z-[90] p-4 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 shadow-2xl hover:scale-110 transition-all group"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 group-hover:rotate-12 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Dream Journal</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in duration-300 backdrop-blur-sm bg-slate-950/40">
          <div className="glass-card w-full max-w-lg rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Dream Journal</h3>
                <p className="text-slate-500 text-[10px] md:text-xs italic">Capture the whisper before it fades.</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start writing..."
              className="w-full h-[50vh] md:h-80 bg-white/5 border border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all serif italic leading-relaxed text-base md:text-lg"
            />

            <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-2 justify-between items-start md:items-center text-[9px] md:text-[10px] uppercase tracking-widest font-bold">
              <span className="text-slate-600">Saved locally</span>
              <span className="text-indigo-400/60">{note.length} characters whispered</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DreamJournal;
