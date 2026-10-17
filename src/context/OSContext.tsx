import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppId, WindowItem, CloudSpecs, SystemSettings, ProcessItem } from '../types/os';
import { cloudStorage } from '../services/cloudStorage';

interface OSContextType {
  windows: WindowItem[];
  activeWindowId: string | null;
  openApp: (appId: AppId, args?: Record<string, any>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPos: (id: string, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;

  cloudSpecs: CloudSpecs;
  updateCloudSpecs: (newSpecs: Partial<CloudSpecs>) => void;

  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  isActionCenterOpen: boolean;
  toggleActionCenter: () => void;
  closeActionCenter: () => void;

  isCalendarOpen: boolean;
  toggleCalendar: () => void;
  closeCalendar: () => void;

  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;

  isPoweringOff: boolean;
  triggerPowerOff: () => void;
  triggerRestart: () => void;

  processes: ProcessItem[];
  killProcess: (processId: string) => void;

  // Mobile virtual mouse cursor
  virtualCursor: { x: number; y: number; isDown: boolean };
  setVirtualCursor: React.Dispatch<React.SetStateAction<{ x: number; y: number; isDown: boolean }>>;
  triggerVirtualClick: (button: 'left' | 'right') => void;

  // Helper for notification toasts
  notifications: Array<{ id: string; title: string; message: string; time: string }>;
  addNotification: (title: string, message: string) => void;
  clearNotification: (id: string) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const APP_METADATA: Record<AppId, { title: string; icon: string; defaultSize: { width: number; height: number } }> = {
  explorer: { title: 'File Explorer', icon: 'folder', defaultSize: { width: 780, height: 500 } },
  browser: { title: 'Cloud Browser', icon: 'compass', defaultSize: { width: 840, height: 560 } },
  terminal: { title: 'Cloud Terminal', icon: 'terminal', defaultSize: { width: 680, height: 440 } },
  vscode: { title: 'Cloud Code Studio', icon: 'code', defaultSize: { width: 860, height: 540 } },
  taskmanager: { title: 'Task Manager', icon: 'activity', defaultSize: { width: 700, height: 480 } },
  notepad: { title: 'Notepad', icon: 'file-text', defaultSize: { width: 600, height: 420 } },
  calculator: { title: 'Calculator', icon: 'calculator', defaultSize: { width: 340, height: 460 } },
  paint: { title: 'Paint Studio', icon: 'palette', defaultSize: { width: 760, height: 500 } },
  photos: { title: 'Photos Viewer', icon: 'image', defaultSize: { width: 700, height: 480 } },
  store: { title: 'Cloud App Store', icon: 'shopping-bag', defaultSize: { width: 780, height: 520 } },
  settings: { title: 'Settings', icon: 'settings', defaultSize: { width: 750, height: 500 } },
  game_snake: { title: 'Retro Cyber Snake', icon: 'gamepad-2', defaultSize: { width: 440, height: 500 } },
  game_minesweeper: { title: 'Minesweeper Classic', icon: 'bomb', defaultSize: { width: 400, height: 460 } },
};

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPoweringOff, setIsPoweringOff] = useState(false);

  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; time: string }>>([
    {
      id: 'init-1',
      title: 'Cloud PC Connected',
      message: 'Allocated 32 GB Virtual Cloud RAM & 512 GB Cloud Storage NVMe (Zero local phone load).',
      time: 'Just now',
    },
  ]);

