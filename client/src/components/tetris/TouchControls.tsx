
import React from 'react';
import { useTetris } from '@/lib/tetris/hooks/useTetris';
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
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold touch-button"
          style={{ 
            minWidth: '200px', 
            minHeight: '60px', 
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
            touchAction: 'manipulation',
            userSelect: 'none'
          }}
          onClick={() => {
            restart();
            start();
          }}
          onTouchStart={() => {
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
          onTouchStart={() => start()}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          Resume
        </button>
        <button 
          className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold"
          onClick={() => restart()}
          onTouchStart={() => restart()}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          Restart
        </button>
      </div>
    );
  }
  
  return (
    <div className="touch-controls grid grid-cols-3 gap-2 mt-4">
      {/* Left button */}
      <button
        className="bg-gray-700 text-white p-4 rounded-lg text-2xl font-bold"
        onClick={moveLeft}
        onTouchStart={moveLeft}
        style={{ touchAction: 'manipulation', userSelect: 'none' }}
      >
        ←
      </button>
      
      {/* Down and Rotate buttons */}
      <div className="flex flex-col gap-2">
        <button
          className="bg-gray-700 text-white p-4 rounded-lg text-2xl font-bold"
          onClick={drop}
          onTouchStart={drop}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          ↓
        </button>
        <button
          className="bg-gray-700 text-white p-4 rounded-lg text-2xl font-bold"
          onClick={rotateClockwise}
          onTouchStart={rotateClockwise}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          ↻
        </button>
      </div>
      
      {/* Right button */}
      <button
        className="bg-gray-700 text-white p-4 rounded-lg text-2xl font-bold"
        onClick={moveRight}
        onTouchStart={moveRight}
        style={{ touchAction: 'manipulation', userSelect: 'none' }}
      >
        →
      </button>
      
      {/* Hard drop and pause buttons */}
      <div className="col-span-3 grid grid-cols-2 gap-2 mt-2">
        <button
          className="bg-yellow-600 text-white p-3 rounded-lg text-lg font-bold"
          onClick={quickDrop}
          onTouchStart={quickDrop}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          Drop
        </button>
        <button
          className="bg-blue-600 text-white p-3 rounded-lg text-lg font-bold"
          onClick={pause}
          onTouchStart={pause}
          style={{ touchAction: 'manipulation', userSelect: 'none' }}
        >
          Pause
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
