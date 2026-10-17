import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../../common/Icon';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dirRef = useRef<Direction>(direction);
  dirRef.current = direction;

  const generateFood = (): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setFood(generateFood());
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (dirRef.current) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, highScore]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dirRef.current !== 'DOWN') setDirection('UP');
      if (['ArrowDown', 'KeyS'].includes(e.code) && dirRef.current !== 'UP') setDirection('DOWN');
      if (['ArrowLeft', 'KeyA'].includes(e.code) && dirRef.current !== 'RIGHT') setDirection('LEFT');
      if (['ArrowRight', 'KeyD'].includes(e.code) && dirRef.current !== 'LEFT') setDirection('RIGHT');
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white select-none p-3 items-center justify-between">
      {/* Score Header */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
        <div>Score: <strong className="text-emerald-400">{score}</strong></div>
        <div>Best: <strong className="text-amber-400">{highScore}</strong></div>
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-slate-900 border-2 border-slate-800 rounded-xl overflow-hidden grid grid-cols-20 grid-rows-20 p-1">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);

          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              className={`w-full h-full rounded-sm ${
                isHead
                  ? 'bg-emerald-400 shadow-sm'
                  : isBody
                  ? 'bg-emerald-600'
                  : isFood
                  ? 'bg-rose-500 rounded-full animate-pulse'
                  : 'bg-slate-900/40'
              }`}
            />
          );
        })}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h3 className="text-xl font-bold text-rose-500 mb-1">GAME OVER</h3>
            <p className="text-xs text-slate-400 mb-3">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs shadow"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch On-Screen D-Pad */}
      <div className="w-full flex justify-center py-1">
        <div className="grid grid-cols-3 gap-1 w-36">
          <div />
          <button
            onClick={() => dirRef.current !== 'DOWN' && setDirection('UP')}
            className="p-3 bg-slate-800 active:bg-sky-600 rounded-lg flex items-center justify-center text-white"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => dirRef.current !== 'RIGHT' && setDirection('LEFT')}
            className="p-3 bg-slate-800 active:bg-sky-600 rounded-lg flex items-center justify-center text-white"
          >
            ◀
          </button>
          <button
            onClick={resetGame}
            className="p-2 bg-slate-900 border border-slate-700 active:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400"
          >
            RESET
          </button>
          <button
            onClick={() => dirRef.current !== 'LEFT' && setDirection('RIGHT')}
            className="p-3 bg-slate-800 active:bg-sky-600 rounded-lg flex items-center justify-center text-white"
          >
            ▶
          </button>
          <div />
          <button
            onClick={() => dirRef.current !== 'UP' && setDirection('DOWN')}
            className="p-3 bg-slate-800 active:bg-sky-600 rounded-lg flex items-center justify-center text-white"
          >
            ▼
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
