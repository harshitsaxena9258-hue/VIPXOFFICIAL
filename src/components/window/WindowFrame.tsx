import React, { useRef, useState } from 'react';
import { useOS } from '../../context/OSContext';
import { WindowItem } from '../../types/os';
import { Icon } from '../common/Icon';
import { ExplorerApp } from '../apps/ExplorerApp';
import { BrowserApp } from '../apps/BrowserApp';
import { TerminalApp } from '../apps/TerminalApp';
import { VSCodeApp } from '../apps/VSCodeApp';
import { TaskManagerApp } from '../apps/TaskManagerApp';
import { NotepadApp } from '../apps/NotepadApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { PaintApp } from '../apps/PaintApp';
import { PhotosApp } from '../apps/PhotosApp';
import { StoreApp } from '../apps/StoreApp';
import { SettingsApp } from '../apps/SettingsApp';
import { SnakeGame } from '../apps/games/SnakeGame';
import { MinesweeperGame } from '../apps/games/MinesweeperGame';

interface WindowFrameProps {
  windowItem: WindowItem;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ windowItem }) => {
  const {
    activeWindowId,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    updateWindowPos,
    updateWindowSize,
  } = useOS();

  const isFocused = activeWindowId === windowItem.id;
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0 });
  const sizeStart = useRef({ width: 0, height: 0 });

  // Drag handlers
  const handlePointerDownHeader = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.win-titlebar-btn')) return;
    focusWindow(windowItem.id);
    if (windowItem.isMaximized) return;

    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { x: windowItem.position.x, y: windowItem.position.y };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveHeader = (e: React.PointerEvent) => {
    if (!isDragging.current || windowItem.isMaximized) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    updateWindowPos(windowItem.id, {
      x: Math.max(-100, posStart.current.x + dx),
      y: Math.max(0, posStart.current.y + dy),
    });
  };

  const handlePointerUpHeader = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Resize handlers
  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    focusWindow(windowItem.id);
    if (windowItem.isMaximized) return;

    isResizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    sizeStart.current = { width: windowItem.size.width, height: windowItem.size.height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveResize = (e: React.PointerEvent) => {
    if (!isResizing.current || windowItem.isMaximized) return;
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    updateWindowSize(windowItem.id, {
      width: Math.max(300, sizeStart.current.width + dx),
      height: Math.max(200, sizeStart.current.height + dy),
    });
  };

  const handlePointerUpResize = (e: React.PointerEvent) => {
    isResizing.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  if (windowItem.isMinimized) {
    return null;
  }

  const renderAppContent = () => {
    switch (windowItem.appId) {
      case 'explorer':
        return <ExplorerApp args={windowItem.args} />;
      case 'browser':
        return <BrowserApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'vscode':
        return <VSCodeApp args={windowItem.args} />;
      case 'taskmanager':
        return <TaskManagerApp />;
      case 'notepad':
        return <NotepadApp args={windowItem.args} />;
      case 'calculator':
        return <CalculatorApp />;
      case 'paint':
        return <PaintApp />;
      case 'photos':
        return <PhotosApp args={windowItem.args} />;
      case 'store':
        return <StoreApp />;
      case 'settings':
        return <SettingsApp />;
      case 'game_snake':
        return <SnakeGame />;
      case 'game_minesweeper':
        return <MinesweeperGame />;
      default:
        return <div className="p-4 text-white">Application running...</div>;
    }
  };

  const isMax = windowItem.isMaximized;

  return (
    <div
      onPointerDown={() => focusWindow(windowItem.id)}
      style={{
        zIndex: windowItem.zIndex,
        left: isMax ? 0 : `${windowItem.position.x}px`,
        top: isMax ? 0 : `${windowItem.position.y}px`,
        width: isMax ? '100vw' : `${windowItem.size.width}px`,
        height: isMax ? 'calc(100vh - 48px)' : `${windowItem.size.height}px`,
      }}
      className={`fixed flex flex-col rounded-xl overflow-hidden shadow-2xl transition-all duration-75 select-none ${
        isMax ? 'rounded-none' : 'border border-slate-700/60'
      } ${isFocused ? 'ring-1 ring-sky-500/30' : 'opacity-95'}`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMoveHeader}
        onPointerUp={handlePointerUpHeader}
        onDoubleClick={() => maximizeWindow(windowItem.id)}
        className={`h-9 flex items-center justify-between px-3 cursor-move border-b select-none transition-colors ${
          isFocused
            ? 'bg-slate-900/90 text-slate-100 border-slate-700/80 backdrop-blur-md'
            : 'bg-slate-950/80 text-slate-400 border-slate-800 backdrop-blur-sm'
        }`}
      >
        {/* Left: Icon and Title */}
        <div className="flex items-center gap-2 overflow-hidden pointer-events-none">
          <Icon name={windowItem.icon} size={15} className="text-sky-400 shrink-0" />
          <span className="text-xs font-medium truncate">{windowItem.title}</span>
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center -mr-3">
          <button
            onClick={() => minimizeWindow(windowItem.id)}
            className="win-titlebar-btn text-slate-300 hover:text-white"
            title="Minimize"
          >
            <Icon name="minimize" size={14} />
          </button>
          <button
            onClick={() => maximizeWindow(windowItem.id)}
            className="win-titlebar-btn text-slate-300 hover:text-white"
            title={isMax ? 'Restore' : 'Maximize'}
          >
            <Icon name={isMax ? 'restore' : 'maximize'} size={12} />
          </button>
          <button
            onClick={() => closeWindow(windowItem.id)}
            className="win-titlebar-btn win-titlebar-btn-close text-slate-300"
            title="Close"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      </div>

      {/* App Body Content */}
      <div className="flex-1 min-h-0 relative bg-slate-900 overflow-hidden flex flex-col">
        {renderAppContent()}
      </div>

      {/* Resize Handle (Bottom Right) */}
      {!isMax && (
        <div
          onPointerDown={handlePointerDownResize}
          onPointerMove={handlePointerMoveResize}
          onPointerUp={handlePointerUpResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-center justify-center opacity-40 hover:opacity-100"
        >
          <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 mb-0.5 mr-0.5" />
        </div>
      )}
    </div>
  );
};
