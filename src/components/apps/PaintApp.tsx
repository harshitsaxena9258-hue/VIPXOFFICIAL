import React, { useRef, useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { cloudStorage } from '../../services/cloudStorage';
import { Icon } from '../common/Icon';

export const PaintApp: React.FC = () => {
  const { addNotification } = useOS();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0078d4');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

  const COLORS = [
    '#ffffff', '#000000', '#0078d4', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveToPictures = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const fileName = `artwork_${Date.now()}.png`;

    cloudStorage.createFile(fileName, 'folder-pictures', dataUrl, 'png');
    addNotification('Saved to Cloud Pictures', `Saved "${fileName}" to Cloud Storage without using phone storage.`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none text-xs">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`p-1.5 rounded flex items-center gap-1 transition-colors ${
              tool === 'brush' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Icon name="palette" size={14} />
            <span>Brush</span>
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded flex items-center gap-1 transition-colors ${
              tool === 'eraser' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Icon name="edit" size={14} />
            <span>Eraser</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Brush size */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Size:</span>
            <input
              type="range"
              min={1}
              max={24}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-16 accent-sky-500"
            />
            <span className="font-mono text-white">{brushSize}px</span>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Color Palette */}
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setTool('brush');
                }}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full border transition-transform ${
                  color === c && tool === 'brush' ? 'scale-125 border-white ring-2 ring-sky-500' : 'border-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            Clear
          </button>
          <button
            onClick={handleSaveToPictures}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium shadow"
          >
            <Icon name="download" size={13} />
            <span>Save to Cloud</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto bg-slate-950 p-3 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={420}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white rounded-lg shadow-xl cursor-crosshair touch-none max-w-full"
        />
      </div>
    </div>
  );
};
