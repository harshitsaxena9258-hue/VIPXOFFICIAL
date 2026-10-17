import React, { useState } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const SettingsApp: React.FC = () => {
  const { cloudSpecs, updateCloudSpecs, settings, updateSettings, addNotification } = useOS();
  const [activeSection, setActiveSection] = useState<'system' | 'personalization' | 'mobile' | 'about'>('system');

  const WALLPAPERS = [
    {
      id: 'bloom-dark',
      name: 'Windows 11 Cyan Bloom (Dark)',
      url: '/src/assets/images/win_cloud_wallpaper_dark_1792204784138.jpg',
    },
    {
      id: 'bloom-light',
      name: 'Windows 11 Silk Ribbon (Light)',
      url: '/src/assets/images/win_cloud_wallpaper_light_1792204784260.jpg',
    },
  ];

  const ACCENT_COLORS = ['#0078d4', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'];

  const REGIONS = [
    'Singapore Cloud Node (SG-1, 10Gbps)',
    'Frankfurt Cloud Datacenter (EU-1)',
    'US East Cloud Cluster (VA-2)',
    'Tokyo Hyper-Scale Pod (JP-1)',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar Navigation */}
        <div className="w-44 sm:w-52 bg-slate-950/60 border-r border-slate-800 p-3 space-y-1 shrink-0">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <Icon name="settings" size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 text-xs">Settings</h3>
              <span className="text-[10px] text-slate-500">Cloud PC Control</span>
            </div>
          </div>

          {[
            { id: 'system', label: 'Cloud System & RAM', icon: 'cpu' },
            { id: 'personalization', label: 'Personalization', icon: 'palette' },
            { id: 'mobile', label: 'Mobile & Touch Mode', icon: 'trackpad' },
            { id: 'about', label: 'About Windows 11', icon: 'info' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-sky-600/20 text-sky-300 font-medium border border-sky-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon name={item.icon} size={15} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {activeSection === 'system' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Cloud Hardware Allocation</h2>
                <p className="text-slate-400 text-xs">
                  Configure virtual RAM, storage pools, and server nodes. No changes will affect your phone hardware.
                </p>
              </div>

              {/* RAM Booster */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Virtual Cloud RAM Allocation</h4>
                    <p className="text-[11px] text-slate-400">High-speed DDR5 5600MHz virtual buffer</p>
                  </div>
                  <span className="text-sm font-bold text-sky-400">{cloudSpecs.virtualRamGb} GB RAM</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[16, 32, 64].map((ram) => (
                    <button
                      key={ram}
                      onClick={() => {
                        updateCloudSpecs({ virtualRamGb: ram });
                        addNotification('Cloud RAM Allocated', `Allocated ${ram} GB Virtual Cloud RAM.`);
                      }}
                      className={`py-2 rounded-lg font-semibold border transition-all ${
                        cloudSpecs.virtualRamGb === ram
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {ram} GB Cloud RAM
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Capacity */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Cloud NVMe Drive (D:) Capacity</h4>
                    <p className="text-[11px] text-slate-400">Dedicated remote cloud disk partition</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{cloudSpecs.cloudStorageGb} GB NVMe</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[256, 512, 1024].map((gb) => (
                    <button
                      key={gb}
                      onClick={() => {
                        updateCloudSpecs({ cloudStorageGb: gb });
                        addNotification('Cloud Storage Upgraded', `Configured ${gb} GB Cloud NVMe disk.`);
                      }}
                      className={`py-2 rounded-lg font-semibold border transition-all ${
                        cloudSpecs.cloudStorageGb === gb
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {gb === 1024 ? '1 TB (1024 GB)' : `${gb} GB NVMe`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Node Selection */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-white">Datacenter Cloud Region</h4>
                <select
                  value={cloudSpecs.serverRegion}
                  onChange={(e) => {
                    updateCloudSpecs({ serverRegion: e.target.value });
                    addNotification('Node Switched', `Reconnected to ${e.target.value}`);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeSection === 'personalization' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Personalization</h2>
                <p className="text-slate-400 text-xs">
                  Change wallpaper backgrounds, UI theme, and accent highlights.
                </p>
              </div>

              {/* Wallpaper Selection */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-semibold text-white">Desktop Background Wallpaper</h4>
                <div className="grid grid-cols-2 gap-3">
                  {WALLPAPERS.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => {
                        updateSettings({ wallpaper: wp.url });
                        addNotification('Wallpaper Applied', `Desktop wallpaper updated.`);
                      }}
                      className={`group relative rounded-lg overflow-hidden border text-left aspect-video ${
                        settings.wallpaper === wp.url ? 'ring-2 ring-sky-500 border-white' : 'border-slate-800 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 backdrop-blur-sm text-[10px] text-white truncate">
                        {wp.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-semibold text-white">Accent Color</h4>
                <div className="flex items-center gap-2">
                  {ACCENT_COLORS.map((col) => (
                    <button
                      key={col}
                      onClick={() => updateSettings({ accentColor: col })}
                      style={{ backgroundColor: col }}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        settings.accentColor === col ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'mobile' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white mb-1">Mobile & Touch Mode Controls</h2>
                <p className="text-slate-400 text-xs">
                  Optimizations designed specifically so you can use full Windows PC on smartphone touchscreens!
                </p>
              </div>

              {/* Virtual Trackpad Toggle */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Virtual Mouse Trackpad on Mobile</h4>
                  <p className="text-[11px] text-slate-400">
                    Displays a floating touch mouse pad with Left Click, Right Click, and fine desktop cursor navigation.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSettings({ mobileTrackpadEnabled: !settings.mobileTrackpadEnabled })
                  }
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                    settings.mobileTrackpadEnabled ? 'bg-sky-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.mobileTrackpadEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Mouse Sensitivity */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-white">Cursor Sensitivity</h4>
                  <span className="font-mono text-sky-400">{settings.mouseSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={settings.mouseSpeed}
                  onChange={(e) => updateSettings({ mouseSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>

              {/* Fullscreen Edge-to-Edge */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Full Screen Edge-to-Edge</h4>
                  <p className="text-[11px] text-slate-400">
                    Hide phone address bar and browser chrome for true native PC desktop feeling.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen().catch(() => {});
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-white"
                >
                  Toggle Fullscreen
                </button>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-white mb-1">About CloudPC Windows Simulator</h2>
                <p className="text-slate-400 text-xs">
                  System information and cloud virtualization architecture.
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
                    田
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Windows 11 Enterprise (Cloud Edition)</h3>
                    <p className="text-slate-400 text-xs">Version 24H2 (OS Build 26100.1882)</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Host Virtual Processor:</span>
                    <span className="text-slate-200 font-mono">{cloudSpecs.cpuName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Virtual Cloud RAM:</span>
                    <span className="text-slate-200 font-mono">{cloudSpecs.virtualRamGb} GB DDR5 5600MHz</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Cloud Storage Array:</span>
                    <span className="text-slate-200 font-mono">{cloudSpecs.cloudStorageGb} GB NVMe PCIe 4.0</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Phone Device Storage Used:</span>
                    <span className="text-emerald-400 font-bold">0 MB (Zero local phone footprint)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Phone Device RAM Used:</span>
                    <span className="text-emerald-400 font-bold">0 MB (Fully virtualized in cloud)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
