import React from 'react';
import { useTetris } from '../../lib/stores/useTetris';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { GameState } from '../../lib/tetris/constants';

interface TouchControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const TouchControls: React.FC<TouchControlsProps> = ({ containerRef }) => {
  const { gameState, start, restart, pause } = useTetris();
  const isMobile = useIsMobile();

  // Don't render touch controls on desktop
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center z-10">
      {gameState === GameState.READY && (
        <div className="text-white bg-black bg-opacity-70 mb-6 p-4 rounded-lg text-center text-sm">
          <h3 className="font-bold mb-2">Mobile Controls:</h3>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>👆 Tap: Rotate piece</li>
            <li>👆👆 Double Tap: Hard drop</li>
            <li>👈👉 Swipe left/right: Move piece</li>
            <li>👇 Swipe down: Soft drop</li>
          </ul>
        </div>
      )}
      
      {(gameState === GameState.READY || gameState === GameState.GAME_OVER) && (
        <button 
          className="touch-button bg-blue-500 text-white py-3 px-8 rounded-full shadow-lg text-lg font-bold"
          style={{ touchAction: 'manipulation' }}
          onTouchStart={(e) => e.preventDefault()}
          onTouchEnd={(e) => {
            e.preventDefault();
            const tetris = useTetris.getState();
            gameState === GameState.READY ? tetris.start() : tetris.restart();
          }}
        >
          {gameState === GameState.READY ? 'Start Game' : 'Play Again'}
        </button>
      )}
      
      {gameState === GameState.PLAYING && (
        <button 
          className="touch-button bg-yellow-500 text-white py-2 px-6 rounded-full shadow-lg text-md font-bold"
          style={{ touchAction: 'manipulation' }}
          onTouchStart={(e) => e.preventDefault()}
          onTouchEnd={(e) => {
            e.preventDefault();
            const tetris = useTetris.getState();
            tetris.pause();
          }}
        >
          Pause
        </button>
      )}
      
      {gameState === GameState.PAUSED && (
        <div className="flex gap-3">
          <button 
            className="touch-button bg-green-500 text-white py-2 px-6 rounded-full shadow-lg text-md font-bold"
            style={{ touchAction: 'manipulation' }}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => {
              e.preventDefault();
              const tetris = useTetris.getState();
              tetris.start();
            }}
          >
            Resume
          </button>
          <button 
            className="touch-button bg-red-500 text-white py-2 px-6 rounded-full shadow-lg text-md font-bold"
            style={{ touchAction: 'manipulation' }}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => {
              e.preventDefault();
              const tetris = useTetris.getState();
              tetris.restart();
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default TouchControls;