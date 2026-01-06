
import React, { useState, useRef } from 'react';

const SOUNDS = [
  { id: 'rain', name: 'Early Mist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', icon: '🌫️' },
  { id: 'waves', name: 'Morning Shore', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', icon: '🌊' },
  { id: 'fire', name: 'Soft Light', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: '✨' }
];

const AmbientSoundscape: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = (id: string) => {
    if (activeSound === id) {
      audioRef.current?.pause();
      setActiveSound(null);
    } else {
      setActiveSound(id);
      if (audioRef.current) {
        audioRef.current.src = SOUNDS.find(s => s.id === id)?.url || '';
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]">
      <div className={`glass-card p-4 rounded-[2.5rem] border border-slate-200 transition-all duration-700 overflow-hidden bg-white/80 shadow-2xl ${isOpen ? 'w-72 h-auto' : 'w-14 h-14'}`}>
        {!isOpen ? (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors mx-auto mt-0"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500 p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">Atmosphere</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {SOUNDS.map(sound => (
                <button 
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all duration-300 ${activeSound === sound.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  <span className="text-xl">{sound.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-widest">{sound.name}</span>
                  {activeSound === sound.id && (
                    <div className="ml-auto flex gap-1 items-end h-4">
                      <div className="w-1 h-2 bg-white/60 animate-bounce" />
                      <div className="w-1 h-3 bg-white/60 animate-bounce delay-100" />
                      <div className="w-1 h-1.5 bg-white/60 animate-bounce delay-200" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3">
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">VOL</span>
                 <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="w-full accent-indigo-600 bg-slate-100 h-1.5 rounded-lg cursor-pointer transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <audio ref={audioRef} loop />
    </div>
  );
};

export default AmbientSoundscape;
