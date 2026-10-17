import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types/os';
import { Icon } from '../common/Icon';

interface StoreAppItem {
  id: AppId;
  name: string;
  category: string;
  description: string;
  rating: number;
  sizeMb: number;
  icon: string;
  installed: boolean;
}

export const StoreApp: React.FC = () => {
  const { openApp, addNotification } = useOS();
  const [apps, setApps] = useState<StoreAppItem[]>([
    {
      id: 'browser',
      name: 'Cloud Edge Browser',
      category: 'Productivity',
      description: 'Ultra-fast web browsing with 980 Mbps Gigabit bandwidth and isolated security sandbox.',
      rating: 4.9,
      sizeMb: 120,
      icon: 'compass',
      installed: true,
    },
    {
      id: 'vscode',
      name: 'Cloud Code Studio',
      category: 'Developer Tools',
      description: 'Full IDE with multi-file code editing, JavaScript sandbox runner, and Cloud Drive syncing.',
      rating: 4.9,
      sizeMb: 240,
      icon: 'code',
      installed: true,
    },
    {
      id: 'terminal',
      name: 'Windows PowerShell & CMD',
      category: 'System Tools',
      description: 'Real virtual command shell with directory management, networking, and system diagnostics.',
      rating: 4.8,
      sizeMb: 45,
      icon: 'terminal',
      installed: true,
    },
    {
      id: 'paint',
      name: 'Paint 3D Studio',
      category: 'Creativity',
      description: 'Canvas drawing, custom brushes, color palettes, and direct cloud artwork export.',
      rating: 4.7,
      sizeMb: 65,
      icon: 'palette',
      installed: true,
    },
    {
      id: 'game_snake',
      name: 'Retro Cyber Snake',
      category: 'Games',
      description: 'Classic snake arcade game with touchscreen virtual D-pad and high-score tracker.',
      rating: 4.8,
      sizeMb: 12,
      icon: 'gamepad-2',
      installed: true,
    },
    {
      id: 'game_minesweeper',
      name: 'Minesweeper Classic',
      category: 'Games',
      description: 'The legendary puzzle game with LCD timer, flag marks, and sound effects.',
      rating: 4.6,
      sizeMb: 8,
      icon: 'bomb',
      installed: true,
    },
  ]);

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Productivity', 'Developer Tools', 'Creativity', 'Games', 'System Tools'];

  const filteredApps = apps.filter(
    (a) => activeCategory === 'All' || a.category === activeCategory
  );

  const handleLaunchOrInstall = (app: StoreAppItem) => {
    if (app.installed) {
      openApp(app.id);
    } else {
      setApps((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, installed: true } : a))
      );
      confetti({ particleCount: 40, spread: 60 });
      addNotification('App Installed', `Installed "${app.name}" to Cloud Drive.`);
      openApp(app.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none text-xs">
      {/* Top Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/60 via-sky-900/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white mb-0.5">Microsoft Cloud Store</h2>
          <p className="text-slate-400 text-xs">
            100% Free Virtual Apps & Games · Instant Cloud Deployment
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800 text-[11px] text-emerald-400">
          <Icon name="check" size={13} />
          <span>Zero Phone Storage</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-[11px]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-sky-600 text-white font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-3.5 transition-all hover:border-sky-500/40 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                <Icon name={app.icon} size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-slate-100 text-sm truncate">{app.name}</h4>
                  <span className="text-[10px] text-amber-400 font-medium">★ {app.rating}</span>
                </div>
                <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed mb-2">
                  {app.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-500">{app.sizeMb} MB Cloud</span>
                  <button
                    onClick={() => handleLaunchOrInstall(app)}
                    className={`px-3 py-1 rounded-lg font-medium text-xs transition-colors ${
                      app.installed
                        ? 'bg-sky-600/20 text-sky-300 hover:bg-sky-600 hover:text-white border border-sky-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {app.installed ? 'Open App' : 'Get (Free)'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
