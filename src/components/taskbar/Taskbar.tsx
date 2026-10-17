import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types/os';
import { Icon } from '../common/Icon';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    openApp,
    focusWindow,
    minimizeWindow,
    isStartMenuOpen,
    toggleStartMenu,
    isActionCenterOpen,
    toggleActionCenter,
    isCalendarOpen,
    toggleCalendar,
    toggleSearch,
    settings,
    updateSettings,
    cloudSpecs,
  } = useOS();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const PINNED_TASKBAR_APPS: Array<{ id: AppId; icon: string; name: string }> = [
    { id: 'browser', icon: 'compass', name: 'Edge Browser' },
    { id: 'explorer', icon: 'folder', name: 'File Explorer' },
    { id: 'vscode', icon: 'code', name: 'Code Studio' },
    { id: 'terminal', icon: 'terminal', name: 'Terminal' },
    { id: 'taskmanager', icon: 'activity', name: 'Task Manager' },
    { id: 'notepad', icon: 'file-text', name: 'Notepad' },
  ];

  const handleTaskbarAppClick = (appId: AppId) => {
    const existing = windows.find((w) => w.appId === appId);
    if (!existing) {
      openApp(appId);
    } else {
      if (existing.id === activeWindowId && !existing.isMinimized) {
        minimizeWindow(existing.id);
      } else {
        focusWindow(existing.id);
      }
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-0 inset-x-0 h-12 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-800/80 z-40 flex items-center justify-between px-2 sm:px-3 select-none text-xs text-white"
    >
      {/* Left Widget / Cloud Specs Indicator */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleActionCenter}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-300"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px] text-slate-200">
            {cloudSpecs.virtualRamGb}GB Cloud RAM
          </span>
          <span className="text-[10px] text-slate-500">| 0% Phone Load</span>
        </button>
      </div>

      {/* Center Windows Icons */}
      <div className="flex items-center gap-1 sm:gap-1.5 mx-auto">
        {/* Start Button */}
        <button
          onClick={toggleStartMenu}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
            isStartMenuOpen
              ? 'bg-sky-600/30 text-sky-400 ring-1 ring-sky-500 shadow-md'
              : 'hover:bg-slate-800/80 text-sky-400 active:scale-95'
          }`}
          title="Start"
        >
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-sky-400 rounded-[1px]" />
            <div className="bg-sky-400 rounded-[1px]" />
            <div className="bg-sky-400 rounded-[1px]" />
            <div className="bg-sky-400 rounded-[1px]" />
          </div>
        </button>

        {/* Search */}
        <button
          onClick={toggleStartMenu}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-800/80 text-slate-300 transition-colors"
          title="Search"
        >
          <Icon name="search" size={17} />
        </button>

        {/* Pinned & Open Apps */}
        {PINNED_TASKBAR_APPS.map((app) => {
          const matchingWindow = windows.find((w) => w.appId === app.id);
          const isOpen = Boolean(matchingWindow);
          const isActive = matchingWindow?.id === activeWindowId && !matchingWindow.isMinimized;

          return (
            <button
              key={app.id}
              onClick={() => handleTaskbarAppClick(app.id)}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-slate-800/90 text-white'
                  : isOpen
                  ? 'bg-slate-900/60 text-slate-200 hover:bg-slate-800/60'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
              title={app.name}
            >
              <Icon
                name={app.icon}
                size={18}
                className={
                  app.id === 'browser'
                    ? 'text-sky-400'
                    : app.id === 'vscode'
                    ? 'text-blue-400'
                    : app.id === 'explorer'
                    ? 'text-amber-400'
                    : 'text-slate-300'
                }
              />

              {/* Active Indicator Pill */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 h-1 rounded-full transition-all ${
                    isActive ? 'w-4 bg-sky-500' : 'w-1.5 bg-slate-500'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right System Tray */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Mobile Trackpad Shortcut Button */}
        <button
          onClick={() =>
            updateSettings({ mobileTrackpadEnabled: !settings.mobileTrackpadEnabled })
          }
          className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            settings.mobileTrackpadEnabled
              ? 'bg-indigo-600 text-white shadow'
              : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
          title="Toggle Mobile Virtual Trackpad"
        >
          <Icon name="trackpad" size={15} />
          <span className="hidden sm:inline text-[11px] font-medium">Trackpad</span>
        </button>

        {/* Quick Settings (Wi-Fi, Audio, Battery) */}
        <button
          onClick={toggleActionCenter}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
            isActionCenterOpen
              ? 'bg-slate-800 text-sky-400'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
          title="Quick Settings"
        >
          <Icon name="wifi" size={14} className={settings.wifiConnected ? 'text-sky-400' : 'text-slate-500'} />
          <Icon name={settings.volume === 0 ? 'mute' : 'volume'} size={14} />
          <Icon name="battery" size={14} className="text-emerald-400" />
        </button>

        {/* Clock & Date */}
        <button
          onClick={toggleCalendar}
          className={`flex flex-col items-end px-2 py-1 rounded-lg transition-colors text-right leading-tight ${
            isCalendarOpen
              ? 'bg-slate-800 text-sky-400'
              : 'hover:bg-slate-800/80 text-slate-200'
          }`}
          title="Clock & Calendar"
        >
          <span className="text-[11px] font-semibold font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[10px] text-slate-400">
            {time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </span>
        </button>

        {/* Desktop Peek / Show Desktop Button */}
        <div
          onClick={() => {
            windows.forEach((w) => {
              if (!w.isMinimized) minimizeWindow(w.id);
            });
          }}
          className="w-1 h-8 rounded-full bg-slate-800 hover:bg-slate-600 cursor-pointer ml-1"
          title="Show Desktop"
        />
      </div>
    </div>
  );
};
