export type AppId = 
  | 'explorer'
  | 'browser'
  | 'terminal'
  | 'vscode'
  | 'taskmanager'
  | 'notepad'
  | 'calculator'
  | 'paint'
  | 'photos'
  | 'store'
  | 'settings'
  | 'game_snake'
  | 'game_minesweeper';

export interface WindowItem {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  args?: Record<string, any>;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  content?: string;
  size: number; // in bytes
  updatedAt: string;
  parentId: string | null;
  path: string;
  isSystem?: boolean;
}

export interface CloudSpecs {
  virtualRamGb: number;
  cloudStorageGb: number;
  cpuName: string;
  cpuCores: number;
  serverRegion: string;
  pingMs: number;
  networkSpeedMbps: number;
  bandwidthUsedGb: number;
  uptimeHours: number;
}

export interface SystemSettings {
  theme: 'dark' | 'light';
  wallpaper: string;
  accentColor: string;
  volume: number;
  brightness: number;
  wifiConnected: boolean;
  bluetoothConnected: boolean;
  nightLight: boolean;
  batterySaver: boolean;
  mobileTrackpadEnabled: boolean;
  mouseSpeed: number;
  displayScale: number;
}

export interface ProcessItem {
  id: string;
  name: string;
  appId?: AppId;
  cpu: number;
  memoryMb: number;
  diskIoMbps: number;
  networkKbps: number;
  status: 'Running' | 'Suspended';
}
