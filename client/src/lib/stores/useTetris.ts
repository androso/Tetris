import { create } from "zustand";
import {
  Cell,
  GameStateInterface,
  initializeGame,
  moveDown,
  moveHorizontal,
  rotatePiece,
  hardDrop,
  getShadowPosition,
  shouldDropPiece,
  resetGame,
  togglePause,
  Position
} from "../tetris/gameEngine";
import { GameState } from "../tetris/constants";
import { Tetromino } from "../tetris/tetrominos";

interface TetrisState extends GameStateInterface {
  shadowPosition: Position | null;
  
  // Game actions
  moveLeft: () => void;
  moveRight: () => void;
  rotateClockwise: () => void;
  rotateCounterClockwise: () => void;
  drop: () => void;
  quickDrop: () => void;
  tick: () => void;
  start: () => void;
  pause: () => void;
  restart: () => void;
}

// Create the store with game state and actions
export const useTetris = create<TetrisState>((set, get) => {
  const initialState = initializeGame();
  
  return {
    ...initialState,
    shadowPosition: getShadowPosition(initialState),
    
    moveLeft: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = moveHorizontal(state, 'left');
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState)
        };
      });
    },
    
    moveRight: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = moveHorizontal(state, 'right');
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState)
        };
      });
    },
    
    rotateClockwise: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = rotatePiece(state, 'clockwise');
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState)
        };
      });
    },
    
    rotateCounterClockwise: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = rotatePiece(state, 'counterClockwise');
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState)
        };
      });
    },
    
    drop: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = moveDown(state);
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState),
          // Add points for soft drop
          score: newState.score + 1
        };
      });
    },
    
    quickDrop: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      set(state => {
        const newState = hardDrop(state);
        return {
          ...newState,
          shadowPosition: getShadowPosition(newState)
        };
      });
    },
    
    tick: () => {
      const state = get();
      if (state.gameState !== GameState.PLAYING) return;
      
      if (shouldDropPiece(state.lastDropTime, state.level)) {
        set(state => {
          const newState = moveDown(state);
          return {
            ...newState,
            shadowPosition: getShadowPosition(newState)
          };
        });
      }
    },
    
    start: () => {
      set(state => {
        if (state.gameState === GameState.READY || state.gameState === GameState.PAUSED) {
          return { ...state, gameState: GameState.PLAYING };
        }
        return state;
      });
    },
    
    pause: () => {
      set(state => togglePause(state));
    },
    
    restart: () => {
      const newState = resetGame();
      set({
        ...newState,
        shadowPosition: getShadowPosition(newState)
      });
    }
  };
});
