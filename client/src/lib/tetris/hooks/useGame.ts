import { useEffect, useCallback } from 'react';
import { useTetris } from '../../stores/useTetris';
import { GameState } from '../constants';

export function useGame() {
  const {
    gameState,
    tick,
    start,
    pause,
    restart
  } = useTetris();

  // Set up game loop using requestAnimationFrame
  useEffect(() => {
    let frameId: number;
    let lastTime = 0;

    const gameLoop = (time: number) => {
      // Don't update on first frame
      if (lastTime !== 0) {
        // Only run tick when game is playing
        if (gameState === GameState.PLAYING) {
          tick();
        }
      }
      
      lastTime = time;
      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);

    // Clean up the animation frame on unmount
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [gameState, tick]);

  // Start the game
  const handleStart = useCallback(() => {
    start();
  }, [start]);

  // Pause the game
  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  // Restart the game
  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  return {
    gameState,
    startGame: handleStart,
    pauseGame: handlePause,
    restartGame: handleRestart
  };
}
