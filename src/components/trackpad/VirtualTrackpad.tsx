import React, { useRef, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const VirtualTrackpad: React.FC = () => {
  const {
    settings,
    updateSettings,
    virtualCursor,
    setVirtualCursor,
    triggerVirtualClick,
  } = useOS();

  const [position, setPosition] = useState({ x: 16, y: 80 });
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  if (!settings.mobileTrackpadEnabled) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    lastTouch.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!lastTouch.current) return;
    const touch = e.touches[0];
    const dx = (touch.clientX - lastTouch.current.x) * (settings.mouseSpeed || 1.2);
    const dy = (touch.clientY - lastTouch.current.y) * (settings.mouseSpeed || 1.2);

    lastTouch.current = { x: touch.clientX, y: touch.clientY };

    setVirtualCursor((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(window.innerWidth - 8, prev.x + dx)),
      y: Math.max(0, Math.min(window.innerHeight - 8, prev.y + dy)),
    }));
  };

  const handleTouchEnd = () => {
    lastTouch.current = null;
  };

  return (
    <>
      {/* On-Screen Virtual Mouse Pointer */}
      <div
        style={{
          left: `${virtualCursor.x}px`,
          top: `${virtualCursor.y}px`,
          pointerEvents: 'none',
        }}
        className="fixed z-[9999] transition-transform duration-75"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter"
        >
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Floating Trackpad Container */}
      <div
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[9990] w-64 bg-slate-900/95 border-2 border-sky-500/60 rounded-2xl shadow-2xl backdrop-blur-2xl p-2.5 flex flex-col gap-2 select-none"
      >
        {/* Trackpad Titlebar */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold text-sky-400">
            <Icon name="trackpad" size={14} />
            <span>Virtual PC Trackpad</span>
          </div>
          <button
            onClick={() => updateSettings({ mobileTrackpadEnabled: false })}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Close Trackpad"
          >
            <Icon name="close" size={13} />
          </button>
        </div>

        {/* Touch Sensitivity Surface */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-28 bg-slate-950/90 border border-slate-700/80 rounded-xl flex items-center justify-center text-slate-500 text-[11px] touch-none cursor-pointer active:bg-slate-950"
        >
          <div className="text-center pointer-events-none">
            <span className="block opacity-60">Slide finger to move mouse</span>
            <span className="text-[10px] text-sky-400 font-mono">
              X: {Math.round(virtualCursor.x)} · Y: {Math.round(virtualCursor.y)}
            </span>
          </div>
        </div>

        {/* Left & Right Physical Buttons */}
        <div className="grid grid-cols-2 gap-2 h-11">
          <button
            onClick={() => triggerVirtualClick('left')}
            className="w-full bg-slate-800 hover:bg-slate-700 active:bg-sky-600 rounded-xl border border-slate-700 active:border-sky-400 text-xs font-semibold text-white shadow transition-all active:scale-95"
          >
            Left Click
          </button>
          <button
            onClick={() => triggerVirtualClick('right')}
            className="w-full bg-slate-800 hover:bg-slate-700 active:bg-sky-600 rounded-xl border border-slate-700 active:border-sky-400 text-xs font-semibold text-white shadow transition-all active:scale-95"
          >
            Right Click
          </button>
        </div>
      </div>
    </>
  );
};
