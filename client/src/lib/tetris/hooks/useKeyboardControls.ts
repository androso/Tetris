import { useEffect, useCallback } from 'react';
import { useTetris } from '../../stores/useTetris';
import { GameState } from '../constants';

export function useKeyboardControls() {
  const {
    gameState,
    moveLeft,
    moveRight,
    rotateClockwise,
    rotateCounterClockwise,
    drop,
    quickDrop,
    start,
    pause,
    restart
  } = useTetris();
  
  // Handle keydown events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for game controls
    if ([
      'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp',
      'Space', 'KeyZ', 'KeyX', 'KeyP', 'KeyR', 'Enter'
    ].includes(event.code)) {
      event.preventDefault();
    }
    
    // Game controls active only when playing
    if (gameState === GameState.PLAYING) {
      switch (event.code) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          drop();
          break;
        case 'ArrowUp':
        case 'KeyX':
          rotateClockwise();
          break;
        case 'KeyZ':
          rotateCounterClockwise();
          break;
        case 'Space':
          quickDrop();
          break;
        case 'KeyP':
          pause();
          break;
      }
    }
    
    // Controls that work regardless of game state
    switch (event.code) {
      case 'Enter':
        if (gameState === GameState.READY || gameState === GameState.GAME_OVER) {
          restart();
          start();
        } else if (gameState === GameState.PAUSED) {
          start();
        }
        break;
      case 'KeyP':
        if (gameState === GameState.PLAYING) {
          pause();
        } else if (gameState === GameState.PAUSED) {
          start();
        }
        break;
      case 'KeyR':
        restart();
        break;
    }
  }, [
    gameState,
    moveLeft,
    moveRight,
    rotateClockwise,
    rotateCounterClockwise,
    drop,
    quickDrop,
    start,
    pause,
    restart
  ]);
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
