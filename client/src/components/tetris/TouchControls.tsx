import React from 'react';
import { useTetris } from '../../lib/stores/useTetris';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { GameState } from '../../lib/tetris/constants';

interface TouchControlsProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const TouchControls: React.FC<TouchControlsProps> = ({ containerRef }) => {
  const { gameState, start, restart } = useTetris();
  const isMobile = useIsMobile();

  // Don't render touch controls on desktop
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-10">
      {(gameState === GameState.IDLE || gameState === GameState.GAME_OVER) && (
        <button 
          className="touch-button bg-blue-500 text-white py-3 px-8 rounded-full shadow-lg text-lg font-bold"
          onClick={gameState === GameState.IDLE ? start : restart}
        >
          {gameState === GameState.IDLE ? 'Start Game' : 'Play Again'}
        </button>
      )}
    </div>
  );
};

export default TouchControls;