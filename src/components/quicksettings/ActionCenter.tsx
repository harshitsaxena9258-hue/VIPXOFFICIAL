import React from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const ActionCenter: React.FC = () => {
  const {
    settings,
    updateSettings,
    cloudSpecs,
    notifications,
    clearNotification,
  } = useOS();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-2 sm:right-6 w-[92vw] max-w-[360px] bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-4 text-xs text-slate-100 select-none animate-in fade-in slide-in-from-bottom-4 duration-150 space-y-4"
    >
      {/* Quick Toggle Tiles */}
      <div className="grid grid-cols-3 gap-2">
        {/* Wi-Fi */}
        <button
          onClick={() => updateSettings({ wifiConnected: !settings.wifiConnected })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.wifiConnected
              ? 'bg-sky-600 text-white border-sky-500 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Icon name="wifi" size={20} className="mb-1" />
          <span className="font-medium text-[11px]">Wi-Fi</span>
          <span className="text-[9px] opacity-80">980 Mbps</span>
        </button>

        {/* Virtual Trackpad (Phone touch mouse) */}
        <button
          onClick={() =>
            updateSettings({ mobileTrackpadEnabled: !settings.mobileTrackpadEnabled })
          }
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.mobileTrackpadEnabled
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Icon name="trackpad" size={20} className="mb-1" />
          <span className="font-medium text-[11px]">Trackpad</span>
          <span className="text-[9px] opacity-80">
            {settings.mobileTrackpadEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Fullscreen Edge-to-Edge */}
        <button
          onClick={toggleFullscreen}
          className="flex flex-col items-center justify-center p-3 rounded-xl border bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Icon name="maximize" size={20} className="mb-1 text-sky-400" />
          <span className="font-medium text-[11px]">Fullscreen</span>
          <span className="text-[9px] opacity-80">Edge-to-Edge</span>
        </button>

        {/* Night Light */}
        <button
          onClick={() => updateSettings({ nightLight: !settings.nightLight })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.nightLight
              ? 'bg-amber-600 text-white border-amber-500 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Icon name="sun" size={20} className="mb-1" />
          <span className="font-medium text-[11px]">Night light</span>
          <span className="text-[9px] opacity-80">{settings.nightLight ? 'Warm' : 'Off'}</span>
        </button>

        {/* Battery / Cloud Power */}
        <button
          onClick={() => updateSettings({ batterySaver: !settings.batterySaver })}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            settings.batterySaver
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Icon name="battery" size={20} className="mb-1" />
          <span className="font-medium text-[11px]">Eco Mode</span>
          <span className="text-[9px] opacity-80">Cloud Power</span>
        </button>

        {/* Cloud RAM Stats Quick Tile */}
        <div className="flex flex-col items-center justify-center p-3 rounded-xl border bg-slate-950/60 border-slate-800 text-slate-300">
          <Icon name="cpu" size={20} className="mb-1 text-cyan-400" />
          <span className="font-medium text-[11px] text-cyan-300">{cloudSpecs.virtualRamGb}GB RAM</span>
          <span className="text-[9px] text-emerald-400">0% Phone</span>
        </div>
      </div>

      {/* Sliders: Brightness & Volume */}
      <div className="space-y-3 pt-1">
        {/* Brightness */}
        <div className="flex items-center gap-3">
          <Icon name="sun" size={16} className="text-slate-400 shrink-0" />
          <input
            type="range"
            min={30}
            max={100}
            value={settings.brightness}
            onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <span className="text-[11px] font-mono text-slate-400 w-8">{settings.brightness}%</span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <Icon
            name={settings.volume === 0 ? 'mute' : 'volume'}
            size={16}
            className="text-slate-400 shrink-0"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="w-full accent-sky-500"
          />
          <span className="text-[11px] font-mono text-slate-400 w-8">{settings.volume}%</span>
        </div>
      </div>

      {/* Notifications Drawer */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300 text-[11px]">Cloud Notifications</span>
          <span className="text-[10px] text-slate-500">100% Free Virtual PC</span>
        </div>

        <div className="max-h-36 overflow-y-auto space-y-1.5">
          {notifications.length === 0 ? (
            <div className="text-[11px] text-slate-500 text-center py-2">No new notifications</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl relative group"
              >
                <div className="flex items-start justify-between">
                  <h5 className="font-semibold text-sky-400 text-[11px]">{notif.title}</h5>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="text-slate-500 hover:text-white"
                  >
                    <Icon name="close" size={12} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{notif.message}</p>
                <span className="text-[9px] text-slate-500 block mt-1">{notif.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
