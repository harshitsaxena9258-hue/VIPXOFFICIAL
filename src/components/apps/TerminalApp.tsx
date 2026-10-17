import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

interface OutputLine {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalApp: React.FC = () => {
  const { cloudSpecs, processes } = useOS();
  const [shellType, setShellType] = useState<'powershell' | 'cmd'>('powershell');
  const [currentPath, setCurrentPath] = useState('C:\\Users\\User');
  const [currentFolderId, setCurrentFolderId] = useState('folder-user');
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [textColor, setTextColor] = useState<string>('text-slate-200');

  const [lines, setLines] = useState<OutputLine[]>([
    {
      id: 'l-init1',
      type: 'output',
      text: 'Windows PowerShell [Version 10.0.26100.1882]',
    },
    {
      id: 'l-init2',
      type: 'output',
      text: '(c) Microsoft Corporation. All rights reserved.',
    },
    {
      id: 'l-init3',
      type: 'success',
      text: `Connected to Cloud vNode: 32GB DDR5 Virtual RAM | 512GB NVMe Storage | 980 Mbps Uplink`,
    },
    {
      id: 'l-init4',
      type: 'output',
      text: "Type 'help' to see list of available commands.",
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: OutputLine['type'], text: string) => {
    setLines((prev) => [...prev, { id: 'line-' + Date.now() + Math.random(), type, text }]);
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      addLine('cmd', `${shellType === 'powershell' ? 'PS ' : ''}${currentPath}> `);
      return;
    }

    // Record history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Echo command
    addLine('cmd', `${shellType === 'powershell' ? 'PS ' : ''}${currentPath}> ${trimmed}`);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        addLine(
          'output',
          `Available Cloud Terminal Commands:
  help              - Displays this help screen
  dir, ls           - Lists directory files and folders
  cd <dir>          - Changes current directory (e.g. cd Desktop, cd ..)
  type, cat <file>  - Displays contents of a text file
  mkdir <name>      - Creates a new directory in Cloud Drive
  echo <text>       - Prints text to screen
  systeminfo        - Displays full Virtual Cloud Hardware & OS specifications
  ram, free         - Shows Virtual Cloud RAM allocation & usage
  ping <host>       - Pings remote server with ultra-low cloud latency
  tasklist          - Shows running processes and virtual memory usage
  calc <expr>       - Evaluates math expression (e.g. calc 25 * 400)
  color <color>     - Changes text color (green, amber, cyan, white)
  cls, clear        - Clears the terminal screen
  date              - Shows current system date and time
  ver               - Shows Windows version`
        );
        break;

      case 'cls':
      case 'clear':
        setLines([]);
        break;

      case 'dir':
      case 'ls': {
        const files = cloudStorage.getFilesByParent(currentFolderId);
        let output = ` Directory of ${currentPath}\n\n`;
        files.forEach((f) => {
          const typeStr = f.type === 'folder' ? '<DIR>         ' : '       ' + String(f.size).padStart(7, ' ');
          const dateStr = new Date(f.updatedAt).toLocaleDateString();
          output += `${dateStr}  ${typeStr}  ${f.name}\n`;
        });
        output += `\n               ${files.filter((f) => f.type === 'file').length} File(s)\n               ${files.filter((f) => f.type === 'folder').length} Dir(s)`;
        addLine('output', output);
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '.') {
          addLine('output', currentPath);
          break;
        }

        if (target === '..') {
          const current = cloudStorage.getFileById(currentFolderId);
          if (current && current.parentId) {
            const parent = cloudStorage.getFileById(current.parentId);
            if (parent) {
              setCurrentFolderId(parent.id);
              setCurrentPath(parent.path.replace(/\//g, '\\'));
            }
          }
        } else {
          const files = cloudStorage.getFilesByParent(currentFolderId);
          const match = files.find(
            (f) => f.type === 'folder' && f.name.toLowerCase() === target.toLowerCase()
          );
          if (match) {
            setCurrentFolderId(match.id);
            setCurrentPath(match.path.replace(/\//g, '\\'));
          } else {
            addLine('error', `Cannot find directory: ${target}`);
          }
        }
        break;
      }

      case 'type':
      case 'cat': {
        const fileName = args[0];
        if (!fileName) {
          addLine('error', 'Syntax error. Usage: type <filename>');
          break;
        }
        const files = cloudStorage.getFilesByParent(currentFolderId);
        const match = files.find((f) => f.name.toLowerCase() === fileName.toLowerCase());
        if (match && match.type === 'file') {
          addLine('output', match.content || '[Empty File]');
        } else {
          addLine('error', `The system cannot find the file specified: ${fileName}`);
        }
        break;
      }

      case 'mkdir': {
        const dirName = args.join(' ');
        if (!dirName) {
          addLine('error', 'Syntax error. Usage: mkdir <folder_name>');
          break;
        }
        cloudStorage.createFolder(dirName, currentFolderId);
        addLine('success', `Directory created: ${dirName}`);
        break;
      }

      case 'echo': {
        const text = args.join(' ');
        addLine('output', text);
        break;
      }

      case 'systeminfo':
        addLine(
          'output',
          `Host Name:                 CLOUD-PC-SIMULATOR
OS Name:                   Microsoft Windows 11 Enterprise Cloud Edition
OS Version:                10.0.26100 N/A Build 26100
System Manufacturer:       Cloud Virtualization Technology
System Model:              Cloud vNode High-Density Instance
Processor(s):              ${cloudSpecs.cpuCores} Virtual Cores: ${cloudSpecs.cpuName}
Total Cloud RAM:           ${cloudSpecs.virtualRamGb} GB DDR5 5600MHz (Zero Phone RAM Used)
Cloud Storage:             ${cloudSpecs.cloudStorageGb} GB NVMe PCIe 4.0 Storage
Server Region:             ${cloudSpecs.serverRegion}
Network Adapter:           Cloud Gigabit Uplink (980 Mbps / 12ms latency)
Local Phone Load:          0% CPU, 0% Memory (All computation runs in cloud)`
        );
        break;

      case 'ram':
      case 'free':
        addLine(
          'output',
          `VIRTUAL CLOUD RAM STATISTICS:
Total Physical Memory (Cloud):     ${cloudSpecs.virtualRamGb * 1024} MB
Available Memory:                  ${(cloudSpecs.virtualRamGb * 1024 * 0.74).toFixed(0)} MB
Cached / System Buffers:           ${(cloudSpecs.virtualRamGb * 1024 * 0.16).toFixed(0)} MB
Phone Device RAM Consumption:      0 MB (Zero local memory load)`
        );
        break;

      case 'ping': {
        const host = args[0] || 'google.com';
        addLine('output', `Pinging ${host} with 32 bytes of data:`);
        setTimeout(() => {
          addLine('output', `Reply from 142.250.190.46: bytes=32 time=1ms TTL=119`);
          addLine('output', `Reply from 142.250.190.46: bytes=32 time=1ms TTL=119`);
          addLine('output', `Reply from 142.250.190.46: bytes=32 time=1ms TTL=119`);
          addLine('output', `Reply from 142.250.190.46: bytes=32 time=1ms TTL=119`);
          addLine(
            'success',
            `Ping statistics for ${host}:\n    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = 1ms, Maximum = 2ms, Average = 1ms (Gigabit Cloud Fiber)`
          );
        }, 150);
        break;
      }

      case 'tasklist': {
        let taskOutput = 'Image Name                     PID Session Name        Mem Usage\n';
        taskOutput += '========================= ======== ================ ============\n';
        processes.forEach((p, idx) => {
          taskOutput += `${p.name.padEnd(25, ' ')} ${(1000 + idx).toString().padEnd(8, ' ')} Services        ${(
            p.memoryMb.toString() + ' K'
          ).padStart(12, ' ')}\n`;
        });
        addLine('output', taskOutput);
        break;
      }

      case 'calc': {
        try {
          const expr = args.join(' ');
          // Safe eval for basic math
          if (!expr || !/^[0-9+\-*/().\s^%]+$/.test(expr)) {
            addLine('error', 'Invalid expression. e.g. calc 128 * 4 + 30');
            break;
          }
          // eslint-disable-next-line no-eval
          const result = Function(`'use strict'; return (${expr})`)();
          addLine('success', `= ${result}`);
        } catch {
          addLine('error', 'Calculation error');
        }
        break;
      }

      case 'color': {
        const col = args[0]?.toLowerCase();
        if (col === 'green' || col === 'matrix') setTextColor('text-emerald-400');
        else if (col === 'amber' || col === 'yellow') setTextColor('text-amber-400');
        else if (col === 'cyan' || col === 'blue') setTextColor('text-cyan-400');
        else if (col === 'white') setTextColor('text-slate-100');
        else addLine('output', 'Usage: color [green | amber | cyan | white]');
        break;
      }

      case 'date':
        addLine('output', `Current Date & Time: ${new Date().toLocaleString()}`);
        break;

      case 'ver':
        addLine('output', 'Microsoft Windows [Version 10.0.26100.1882] Cloud Edition');
        break;

      default:
        addLine(
          'error',
          `'${cmd}' is not recognized as an internal or external command, operable program or batch file. Type 'help' for commands.`
        );
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(commandInput);
      setCommandInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setCommandInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setCommandInput(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setCommandInput('');
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-slate-950 text-xs font-mono select-none"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Shell Mode Selector */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border-b border-slate-800 text-[11px]">
        <button
          onClick={() => setShellType('powershell')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
            shellType === 'powershell'
              ? 'bg-sky-600/30 text-sky-300 font-semibold border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icon name="terminal" size={13} />
          <span>PowerShell</span>
        </button>
        <button
          onClick={() => setShellType('cmd')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
            shellType === 'cmd'
              ? 'bg-slate-800 text-slate-200 font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Icon name="cmd" size={13} />
          <span>Command Prompt (CMD)</span>
        </button>

        <div className="ml-auto flex items-center gap-2 text-slate-500 text-[10px]">
          <span>RAM: {cloudSpecs.virtualRamGb}GB DDR5</span>
          <span className="text-emerald-400">● Cloud Uplink</span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className={`flex-1 p-3 overflow-y-auto space-y-1 ${textColor}`}>
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'cmd'
                ? 'font-semibold text-white'
                : line.type === 'error'
                ? 'text-rose-400'
                : line.type === 'success'
                ? 'text-emerald-400'
                : textColor
            }`}
          >
            {line.text}
          </div>
        ))}

        {/* Input prompt line */}
        <div className="flex items-center text-white">
          <span className="shrink-0 mr-1.5 text-sky-400">
            {shellType === 'powershell' ? 'PS ' : ''}
            {currentPath}&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-white p-0"
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};
