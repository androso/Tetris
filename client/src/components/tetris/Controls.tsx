import React from 'react';
import { useGame } from '@/lib/tetris/hooks/useGame';
import { GameState } from '@/lib/tetris/constants';

interface ControlsProps {
  className?: string;
}

const Controls: React.FC<ControlsProps> = ({ className = '' }) => {
  const { gameState, startGame, pauseGame, restartGame } = useGame();
  
  // Render different controls based on game state
  if (gameState === GameState.READY || gameState === GameState.GAME_OVER) {
    return (
      <div className={`controls ${className}`}>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg w-full"
          onClick={() => {
            restartGame();
            startGame();
          }}
        >
          {gameState === GameState.READY ? 'Start Game' : 'Play Again'}
        </button>
      </div>
    );
  }
  
  if (gameState === GameState.PLAYING) {
    return (
      <div className={`controls ${className} flex gap-2`}>
        <button 
          className="bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm flex-1"
          onClick={pauseGame}
        >
          Pause
        </button>
        <button 
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex-1"
          onClick={restartGame}
        >
          Restart
        </button>
      </div>
    );
  }
  
  // Paused state
  return (
    <div className={`controls ${className} flex gap-2`}>
      <button 
        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex-1"
        onClick={startGame}
      >
        Resume
      </button>
      <button 
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex-1"
        onClick={restartGame}
      >
        Restart
      </button>
    </div>
  );
};

export default Controls;
