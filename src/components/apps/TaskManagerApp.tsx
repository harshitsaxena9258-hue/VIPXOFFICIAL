import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Icon } from '../common/Icon';

export const TaskManagerApp: React.FC = () => {
  const { cloudSpecs, processes, killProcess, addNotification } = useOS();
  const [activeTab, setActiveTab] = useState<'processes' | 'performance'>('performance');
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  // Dynamic simulation telemetry
  const [cpuUsage, setCpuUsage] = useState(14);
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 18, 14, 22, 16, 11, 15, 13, 19, 14]);
  const [ramUsedGb, setRamUsedGb] = useState(7.2);
  const [diskThroughput, setDiskThroughput] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextCpu = Math.floor(Math.random() * 15 + 8);
      setCpuUsage(nextCpu);
      setCpuHistory((prev) => [...prev.slice(1), nextCpu]);

      const baseRam = 6.8 + (processes.length * 0.4);
      setRamUsedGb(parseFloat((baseRam + (Math.random() * 0.4)).toFixed(1)));
      setDiskThroughput(Math.floor(Math.random() * 60 + 20));
    }, 1500);

    return () => clearInterval(interval);
  }, [processes.length]);

  const handleEndTask = () => {
    if (!selectedProcessId) return;
    const proc = processes.find((p) => p.id === selectedProcessId);
    if (!proc) return;
    killProcess(selectedProcessId);
    addNotification('Task Ended', `Terminated "${proc.name}" process.`);
    setSelectedProcessId(null);
  };

  const ramPercentage = Math.round((ramUsedGb / cloudSpecs.virtualRamGb) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none text-xs">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'performance'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('processes')}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'processes'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Processes ({processes.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'processes' && selectedProcessId && (
            <button
              onClick={handleEndTask}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-medium text-[11px]"
            >
              End Task
            </button>
          )}
        </div>
      </div>

      {activeTab === 'performance' ? (
        /* Performance Charts & Specs */
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Top Banner: Zero Phone Load */}
          <div className="p-3 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Icon name="shield" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-300 text-xs">Zero Phone RAM & Storage Impact</h4>
                <p className="text-[11px] text-slate-400">
                  All virtual computation and storage run entirely on isolated remote Cloud infrastructure.
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-emerald-400 font-bold text-sm">100% Cloud-Powered</div>
              <div className="text-[10px] text-slate-400">Host Latency: {cloudSpecs.pingMs} ms</div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* CPU */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Virtual CPU</span>
                  <div className="text-xl font-bold text-sky-400">{cpuUsage}%</div>
                </div>
                <Icon name="cpu" size={20} className="text-sky-400" />
              </div>

              {/* Sparkline */}
              <div className="h-10 flex items-end gap-1 bg-slate-900/80 p-1 rounded">
                {cpuHistory.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-sky-500 rounded-t"
                    style={{ height: `${Math.max(10, val * 2.5)}%` }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {cloudSpecs.cpuCores} Cores @ 4.20 GHz
              </div>
            </div>

            {/* RAM */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Virtual Cloud RAM</span>
                  <div className="text-xl font-bold text-indigo-400">
                    {ramUsedGb} / {cloudSpecs.virtualRamGb} GB
                  </div>
                </div>
                <Icon name="layers" size={20} className="text-indigo-400" />
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${ramPercentage}%` }} />
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>DDR5 5600 MHz</span>
                <span>{ramPercentage}% in use</span>
              </div>
            </div>

            {/* NVMe Disk */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Cloud NVMe Disk</span>
                  <div className="text-xl font-bold text-amber-400">{diskThroughput} MB/s</div>
                </div>
                <Icon name="hard-drive" size={20} className="text-amber-400" />
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[24%]" />
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Total Pool: {cloudSpecs.cloudStorageGb} GB</span>
                <span>Active I/O</span>
              </div>
            </div>

            {/* Network */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Cloud Uplink</span>
                  <div className="text-xl font-bold text-cyan-400">{cloudSpecs.networkSpeedMbps} Mbps</div>
                </div>
                <Icon name="wifi" size={20} className="text-cyan-400" />
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[85%]" />
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>Ping: {cloudSpecs.pingMs} ms</span>
                <span>Gigabit Fiber</span>
              </div>
            </div>
          </div>

          {/* System Details Box */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <h3 className="font-semibold text-slate-200 text-sm">Virtual Hardware Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2.5 text-xs">
              <div>
                <span className="text-slate-500 block">Virtual Processor:</span>
                <span className="text-slate-200 font-medium">{cloudSpecs.cpuName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cloud Memory (RAM):</span>
                <span className="text-slate-200 font-medium">{cloudSpecs.virtualRamGb} GB DDR5 High-Bandwidth</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cloud Storage Pool:</span>
                <span className="text-slate-200 font-medium">{cloudSpecs.cloudStorageGb} GB High-Speed NVMe PCIe 4.0</span>
              </div>
              <div>
                <span className="text-slate-500 block">Datacenter Node:</span>
                <span className="text-slate-200 font-medium">{cloudSpecs.serverRegion}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cloud Session Uptime:</span>
                <span className="text-slate-200 font-medium">{cloudSpecs.uptimeHours} Hours 24 Min</span>
              </div>
              <div>
                <span className="text-slate-500 block">Operating System:</span>
                <span className="text-slate-200 font-medium">Windows 11 Enterprise (Cloud Edition)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Processes Table */
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 text-[11px] sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">CPU</th>
                <th className="p-2.5">Memory (Cloud RAM)</th>
                <th className="p-2.5">Disk I/O</th>
                <th className="p-2.5">Network</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {processes.map((proc) => {
                const isSelected = selectedProcessId === proc.id;
                return (
                  <tr
                    key={proc.id}
                    onClick={() => setSelectedProcessId(proc.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-500/20 text-white' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-2.5 font-medium flex items-center gap-2">
                      <Icon name={proc.appId ? 'activity' : 'shield'} size={14} className="text-sky-400" />
                      <span>{proc.name}</span>
                    </td>
                    <td className="p-2.5">
                      <span className="text-emerald-400">{proc.status}</span>
                    </td>
                    <td className="p-2.5 font-mono">{proc.cpu}%</td>
                    <td className="p-2.5 font-mono">{proc.memoryMb} MB</td>
                    <td className="p-2.5 font-mono">{proc.diskIoMbps} MB/s</td>
                    <td className="p-2.5 font-mono">{proc.networkKbps} Kbps</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400">
        <div>Processes: {processes.length} | Threads: 184</div>
        <div className="flex items-center gap-2">
          <span>Virtual Hypervisor Active</span>
          <span className="text-emerald-400">● 100% Free Cloud Specs</span>
        </div>
      </div>
    </div>
  );
};
