
import React, { useMemo } from 'react';

const GreetingWidget: React.FC = () => {
  const timeData = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: "Good Morning", icon: "☀️", label: "Golden Hour" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good Afternoon", icon: "☁️", label: "Daylight" };
    } else {
      return { greeting: "Good Night", icon: "🌙", label: "Quiet Hours" };
    }
  }, []);

  return (
    <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-100 rounded-full group cursor-default shadow-sm hover:shadow-md transition-shadow">
      <span className="text-xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">{timeData.icon}</span>
      <div className="flex flex-col">
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-indigo-600 leading-none">{timeData.label}</span>
        <span className="text-[10px] font-bold text-slate-600 tracking-tight">{timeData.greeting}</span>
      </div>
    </div>
  );
};

export default GreetingWidget;
