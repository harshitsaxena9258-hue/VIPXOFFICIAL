import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types/os';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

interface DesktopShortcut {
  id: string;
  appId?: AppId;
  name: string;
  icon: string;
  folderId?: string;
}

export const Desktop: React.FC = () => {
  const { openApp, settings, updateSettings, addNotification } = useOS();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Desktop files from storage
  const [desktopFiles, setDesktopFiles] = useState(cloudStorage.getDesktopFiles());

  useEffect(() => {
    const refresh = () => setDesktopFiles(cloudStorage.getDesktopFiles());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const SYSTEM_SHORTCUTS: DesktopShortcut[] = [
    { id: 'sc-thispc', appId: 'explorer', name: 'This PC', icon: 'monitor', folderId: 'drive-c' },
    { id: 'sc-cloud-drive', appId: 'explorer', name: 'Cloud Drive (D:)', icon: 'cloud', folderId: 'drive-d' },
    { id: 'sc-browser', appId: 'browser', name: 'Cloud Edge', icon: 'compass' },
    { id: 'sc-vscode', appId: 'vscode', name: 'Code Studio', icon: 'code' },
    { id: 'sc-terminal', appId: 'terminal', name: 'PowerShell', icon: 'terminal' },
    { id: 'sc-taskmgr', appId: 'taskmanager', name: 'Task Manager', icon: 'activity' },
    { id: 'sc-notepad', appId: 'notepad', name: 'Notepad', icon: 'file-text' },
    { id: 'sc-store', appId: 'store', name: 'Microsoft Store', icon: 'shopping-bag' },
    { id: 'sc-settings', appId: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'sc-snake', appId: 'game_snake', name: 'Cyber Snake', icon: 'gamepad-2' },
  ];

  const handleOpenShortcut = (shortcut: DesktopShortcut) => {
    if (shortcut.appId) {
      openApp(shortcut.appId, shortcut.folderId ? { folderId: shortcut.folderId } : undefined);
    }
  };

  const handleOpenDesktopFile = (file: any) => {
    if (file.type === 'folder') {
      openApp('explorer', { folderId: file.id });
    } else {
      const ext = file.extension?.toLowerCase();
      if (['js', 'html', 'css'].includes(ext)) {
        openApp('vscode', { fileId: file.id });
      } else if (['jpg', 'png'].includes(ext)) {
        openApp('photos', { fileId: file.id });
      } else {
        openApp('notepad', { fileId: file.id });
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: Math.min(e.clientX, window.innerWidth - 180), y: Math.min(e.clientY, window.innerHeight - 240) });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        setSelectedId(null);
        closeContextMenu();
      }}
      className="relative w-full h-[calc(100vh-48px)] overflow-hidden select-none"
    >
      {/* High-res Wallpaper Background */}
      <div
        style={{ backgroundImage: `url(${settings.wallpaper})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-100"
      >
        <div className="absolute inset-0 bg-black/15 backdrop-brightness-95" />
      </div>

      {/* Desktop Grid Icons */}
      <div className="relative z-10 p-3 grid grid-flow-col grid-rows-6 auto-cols-max gap-3 content-start h-full">
        {/* System Shortcuts */}
        {SYSTEM_SHORTCUTS.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(item.id);
                closeContextMenu();
              }}
              onDoubleClick={() => handleOpenShortcut(item)}
              onTouchEnd={(e) => {
                // Responsive tap to open on mobile
                if (selectedId === item.id) {
                  handleOpenShortcut(item);
                } else {
                  setSelectedId(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center w-20 h-22 p-1.5 rounded-lg border text-center transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-sky-500/25 border-sky-400/50 shadow-md backdrop-blur-sm'
                  : 'border-transparent hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform drop-shadow-md">
                <Icon
                  name={item.icon}
                  size={32}
                  className={item.name.includes('Cloud') ? 'text-indigo-400' : 'text-sky-300'}
                />
              </div>
              <span className="text-[11px] font-medium text-white leading-tight line-clamp-2 px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {item.name}
              </span>
            </div>
          );
        })}

        {/* Files saved on Desktop */}
        {desktopFiles.map((file) => {
          const isSelected = selectedId === file.id;
          return (
            <div
              key={file.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(file.id);
                closeContextMenu();
              }}
              onDoubleClick={() => handleOpenDesktopFile(file)}
              onTouchEnd={() => {
                if (selectedId === file.id) {
                  handleOpenDesktopFile(file);
                } else {
                  setSelectedId(file.id);
                }
              }}
              className={`flex flex-col items-center justify-center w-20 h-22 p-1.5 rounded-lg border text-center transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-sky-500/25 border-sky-400/50 shadow-md backdrop-blur-sm'
                  : 'border-transparent hover:bg-white/10 hover:border-white/10'
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform drop-shadow-md">
                {file.type === 'folder' ? (
                  <Icon name="folder" size={32} className="text-amber-400" />
                ) : file.extension === 'js' ? (
                  <Icon name="code" size={30} className="text-sky-400" />
                ) : (
                  <Icon name="file-text" size={30} className="text-slate-100" />
                )}
              </div>
              <span className="text-[11px] font-medium text-white leading-tight line-clamp-2 px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {file.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-52 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-xl p-1.5 text-xs text-slate-200 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={() => {
              setDesktopFiles(cloudStorage.getDesktopFiles());
              closeContextMenu();
              addNotification('Desktop Refreshed', 'Refreshed cloud desktop files.');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Icon name="refresh" size={14} />
            <span>Refresh</span>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          <button
            onClick={() => {
              const name = prompt('Folder name:', 'New Folder');
              if (name) {
                cloudStorage.createFolder(name, 'folder-desktop');
                setDesktopFiles(cloudStorage.getDesktopFiles());
                closeContextMenu();
              }
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Icon name="folder" size={14} className="text-amber-400" />
            <span>New folder</span>
          </button>

          <button
            onClick={() => {
              const name = prompt('Document name:', 'Notes.txt');
              if (name) {
                cloudStorage.createFile(name, 'folder-desktop', 'Created on Cloud Desktop', 'txt');
                setDesktopFiles(cloudStorage.getDesktopFiles());
                closeContextMenu();
              }
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Icon name="file-text" size={14} className="text-emerald-400" />
            <span>New text document</span>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          <button
            onClick={() => {
              openApp('terminal');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Icon name="terminal" size={14} />
            <span>Open in Terminal</span>
          </button>

          <button
            onClick={() => {
              openApp('settings');
              closeContextMenu();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-sky-600 hover:text-white transition-colors"
          >
            <Icon name="palette" size={14} />
            <span>Personalize</span>
          </button>
        </div>
      )}
    </div>
  );
};
