import React from 'react';
import { useTetris } from '@/lib/stores/useTetris';
import { GameState } from '@/lib/tetris/constants';

interface TouchControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const TouchControls: React.FC<TouchControlsProps> = ({ containerRef }) => {
  const {
    gameState,
    moveLeft,
    moveRight,
    rotateClockwise,
    drop,
    quickDrop,
    start,
    pause,
    restart
  } = useTetris();
  
  // Only render controls during gameplay
  if (gameState === GameState.READY || gameState === GameState.GAME_OVER) {
    return (
      <div className="touch-controls flex justify-center mt-4">
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold"
          onClick={() => {
            restart();
            start();
          }}
        >
          {gameState === GameState.READY ? 'Start Game' : 'Play Again'}
        </button>
      </div>
    );
  }
  
  if (gameState === GameState.PAUSED) {
    return (
      <div className="touch-controls flex justify-center mt-4 space-x-4">
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold"
          onClick={() => start()}
        >
          Resume
        </button>
        <button 
          className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold"
          onClick={() => restart()}
        >
          Restart
        </button>
      </div>
    );
  }
  
  return (
    <div className="touch-controls flex justify-between mt-4">
      <div className="flex space-x-2">
        <button 
          className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white"
          onTouchStart={() => moveLeft()}
        >
          ←
        </button>
        <button 
          className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white"
          onTouchStart={() => moveRight()}
        >
          →
        </button>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white"
          onTouchStart={() => drop()}
        >
          ↓
        </button>
        <button 
          className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl border-2 border-white"
          onTouchStart={() => rotateClockwise()}
        >
          ↻
        </button>
        <button 
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center text-md border-2 border-white"
          onTouchStart={() => pause()}
        >
          II
        </button>
      </div>
    </div>
  );
};

export default TouchControls;