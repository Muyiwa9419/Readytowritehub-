
import React, { useState, useRef } from 'react';

const SOUNDS = [
  { id: 'rain', name: 'Midnight Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', icon: '🌧️' }, // Placeholder URLs
  { id: 'waves', name: 'Quiet Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', icon: '🌊' },
  { id: 'fire', name: 'Soft Ember', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', icon: '🔥' }
];

const AmbientSoundscape: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.4);
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
      <div className={`glass-card p-4 rounded-[2rem] border border-white/10 transition-all duration-500 overflow-hidden ${isOpen ? 'w-64 h-auto' : 'w-14 h-14'}`}>
        {!isOpen ? (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-6 h-6 flex items-center justify-center text-indigo-300 hover:text-white transition-colors"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Atmosphere</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {SOUNDS.map(sound => (
                <button 
                  key={sound.id}
                  onClick={() => toggleSound(sound.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${activeSound === sound.id ? 'bg-indigo-500/20 border-indigo-500/40 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}
                >
                  <span className="text-lg">{sound.icon}</span>
                  <span className="text-xs font-medium">{sound.name}</span>
                  {activeSound === sound.id && (
                    <div className="ml-auto flex gap-0.5">
                      <div className="w-0.5 h-2 bg-indigo-400 animate-pulse" />
                      <div className="w-0.5 h-3 bg-indigo-400 animate-pulse delay-75" />
                      <div className="w-0.5 h-1.5 bg-indigo-400 animate-pulse delay-150" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  if (audioRef.current) audioRef.current.volume = v;
                }}
                className="w-full accent-indigo-500 bg-white/10 h-1 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      <audio ref={audioRef} loop />
    </div>
  );
};

export default AmbientSoundscape;
