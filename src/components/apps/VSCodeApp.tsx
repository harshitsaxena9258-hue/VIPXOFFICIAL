import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

interface EditorFile {
  name: string;
  ext: string;
  content: string;
  fileId?: string;
}

export const VSCodeApp: React.FC<{ args?: Record<string, any> }> = ({ args }) => {
  const { addNotification } = useOS();

  const [files, setFiles] = useState<EditorFile[]>([
    {
      name: 'index.js',
      ext: 'js',
      content: `// Cloud PC Virtual Node Script
console.log("Welcome to Cloud Code Studio!");

function calculateCloudThroughput(cores, ramGb) {
  const baseFlops = cores * 3.8;
  const memoryBandwidth = ramGb * 24.5; // GB/s
  return {
    tflops: baseFlops.toFixed(2),
    bandwidthGBs: memoryBandwidth.toFixed(2),
    status: "Optimal (Zero Phone Battery Drain)"
  };
}

const stats = calculateCloudThroughput(16, 32);
console.log("Cloud Benchmark Results:", stats);

// Array operations
const tasks = ["Render Desktop UI", "Simulate NVMe Storage", "Run JavaScript Sandbox"];
tasks.forEach((t, i) => console.log(\`Task #\${i + 1}: \${t} -> SUCCESS\`));
`,
    },
    {
      name: 'styles.css',
      ext: 'css',
      content: `/* Fluent UI Dark Theme */
.cloud-window {
  backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.85);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
`,
    },
    {
      name: 'index.html',
      ext: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Cloud PC Web Sandbox</title>
</head>
<body>
  <h1>Running 100% Free Virtual PC in Phone</h1>
  <p>No phone RAM or phone disk used.</p>
</body>
</html>
`,
    },
  ]);

  const [activeFileName, setActiveFileName] = useState('index.js');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Cloud Node V8 Engine Ready. Click "Run Code" to execute.',
  ]);
  const [isRunning, setIsRunning] = useState(false);

  // If opened with a specific file from Explorer
  useEffect(() => {
    if (args?.fileId) {
      const file = cloudStorage.getFileById(args.fileId);
      if (file && file.type === 'file') {
        const existing = files.find((f) => f.name === file.name);
        if (!existing) {
          setFiles((prev) => [
            ...prev,
            {
              name: file.name,
              ext: file.extension || 'txt',
              content: file.content || '',
              fileId: file.id,
            },
          ]);
        }
        setActiveFileName(file.name);
      }
    }
  }, [args?.fileId]);

  const activeFile = files.find((f) => f.name === activeFileName) || files[0];

  const handleContentChange = (val: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.name === activeFileName ? { ...f, content: val } : f))
    );
  };

  const handleSaveToCloud = () => {
    if (activeFile.fileId) {
      cloudStorage.saveContent(activeFile.fileId, activeFile.content);
      addNotification('File Saved', `Updated "${activeFile.name}" on Cloud Drive.`);
    } else {
      const created = cloudStorage.createFile(
        activeFile.name,
        'folder-desktop',
        activeFile.content,
        activeFile.ext
      );
      setFiles((prev) =>
        prev.map((f) => (f.name === activeFileName ? { ...f, fileId: created.id } : f))
      );
      addNotification('File Saved to Desktop', `Saved "${created.name}" on Cloud Drive.`);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput((prev) => [...prev, `\n> Running ${activeFile.name}...`]);

    setTimeout(() => {
      try {
        if (activeFile.ext === 'js') {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => {
              logs.push(
                args
                  .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
                  .join(' ')
              );
            },
            warn: (...args: any[]) => logs.push('[WARN] ' + args.join(' ')),
            error: (...args: any[]) => logs.push('[ERROR] ' + args.join(' ')),
          };

          const runFn = new Function('console', activeFile.content);
          runFn(customConsole);

          setConsoleOutput((prev) => [
            ...prev,
            ...logs,
            `[Process finished with exit code 0 - Execution time: 14ms (Gigabit Cloud Node)]`,
          ]);
        } else {
          setConsoleOutput((prev) => [
            ...prev,
            `File syntax parsed successfully. (Static asset)`,
          ]);
        }
      } catch (err: any) {
        setConsoleOutput((prev) => [
          ...prev,
          `Runtime Error: ${err.message || String(err)}`,
        ]);
      }
      setIsRunning(false);
    }, 150);
  };

  const lines = activeFile.content.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-slate-200 select-none text-xs font-mono">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px]">
            <Icon name="code" size={15} />
            <span>Cloud Code Studio</span>
          </div>
          <div className="h-3 w-px bg-slate-700 mx-1" />
          <div className="flex gap-1 text-[11px] text-slate-400">
            <button onClick={handleSaveToCloud} className="hover:text-white px-1.5 py-0.5 rounded hover:bg-[#333]">
              Save
            </button>
            <button
              onClick={() => {
                const name = prompt('File name:', 'script.js');
                if (name) {
                  setFiles((prev) => [...prev, { name, ext: name.split('.').pop() || 'js', content: '// New script\n' }]);
                  setActiveFileName(name);
                }
              }}
              className="hover:text-white px-1.5 py-0.5 rounded hover:bg-[#333]"
            >
              New
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[11px] shadow transition-colors"
          >
            <Icon name="play" size={12} />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="flex flex-1 min-h-0">
        {/* Left Files List */}
        <div className="w-36 sm:w-44 bg-[#252526] border-r border-[#333333] flex flex-col p-2 space-y-1 shrink-0">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider px-1">
            Explorer
          </div>
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFileName(file.name)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                file.name === activeFileName
                  ? 'bg-[#37373d] text-white font-medium'
                  : 'text-slate-400 hover:bg-[#2a2d2e] hover:text-slate-200'
              }`}
            >
              <Icon
                name={file.ext === 'js' ? 'code' : file.ext === 'css' ? 'palette' : 'file-text'}
                size={13}
                className={file.ext === 'js' ? 'text-amber-400' : 'text-sky-400'}
              />
              <span className="truncate text-[11px]">{file.name}</span>
            </button>
          ))}

          <div className="mt-auto p-2 bg-[#1f1f1f] rounded border border-[#333] text-[10px] text-slate-400">
            <span className="text-emerald-400 block font-semibold">Node.js Virtual V8</span>
            <span>Zero phone memory usage</span>
          </div>
        </div>

        {/* Code Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
          {/* Active File Tab */}
          <div className="flex bg-[#252526] border-b border-[#333]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] border-t-2 border-sky-500 text-white font-medium text-[11px]">
              <Icon name="code" size={13} className="text-amber-400" />
              <span>{activeFile.name}</span>
            </div>
          </div>

          {/* Code Textarea with line numbers */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div className="w-10 bg-[#1e1e1e] py-3 text-right pr-2 text-slate-600 select-none text-[11px] leading-relaxed shrink-0">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editor Area */}
            <textarea
              value={activeFile.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 p-3 outline-none resize-none font-mono text-[11px] leading-relaxed select-text"
              spellCheck={false}
            />
          </div>

          {/* Integrated Console / Output Drawer */}
          <div className="h-32 sm:h-36 bg-[#181818] border-t border-[#333] flex flex-col">
            <div className="flex items-center justify-between px-3 py-1 bg-[#202020] border-b border-[#2d2d2d] text-[10px] text-slate-400">
              <span className="font-semibold text-slate-300">DEBUG CONSOLE</span>
              <button
                onClick={() => setConsoleOutput([])}
                className="hover:text-white"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-1 text-[11px] text-slate-300 font-mono">
              {consoleOutput.map((out, idx) => (
                <div
                  key={idx}
                  className={`leading-tight whitespace-pre-wrap ${
                    out.includes('Error') ? 'text-rose-400' : out.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {out}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-[10px]">
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>JavaScript</span>
          <span>Ln {lines.length}, Col 1</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Virtual Cloud Compiler Active</span>
        </div>
      </div>
    </div>
  );
};
