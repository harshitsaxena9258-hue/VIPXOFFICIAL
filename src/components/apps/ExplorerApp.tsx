import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { FileItem } from '../../types/os';
import { Icon } from '../common/Icon';

export const ExplorerApp: React.FC<{ args?: Record<string, any> }> = ({ args }) => {
  const { openApp, cloudSpecs, addNotification } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState<string>(args?.folderId || 'folder-desktop');
  const [history, setHistory] = useState<string[]>(['folder-desktop']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Rename modal or state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshFiles = () => {
    const list = cloudStorage.getFilesByParent(currentFolderId);
    setFiles(list);
  };

  useEffect(() => {
    refreshFiles();
    setSelectedFileId(null);
  }, [currentFolderId]);

  const currentFolder = cloudStorage.getFileById(currentFolderId) || {
    id: 'root',
    name: 'This PC',
    path: 'This PC',
    type: 'folder' as const,
    size: 0,
    updatedAt: '',
    parentId: null,
  };

  const navigateTo = (folderId: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentFolderId(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentFolderId(history[historyIndex + 1]);
    }
  };

  const handleUp = () => {
    if (currentFolder.parentId) {
      navigateTo(currentFolder.parentId);
    }
  };

  const handleCreateNewFolder = () => {
    const name = prompt('Enter new folder name:', 'New Folder');
    if (name) {
      cloudStorage.createFolder(name, currentFolderId);
      refreshFiles();
      addNotification('Folder Created', `Created folder "${name}" in Cloud Drive`);
    }
  };

  const handleCreateNewFile = () => {
    const name = prompt('Enter new text document name:', 'New Document.txt');
    if (name) {
      const created = cloudStorage.createFile(name, currentFolderId, 'Hello from Cloud PC!');
      refreshFiles();
      addNotification('File Created', `Created "${created.name}"`);
    }
  };

  const handleDelete = (id: string) => {
    const item = cloudStorage.getFileById(id);
    if (!item) return;
    if (item.isSystem) {
      alert('System folders and files cannot be deleted.');
      return;
    }
    if (confirm(`Delete "${item.name}" from Cloud Storage?`)) {
      cloudStorage.deleteItem(id);
      refreshFiles();
      setSelectedFileId(null);
      addNotification('File Deleted', `Removed "${item.name}"`);
    }
  };

  const handleStartRename = (item: FileItem) => {
    if (item.isSystem) return;
    setRenamingId(item.id);
    setRenameValue(item.name);
  };

  const handleFinishRename = () => {
    if (renamingId && renameValue.trim()) {
      cloudStorage.renameItem(renamingId, renameValue.trim());
      refreshFiles();
      setRenamingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      await cloudStorage.uploadRealFile(file, currentFolderId);
      addNotification('Cloud Upload Complete', `Uploaded "${file.name}" to Cloud Storage without using phone storage.`);
    }
    refreshFiles();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenFile = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateTo(item.id);
    } else {
      const ext = item.extension?.toLowerCase() || '';
      if (['txt', 'log', 'md', 'json', 'csv'].includes(ext)) {
        openApp('notepad', { fileId: item.id });
      } else if (['js', 'ts', 'html', 'css', 'py'].includes(ext)) {
        openApp('vscode', { fileId: item.id });
      } else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
        openApp('photos', { fileId: item.id });
      } else {
        openApp('notepad', { fileId: item.id });
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const usedStorageGb = cloudStorage.calculateUsedStorageGb();
  const storagePercentage = Math.min(100, Math.round((usedStorageGb / cloudSpecs.cloudStorageGb) * 100));

  return (
    <div className="flex flex-col h-full bg-slate-900/95 text-slate-100 select-none text-xs">
      {/* Top Ribbon & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Back"
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Forward"
          >
            <Icon name="chevron-right" size={16} />
          </button>
          <button
            onClick={handleUp}
            disabled={!currentFolder.parentId}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Up to Parent Folder"
          >
            <Icon name="arrow-up" size={16} />
          </button>
          <button
            onClick={refreshFiles}
            className="p-1.5 rounded hover:bg-slate-800"
            title="Refresh"
          >
            <Icon name="refresh" size={16} />
          </button>
        </div>

        {/* Path Breadcrumb Bar */}
        <div className="flex-1 min-w-[140px] flex items-center bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1 text-slate-300">
          <Icon name="folder" size={14} className="text-amber-400 mr-1.5 shrink-0" />
          <span className="truncate font-mono text-[11px]">{currentFolder.path || currentFolder.name}</span>
        </div>

        {/* Search */}
        <div className="relative w-36 sm:w-44">
          <input
            type="text"
            placeholder="Search folder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-sky-500"
          />
          <Icon name="search" size={13} className="absolute left-2 top-2 text-slate-500" />
        </div>
      </div>

      {/* Second Toolbar: Actions */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto">
        <button
          onClick={handleCreateNewFolder}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Icon name="plus" size={14} className="text-sky-400" />
          <span>New folder</span>
        </button>
        <button
          onClick={handleCreateNewFile}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Icon name="file" size={14} className="text-emerald-400" />
          <span>New file</span>
        </button>
        <div className="h-4 w-px bg-slate-800 mx-1" />
        <label className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer">
          <Icon name="upload" size={14} className="text-amber-400" />
          <span>Upload from phone</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        {selectedFileId && (
          <>
            <div className="h-4 w-px bg-slate-800 mx-1" />
            <button
              onClick={() => {
                const f = cloudStorage.getFileById(selectedFileId);
                if (f) cloudStorage.downloadVirtualFile(f);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Download to your physical device"
            >
              <Icon name="download" size={14} className="text-cyan-400" />
              <span>Download</span>
            </button>
            <button
              onClick={() => {
                const f = cloudStorage.getFileById(selectedFileId);
                if (f) handleStartRename(f);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Icon name="edit" size={14} className="text-slate-400" />
              <span>Rename</span>
            </button>
            <button
              onClick={() => handleDelete(selectedFileId)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Icon name="trash" size={14} />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>

      {/* Main Body: Sidebar + File List */}
      <div className="flex flex-1 min-h-0">
        {/* Left Tree Sidebar */}
        <div className="hidden sm:flex flex-col w-48 border-r border-slate-800 bg-slate-950/40 p-2 space-y-3 overflow-y-auto shrink-0">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase px-2 mb-1 tracking-wider">
              Quick access
            </div>
            <div className="space-y-0.5">
              {[
                { id: 'folder-desktop', label: 'Desktop', icon: 'monitor' },
                { id: 'folder-downloads', label: 'Downloads', icon: 'download' },
                { id: 'folder-documents', label: 'Documents', icon: 'file-text' },
                { id: 'folder-pictures', label: 'Pictures', icon: 'image' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                    currentFolderId === item.id ? 'bg-sky-500/20 text-sky-300 font-medium' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon name={item.icon} size={15} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase px-2 mb-1 tracking-wider">
              Cloud Drives
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => navigateTo('drive-c')}
                className={`w-full flex flex-col p-2 rounded text-left border transition-colors ${
                  currentFolderId === 'drive-c' ? 'bg-sky-950/40 border-sky-500/40' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="hard-drive" size={15} className="text-slate-400" />
                  <span className="font-medium text-slate-200">Local Disk (C:)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[35%]" />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">24.5 GB of 100 GB free</div>
              </button>

              <button
                onClick={() => navigateTo('drive-d')}
                className={`w-full flex flex-col p-2 rounded text-left border transition-colors ${
                  currentFolderId === 'drive-d' ? 'bg-indigo-950/40 border-indigo-500/40' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="cloud" size={15} className="text-indigo-400" />
                  <span className="font-medium text-indigo-300">Cloud Storage (D:)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${storagePercentage}%` }} />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {usedStorageGb} GB used of {cloudSpecs.cloudStorageGb} GB
                </div>
              </button>
            </div>
          </div>

          {/* Cloud Status Callout */}
          <div className="mt-auto p-2 bg-slate-900/80 rounded border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Icon name="shield" size={13} />
              <span>0 MB Phone Storage</span>
            </div>
            <p className="text-[10px] leading-tight text-slate-400">
              Files are stored on high-speed remote NVMe cloud instance.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="flex-1 p-3 overflow-y-auto"
          onClick={() => setSelectedFileId(null)}
        >
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 space-y-2">
              <Icon name="folder" size={36} className="opacity-40" />
              <p>This folder is empty.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateNewFolder}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs"
                >
                  Create Folder
                </button>
                <button
                  onClick={handleCreateNewFile}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs"
                >
                  Create File
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {filteredFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                const isRenaming = renamingId === file.id;

                return (
                  <div
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={() => handleOpenFile(file)}
                    className={`group relative flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-500/50 text-white'
                        : 'bg-slate-900/40 border-transparent hover:bg-slate-800/50 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-1.5">
                      {file.type === 'folder' ? (
                        <Icon name="folder" size={38} className="text-amber-400 drop-shadow" />
                      ) : file.extension === 'js' || file.extension === 'py' ? (
                        <Icon name="code" size={34} className="text-sky-400" />
                      ) : file.extension === 'jpg' || file.extension === 'png' ? (
                        <Icon name="image" size={34} className="text-emerald-400" />
                      ) : (
                        <Icon name="file-text" size={34} className="text-slate-300" />
                      )}
                    </div>

                    {isRenaming ? (
                      <input
                        autoFocus
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={handleFinishRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleFinishRename();
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="w-full text-center bg-slate-950 border border-sky-500 rounded px-1 py-0.5 text-xs text-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="w-full truncate text-[11px] leading-tight px-1 font-medium">
                        {file.name}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 mt-1">
                      {file.type === 'folder' ? 'Folder' : formatSize(file.size)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFileId(file.id);
                  }}
                  onDoubleClick={() => handleOpenFile(file)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedFileId === file.id ? 'bg-sky-500/20 text-white' : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      name={file.type === 'folder' ? 'folder' : 'file-text'}
                      size={16}
                      className={file.type === 'folder' ? 'text-amber-400' : 'text-slate-400'}
                    />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-[10px] shrink-0">
                    <span>{file.type === 'folder' ? 'Folder' : formatSize(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div>{filteredFiles.length} item(s)</div>
        <div className="flex items-center gap-3">
          <span>NVMe Cloud Drive: 980 MB/s Read</span>
          <span className="text-emerald-400">● Cloud Synced</span>
        </div>
      </div>
    </div>
  );
};
