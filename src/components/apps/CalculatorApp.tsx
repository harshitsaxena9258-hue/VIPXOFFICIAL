import React, { useState } from 'react';
import { Icon } from '../common/Icon';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isScientific, setIsScientific] = useState(false);

  const handleDigit = (digit: string) => {
    setDisplay((prev) => (prev === '0' ? digit : prev + digit));
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handleCalculate = () => {
    try {
      const fullExpr = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[0-9+\-*/().\s]+$/.test(fullExpr)) {
        setDisplay('Error');
        return;
      }
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${fullExpr})`)();
      setDisplay(String(result));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleScientificOp = (op: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    switch (op) {
      case 'sqrt':
        setDisplay(String(Math.sqrt(val)));
        break;
      case 'sqr':
        setDisplay(String(val * val));
        break;
      case 'sin':
        setDisplay(String(Math.sin((val * Math.PI) / 180).toFixed(4)));
        break;
      case 'cos':
        setDisplay(String(Math.cos((val * Math.PI) / 180).toFixed(4)));
        break;
      case 'tan':
        setDisplay(String(Math.tan((val * Math.PI) / 180).toFixed(4)));
        break;
      case 'log':
        setDisplay(String(Math.log10(val)));
        break;
      case '1/x':
        setDisplay(String(1 / val));
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none p-3 font-sans">
      {/* Header Mode toggle */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
        <span className="font-semibold text-slate-300">
          {isScientific ? 'Scientific Calculator' : 'Standard Calculator'}
        </span>
        <button
          onClick={() => setIsScientific((s) => !s)}
          className="text-sky-400 hover:text-sky-300 text-[11px] underline"
        >
          {isScientific ? 'Standard' : 'Scientific'}
        </button>
      </div>

      {/* Screen Display */}
      <div className="bg-slate-950/80 rounded-xl p-3 mb-3 text-right border border-slate-800">
        <div className="text-[11px] text-slate-500 h-4 font-mono">{equation}</div>
        <div className="text-3xl font-bold font-mono tracking-tight overflow-x-auto truncate">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="flex-1 grid grid-cols-4 gap-1.5 text-sm">
        {isScientific && (
          <>
            <button onClick={() => handleScientificOp('sin')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">sin</button>
            <button onClick={() => handleScientificOp('cos')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">cos</button>
            <button onClick={() => handleScientificOp('tan')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">tan</button>
            <button onClick={() => handleScientificOp('log')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">log</button>
            <button onClick={() => handleScientificOp('sqr')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">x²</button>
            <button onClick={() => handleScientificOp('sqrt')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">√x</button>
            <button onClick={() => handleScientificOp('1/x')} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">1/x</button>
            <button onClick={() => setDisplay(String(Math.PI))} className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium">π</button>
          </>
        )}

        <button onClick={handleClear} className="p-2 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 rounded-lg font-semibold">C</button>
        <button onClick={handleBackspace} className="p-2 bg-slate-800/70 hover:bg-slate-700 rounded-lg">⌫</button>
        <button onClick={() => handleOperator('%')} className="p-2 bg-slate-800/70 hover:bg-slate-700 rounded-lg">%</button>
        <button onClick={() => handleOperator('÷')} className="p-2 bg-sky-950/60 text-sky-400 hover:bg-sky-900/80 rounded-lg text-lg">÷</button>

        {['7', '8', '9'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-base">{n}</button>
        ))}
        <button onClick={() => handleOperator('×')} className="p-2 bg-sky-950/60 text-sky-400 hover:bg-sky-900/80 rounded-lg text-lg">×</button>

        {['4', '5', '6'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-base">{n}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="p-2 bg-sky-950/60 text-sky-400 hover:bg-sky-900/80 rounded-lg text-lg">−</button>

        {['1', '2', '3'].map((n) => (
          <button key={n} onClick={() => handleDigit(n)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-base">{n}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="p-2 bg-sky-950/60 text-sky-400 hover:bg-sky-900/80 rounded-lg text-lg">+</button>

        <button onClick={() => setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium">±</button>
        <button onClick={() => handleDigit('0')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-base">0</button>
        <button onClick={() => !display.includes('.') && setDisplay((d) => d + '.')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium text-base">.</button>
        <button onClick={handleCalculate} className="p-2 bg-sky-600 hover:bg-sky-500 rounded-lg font-bold text-lg text-white shadow">=</button>
      </div>
    </div>
  );
};
