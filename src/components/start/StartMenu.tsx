import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types/os';
import { Icon } from '../common/Icon';

export const StartMenu: React.FC = () => {
  const {
    openApp,
    closeStartMenu,
    triggerPowerOff,
    triggerRestart,
    cloudSpecs,
  } = useOS();

  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  const PINNED_APPS: Array<{ id: AppId; name: string; icon: string }> = [
    { id: 'browser', name: 'Edge Browser', icon: 'compass' },
    { id: 'explorer', name: 'File Explorer', icon: 'folder' },
    { id: 'vscode', name: 'Code Studio', icon: 'code' },
    { id: 'terminal', name: 'PowerShell', icon: 'terminal' },
    { id: 'taskmanager', name: 'Task Manager', icon: 'activity' },
    { id: 'notepad', name: 'Notepad', icon: 'file-text' },
    { id: 'calculator', name: 'Calculator', icon: 'calculator' },
    { id: 'paint', name: 'Paint Studio', icon: 'palette' },
    { id: 'photos', name: 'Photos', icon: 'photos' },
    { id: 'store', name: 'Microsoft Store', icon: 'shopping-bag' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'game_snake', name: 'Cyber Snake', icon: 'gamepad-2' },
  ];

  const RECENT_FILES = [
    { name: 'Welcome to CloudPC.txt', time: '2m ago', icon: 'file-text' },
    { name: 'Mobile Phone Guide.txt', time: '10m ago', icon: 'file-text' },
    { name: 'app_sample.js', time: '1h ago', icon: 'code' },
    { name: 'Cloud Projects', time: '3h ago', icon: 'folder' },
  ];

  const filteredApps = PINNED_APPS.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[92vw] max-w-[560px] h-[520px] max-h-[85vh] bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 flex flex-col overflow-hidden text-xs text-slate-100 select-none animate-in fade-in slide-in-from-bottom-4 duration-150"
    >
      {/* Search Input Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Type here to search apps, settings, and cloud files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-inner"
            autoFocus
          />
          <Icon name="search" size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
      </div>

      {/* Main Apps Grid Section */}
      <div className="flex-1 px-5 py-3 overflow-y-auto space-y-4">
        {/* Pinned Header */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 text-xs">Pinned Apps</span>
          <span className="text-[11px] text-sky-400 font-medium">All apps ›</span>
        </div>

        {/* Pinned Icons */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                openApp(app.id);
                closeStartMenu();
              }}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-800/80 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800/70 group-hover:scale-105 flex items-center justify-center text-sky-400 shadow transition-transform mb-1.5">
                <Icon name={app.icon} size={22} />
              </div>
              <span className="text-[11px] font-medium text-slate-200 text-center truncate w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Recommended Files */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200 text-xs">Recommended</span>
            <span className="text-[11px] text-slate-400">Cloud Storage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RECENT_FILES.map((f, i) => (
              <button
                key={i}
                onClick={() => {
                  openApp(f.icon === 'code' ? 'vscode' : f.icon === 'folder' ? 'explorer' : 'notepad');
                  closeStartMenu();
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                  <Icon name={f.icon} size={16} />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-slate-200 truncate text-[11px]">{f.name}</div>
                  <div className="text-[10px] text-slate-500">{f.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User & Power Footer */}
      <div className="p-3 px-5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
            H
          </div>
          <div>
            <div className="font-semibold text-white text-xs">Cloud User</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span>● {cloudSpecs.virtualRamGb}GB Cloud RAM</span>
            </div>
          </div>
        </div>

        {/* Power Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowPowerMenu((s) => !s)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Power"
          >
            <Icon name="power" size={17} />
          </button>

          {showPowerMenu && (
            <div className="absolute right-0 bottom-10 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 text-xs space-y-0.5">
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  triggerRestart();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-left text-slate-200"
              >
                <Icon name="refresh" size={14} />
                <span>Restart</span>
              </button>
              <button
                onClick={() => {
                  setShowPowerMenu(false);
                  triggerPowerOff();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white text-left text-red-400"
              >
                <Icon name="power" size={14} />
                <span>Shut Down</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
