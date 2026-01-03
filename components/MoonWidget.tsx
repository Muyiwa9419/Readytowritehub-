
import React, { useMemo } from 'react';
import { getMoonPhase } from '../utils/moonUtils';

const MoonWidget: React.FC = () => {
  const moon = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 group cursor-default">
      <span className="text-xl group-hover:scale-110 transition-transform duration-500">{moon.icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-400 leading-none">Lunar Phase</span>
        <span className="text-[10px] font-medium text-slate-300 tracking-tight">{moon.name}</span>
      </div>
      {moon.name === "Full Moon" && (
        <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse ml-1" />
      )}
    </div>
  );
};

export default MoonWidget;
