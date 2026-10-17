/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { Desktop } from './components/desktop/Desktop';
import { Taskbar } from './components/taskbar/Taskbar';
import { WindowFrame } from './components/window/WindowFrame';
import { StartMenu } from './components/start/StartMenu';
import { ActionCenter } from './components/quicksettings/ActionCenter';
import { CalendarFlyout } from './components/quicksettings/CalendarFlyout';
import { VirtualTrackpad } from './components/trackpad/VirtualTrackpad';

const MainShell: React.FC = () => {
  const {
    windows,
    isStartMenuOpen,
    closeStartMenu,
    isActionCenterOpen,
    closeActionCenter,
    isCalendarOpen,
    closeCalendar,
    isPoweringOff,
    settings,
  } = useOS();

  const handleDismissFlyouts = () => {
    if (isStartMenuOpen) closeStartMenu();
    if (isActionCenterOpen) closeActionCenter();
    if (isCalendarOpen) closeCalendar();
  };

  return (
    <div
      onClick={handleDismissFlyouts}
      className={`relative w-screen h-screen overflow-hidden select-none bg-black text-slate-100 ${
        settings.nightLight ? 'sepia-[0.25]' : ''
      }`}
      style={{
        filter: `brightness(${settings.brightness}%)`,
      }}
    >
      {/* Desktop Workspace */}
      <Desktop />

      {/* Active Windows Layer */}
      {windows.map((win) => (
        <WindowFrame key={win.id} windowItem={win} />
      ))}

      {/* Flyout Overlays */}
      {isStartMenuOpen && <StartMenu />}
      {isActionCenterOpen && <ActionCenter />}
      {isCalendarOpen && <CalendarFlyout />}

      {/* Mobile Virtual Trackpad */}
      <VirtualTrackpad />

      {/* Centered Taskbar */}
      <Taskbar />

      {/* Power Off / Restart Animation Screen */}
      {isPoweringOff && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex flex-col items-center justify-center text-white space-y-4 animate-in fade-in duration-300">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-xl font-semibold">Restarting Virtual Cloud Node...</h2>
          <p className="text-xs text-slate-400">Zero phone memory or storage affected.</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <OSProvider>
      <MainShell />
    </OSProvider>
  );
}
