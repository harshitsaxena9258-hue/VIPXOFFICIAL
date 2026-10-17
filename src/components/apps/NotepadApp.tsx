import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

export const NotepadApp: React.FC<{ args?: Record<string, any> }> = ({ args }) => {
  const { addNotification } = useOS();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [fileId, setFileId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(13);

  useEffect(() => {
    if (args?.fileId) {
      const file = cloudStorage.getFileById(args.fileId);
      if (file) {
        setContent(file.content || '');
        setFileName(file.name);
        setFileId(file.id);
      }
    }
  }, [args?.fileId]);

  const handleSave = () => {
    if (fileId) {
      cloudStorage.saveContent(fileId, content);
      addNotification('File Saved', `Updated "${fileName}" on Cloud Drive.`);
    } else {
      const created = cloudStorage.createFile(fileName, 'folder-desktop', content, 'txt');
      setFileId(created.id);
      addNotification('File Saved', `Saved "${fileName}" to Cloud Desktop.`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Downloaded to Phone', `Downloaded "${fileName}" to your phone.`);
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const lines = content.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Menu Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">{fileName}</span>
          <div className="h-3 w-px bg-slate-800 mx-1" />
          <button onClick={handleSave} className="hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800">
            Save
          </button>
          <button
            onClick={() => {
              const name = prompt('File name:', 'document.txt');
              if (name) {
                setFileName(name);
                setFileId(null);
                setContent('');
              }
            }}
            className="hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800"
          >
            New
          </button>
          <button onClick={handleDownload} className="hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 flex items-center gap-1">
            <Icon name="download" size={12} />
            <span>Export .txt</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize((s) => Math.max(10, s - 1))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Decrease font"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((s) => Math.min(22, s + 1))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white font-bold"
            title="Increase font"
          >
            A+
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-3 bg-slate-950">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your document in Cloud PC..."
          style={{ fontSize: `${fontSize}px` }}
          className="w-full h-full bg-transparent text-slate-100 outline-none resize-none font-sans leading-relaxed select-text"
          spellCheck={false}
          autoFocus
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>Ln {lines}, Col {chars}</span>
          <span>{words} words</span>
          <span>{chars} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span>100% Windows (CRLF)</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};
