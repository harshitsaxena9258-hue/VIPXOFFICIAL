import React, { useState, useEffect } from 'react';

export const CalendarFlyout: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Current month days
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = currentTime.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-2 sm:right-4 w-[92vw] max-w-[340px] bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-4 text-xs text-slate-100 select-none animate-in fade-in slide-in-from-bottom-4 duration-150 space-y-4"
    >
      {/* Clock Display */}
      <div className="border-b border-slate-800 pb-3">
        <div className="text-3xl font-bold font-mono tracking-tight text-white">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-xs text-sky-400 font-medium mt-1">
          {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between font-semibold text-slate-200">
        <span>{monthNames[month]} {year}</span>
        <div className="text-[10px] text-slate-400">Windows Calendar</div>
      </div>

      {/* Calendar Days Table */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium">
        {daysOfWeek.map((d) => (
          <div key={d} className="text-slate-500 text-[10px] py-1">
            {d}
          </div>
        ))}

        {/* Empty cells before month starts */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1" />
        ))}

        {/* Month dates */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isToday = dayNum === currentDay;

          return (
            <button
              key={dayNum}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isToday
                  ? 'bg-sky-600 text-white font-bold shadow'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* Cloud Sync Status */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Time Zone: UTC (Cloud Auto-sync)</span>
        <span className="text-emerald-400">● Synced</span>
      </div>
    </div>
  );
};
