
import React, { useMemo } from 'react';
import { getMoonPhase } from '../views/services/moonUtils.ts';

const MoonWidget: React.FC = () => {
  const moon = useMemo(() => getMoonPhase(new Date()), []);

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-full group cursor-default shadow-sm hover:shadow-md transition-shadow">
      <span className="text-xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">{moon.icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-600 leading-none">Lunar Phase</span>
        <span className="text-[10px] font-bold text-slate-600 tracking-tight">{moon.name}</span>
      </div>
      {moon.name === "Full Moon" && (
        <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse ml-1" />
      )}
    </div>
  );
};

export default MoonWidget;