  const [virtualCursor, setVirtualCursor] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    isDown: false,
  });

  const [cloudSpecs, setCloudSpecs] = useState<CloudSpecs>(() => {
    try {
      const saved = localStorage.getItem('cloudpc_specs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      virtualRamGb: 32,
      cloudStorageGb: 512,
      cpuName: 'AMD EPYC 9654 16-Core Cloud vCPU @ 4.20 GHz',
      cpuCores: 16,
      serverRegion: 'Singapore Cloud Node (SG-1)',
      pingMs: 14,
      networkSpeedMbps: 980,
      bandwidthUsedGb: 12.4,
      uptimeHours: 52,
    };
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('cloudpc_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'dark',
      wallpaper: '/src/assets/images/win_cloud_wallpaper_dark_1792204784138.jpg',
      accentColor: '#0078d4',
      volume: 85,
      brightness: 100,
      wifiConnected: true,
      bluetoothConnected: true,
      nightLight: false,
      batterySaver: false,
      mobileTrackpadEnabled: false,
      mouseSpeed: 1.2,
      displayScale: 100,
    };
  });

  const [processes, setProcesses] = useState<ProcessItem[]>([
    { id: 'p-sys', name: 'System Kernel', cpu: 0.8, memoryMb: 1120, diskIoMbps: 0.2, networkKbps: 12, status: 'Running' },
    { id: 'p-dwm', name: 'Desktop Window Manager', cpu: 1.4, memoryMb: 480, diskIoMbps: 0.1, networkKbps: 0, status: 'Running' },
    { id: 'p-cloud', name: 'Cloud Storage Daemon (D:)', cpu: 0.3, memoryMb: 320, diskIoMbps: 1.4, networkKbps: 180, status: 'Running' },
    { id: 'p-net', name: 'Gigabit Uplink Service', cpu: 0.5, memoryMb: 260, diskIoMbps: 0.0, networkKbps: 420, status: 'Running' },
  ]);

  // Sync settings and specs to storage
  useEffect(() => {
    localStorage.setItem('cloudpc_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cloudpc_specs', JSON.stringify(cloudSpecs));
  }, [cloudSpecs]);

  // Keep processes updated based on open windows
  useEffect(() => {
    setProcesses((prev) => {
      const base = prev.filter((p) => !p.appId);
      const appProcesses: ProcessItem[] = windows.map((w) => ({
        id: `p-${w.id}`,
        name: APP_METADATA[w.appId]?.title || w.title,
        appId: w.appId,
        cpu: Math.floor(Math.random() * 5 + 1.2 * 10) / 10,
        memoryMb: w.appId === 'browser' ? 980 : w.appId === 'vscode' ? 840 : 260,
        diskIoMbps: Math.floor(Math.random() * 30) / 10,
        networkKbps: w.appId === 'browser' ? 850 : 25,
        status: w.isMinimized ? 'Suspended' : 'Running',
      }));
      return [...base, ...appProcesses];
    });
  }, [windows]);

  const updateCloudSpecs = (newSpecs: Partial<CloudSpecs>) => {
    setCloudSpecs((prev) => ({ ...prev, ...newSpecs }));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addNotification = (title: string, message: string) => {
    const id = 'notif-' + Date.now();
    setNotifications((prev) => [{ id, title, message, time: 'Just now' }, ...prev.slice(0, 4)]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const closeOtherOverlays = () => {
    setIsStartMenuOpen(false);
    setIsActionCenterOpen(false);
    setIsCalendarOpen(false);
    setIsSearchOpen(false);
  };

  const openApp = (appId: AppId, args?: Record<string, any>) => {
    closeOtherOverlays();

    // Check if window of this app already exists
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        setWindows((prev) =>
          prev.map((w) => (w.id === existing.id ? { ...w, isMinimized: false } : w))
        );
      }
      focusWindow(existing.id);
      return;
    }

    const meta = APP_METADATA[appId] || { title: 'Application', icon: 'app', defaultSize: { width: 640, height: 440 } };
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Responsive window sizing for mobile phones
    const isMobile = screenW < 768;
    const initialWidth = isMobile ? screenW - 16 : Math.min(meta.defaultSize.width, screenW - 60);
    const initialHeight = isMobile ? screenH - 70 : Math.min(meta.defaultSize.height, screenH - 120);

    // Stagger position
    const offset = (windows.length % 6) * 24;
    const initialX = isMobile ? 8 : Math.max(20, Math.min(screenW / 2 - initialWidth / 2 + offset, screenW - initialWidth - 20));
    const initialY = isMobile ? 12 : Math.max(20, Math.min(screenH / 2 - initialHeight / 2 + offset - 20, screenH - initialHeight - 60));

    const highestZ = windows.reduce((max, w) => Math.max(max, w.zIndex), 10);

    const newWindow: WindowItem = {
      id: 'win-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      appId,
      title: meta.title,
      icon: meta.icon,
      isMinimized: false,
      isMaximized: isMobile, // Auto-maximize on small mobile devices for perfect native feel
      zIndex: highestZ + 1,
      position: { x: initialX, y: initialY },
      size: { width: initialWidth, height: initialHeight },
      args,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        const top = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev));
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const visible = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (visible.length > 0) {
        const top = visible.reduce((p, c) => (c.zIndex > p.zIndex ? c : p));
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const highestZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: highestZ + 1, isMinimized: false } : w));
    });
  };

  const updateWindowPos = (id: string, pos: { x: number; y: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, position: pos } : w)));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const killProcess = (processId: string) => {
    const proc = processes.find((p) => p.id === processId);
    if (proc && proc.appId) {
      const win = windows.find((w) => w.appId === proc.appId);
      if (win) {
        closeWindow(win.id);
      }
    }
    setProcesses((prev) => prev.filter((p) => p.id !== processId));
  };

  const triggerPowerOff = () => {
    setIsPoweringOff(true);
    closeOtherOverlays();
    setTimeout(() => {
      // Re-turn on
      setIsPoweringOff(false);
      setWindows([]);
      addNotification('Cloud PC Restarted', 'Virtual session booted successfully.');
    }, 3000);
  };

  const triggerRestart = () => {
    triggerPowerOff();
  };

  const triggerVirtualClick = (button: 'left' | 'right') => {
    const el = document.elementFromPoint(virtualCursor.x, virtualCursor.y);
    if (!el) return;

    if (button === 'left') {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: virtualCursor.x,
        clientY: virtualCursor.y,
      });
      el.dispatchEvent(clickEvent);
    } else {
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: virtualCursor.x,
        clientY: virtualCursor.y,
      });
      el.dispatchEvent(contextMenuEvent);
    }
  };

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPos,
        updateWindowSize,
        cloudSpecs,
        updateCloudSpecs,
        settings,
        updateSettings,
        isStartMenuOpen,
        toggleStartMenu: () => {
          setIsActionCenterOpen(false);
          setIsCalendarOpen(false);
          setIsSearchOpen(false);
          setIsStartMenuOpen((v) => !v);
        },
        closeStartMenu: () => setIsStartMenuOpen(false),
        isActionCenterOpen,
        toggleActionCenter: () => {
          setIsStartMenuOpen(false);
          setIsCalendarOpen(false);
          setIsSearchOpen(false);
          setIsActionCenterOpen((v) => !v);
        },
        closeActionCenter: () => setIsActionCenterOpen(false),
        isCalendarOpen,
        toggleCalendar: () => {
          setIsStartMenuOpen(false);
          setIsActionCenterOpen(false);
          setIsSearchOpen(false);
          setIsCalendarOpen((v) => !v);
        },
        closeCalendar: () => setIsCalendarOpen(false),
        isSearchOpen,
        toggleSearch: () => {
          setIsStartMenuOpen(false);
          setIsActionCenterOpen(false);
          setIsCalendarOpen(false);
          setIsSearchOpen((v) => !v);
        },
        closeSearch: () => setIsSearchOpen(false),
        isPoweringOff,
        triggerPowerOff,
        triggerRestart,
        processes,
        killProcess,
        virtualCursor,
        setVirtualCursor,
        triggerVirtualClick,
        notifications,
        addNotification,
        clearNotification,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = (): OSContextType => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
