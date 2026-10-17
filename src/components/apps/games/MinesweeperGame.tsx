import React, { useState, useEffect } from 'react';

interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export const MinesweeperGame: React.FC = () => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(MINES);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initBoard = () => {
    const newBoard: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newBoard.push(row);
    }

    // Place mines
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setMinesLeft(MINES);
    setTimer(0);
    setIsActive(false);
  };

  useEffect(() => {
    initBoard();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && !gameOver && !gameWon) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, gameOver, gameWon]);

  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon) return;
    if (!isActive) setIsActive(true);

    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (cell.isMine) {
      // Game over
      const nextBoard = board.map((row) =>
        row.map((cl) => (cl.isMine ? { ...cl, isRevealed: true } : cl))
      );
      setBoard(nextBoard);
      setGameOver(true);
      return;
    }

    // Flood fill reveal
    const nextBoard = board.map((row) => row.map((cl) => ({ ...cl })));
    const queue: [number, number][] = [[r, c]];

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const cur = nextBoard[currR][currC];
      if (cur.isRevealed || cur.isFlagged) continue;

      cur.isRevealed = true;

      if (cur.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !nextBoard[nr][nc].isRevealed) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    // Check win condition
    let unrevealedSafe = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!nextBoard[row][col].isMine && !nextBoard[row][col].isRevealed) {
          unrevealedSafe++;
        }
      }
    }

    setBoard(nextBoard);
    if (unrevealedSafe === 0) {
      setGameWon(true);
    }
  };

  const toggleFlag = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || gameWon) return;
    const cell = board[r][c];
    if (cell.isRevealed) return;

    const nextBoard = board.map((row, ri) =>
      row.map((cl, ci) => {
        if (ri === r && ci === c) {
          const nextFlag = !cl.isFlagged;
          setMinesLeft((m) => (nextFlag ? m - 1 : m + 1));
          return { ...cl, isFlagged: nextFlag };
        }
        return cl;
      })
    );
    setBoard(nextBoard);
  };

  const getNumberColor = (num: number) => {
    switch (num) {
      case 1: return 'text-sky-400';
      case 2: return 'text-emerald-400';
      case 3: return 'text-rose-400';
      case 4: return 'text-indigo-400';
      default: return 'text-amber-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none p-3 items-center justify-between text-xs font-mono">
      {/* Top Bar with LCD style displays */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg">
        <div className="bg-red-950 border border-red-800 px-2.5 py-1 text-red-500 font-bold text-sm rounded">
          {String(Math.max(0, minesLeft)).padStart(3, '0')}
        </div>

        <button
          onClick={initBoard}
          className="text-xl p-1 hover:scale-110 active:scale-95 transition-transform"
        >
          {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
        </button>

        <div className="bg-red-950 border border-red-800 px-2.5 py-1 text-red-500 font-bold text-sm rounded">
          {String(Math.min(999, timer)).padStart(3, '0')}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-9 gap-1 p-2 bg-slate-950 border-2 border-slate-800 rounded-xl">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(r, c, e)}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs rounded transition-colors ${
                cell.isRevealed
                  ? cell.isMine
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800/80'
                  : 'bg-slate-700 hover:bg-slate-600 shadow-sm'
              }`}
            >
              {cell.isRevealed ? (
                cell.isMine ? (
                  '💣'
                ) : cell.neighborMines > 0 ? (
                  <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span>
                ) : (
                  ''
                )
              ) : cell.isFlagged ? (
                '🚩'
              ) : (
                ''
              )}
            </button>
          ))
        )}
      </div>

      <div className="text-[11px] text-slate-400 text-center">
        Left Click / Tap to reveal · Right Click / Long Press to Flag
      </div>
    </div>
  );
};
