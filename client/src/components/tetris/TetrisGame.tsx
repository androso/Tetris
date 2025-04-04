import React, { useRef, useEffect } from 'react';
import TetrisBoard from './TetrisBoard';
import NextPiece from './NextPiece';
import Score from './Score';
import Controls from './Controls';
import TouchControls from './TouchControls';
import { useKeyboardControls } from '@/lib/tetris/hooks/useKeyboardControls';
import { useTouchControls as useTouchControlsHook } from '@/lib/tetris/hooks/useTouchControls';
import { useTetris } from '@/lib/stores/useTetris';
import { GameState } from '@/lib/tetris/constants';
import { useTetrisAudio } from '@/lib/tetris/hooks/useAudio';

const TetrisGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameState, start, pause, restart, tick } = useTetris();
  const { toggleMute, isMuted } = useTetrisAudio();

  // Set up game loop using requestAnimationFrame
  useEffect(() => {
    let frameId: number;

    const gameLoop = () => {
      // Only run tick when game is playing
      if (gameState === GameState.PLAYING) {
        tick();
      }

      frameId = requestAnimationFrame(gameLoop);
    };

    frameId = requestAnimationFrame(gameLoop);

    // Clean up the animation frame on unmount
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [gameState, tick]);

  // Set up keyboard controls
  useKeyboardControls();

  // Set up touch controls
  useTouchControlsHook(containerRef);

  return (
    <div 
      ref={containerRef}
      className="tetris-game flex flex-col md:flex-row justify-center items-center p-4 gap-4 w-full max-w-screen-lg"
      style={{ fontFamily: '"Press Start 2P", cursive' }}
    >
      {/* Game title */}
      <h1 className="text-center text-3xl text-white mb-2 tracking-wider">TETRIS</h1>
      
      {/* Mobile layout: Top section with game board and next piece side by side */}
      <div className="w-full flex flex-row justify-center items-start gap-2">
        {/* Main game area */}
        <div className="game-area relative flex-grow">
          {/* Main game board */}
          <TetrisBoard />

          {/* Overlays for different game states */}
          {gameState === GameState.READY && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-center">
                <h2 className="text-white text-xl md:text-2xl mb-4 md:mb-6">Press ENTER to Start</h2>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-lg md:text-xl"
                  onClick={start}
                  style={{ touchAction: 'manipulation' }}
                  onTouchStart={(e) => {
                    // Prevent default behavior to avoid scrolling
                    e.preventDefault();
                  }}
                  onTouchEnd={(e) => {
                    // Prevent default and start the game
                    e.preventDefault();
                    start();
                  }}
                >
                  Start Game
                </button>
              </div>
            </div>
          )}

          {gameState === GameState.PAUSED && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-center">
                <h2 className="text-white text-xl md:text-2xl mb-4 md:mb-6">PAUSED</h2>
                <div className="flex gap-2 md:gap-4 justify-center">
                  <button 
                    className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-lg"
                    style={{ touchAction: 'manipulation' }}
                    onTouchStart={(e) => e.preventDefault()}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      start();
                    }}
                  >
                    Resume
                  </button>
                  <button 
                    className="bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-lg"
                    style={{ touchAction: 'manipulation' }}
                    onTouchStart={(e) => e.preventDefault()}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      restart();
                    }}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === GameState.GAME_OVER && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-center">
                <h2 className="text-white text-xl md:text-2xl mb-3 md:mb-4">GAME OVER</h2>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-md md:text-lg mt-2 md:mt-4"
                  style={{ touchAction: 'manipulation' }}
                  onTouchStart={(e) => {
                    // Prevent default behavior to avoid scrolling
                    e.preventDefault();
                  }}
                  onTouchEnd={(e) => {
                    // Prevent default and restart the game
                    e.preventDefault();
                    restart();
                    start();
                  }}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile layout: Game info including next piece and score */}
        <div className="game-info-mobile md:hidden flex flex-col gap-2">
          {/* Next piece preview */}
          <NextPiece />

          {/* Score panel for mobile view */}
          <Score />

          {/* Sound toggle for mobile */}
          <button 
            className="bg-gray-800 text-white px-3 py-1 rounded-lg text-xs flex items-center justify-center gap-1"
            style={{ touchAction: 'manipulation' }}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMute();
            }}
          >
            {isMuted ? "🔇 Off" : "🔊 On"}
          </button>
        </div>

        {/* Desktop layout: Game info panel */}
        <div className="game-info hidden md:flex flex-col gap-6">
          {/* Next piece preview */}
          <NextPiece />

          {/* Score, level, and lines */}
          <Score />

          {/* Sound toggle */}
          <button 
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
            style={{ touchAction: 'manipulation' }}
            onTouchStart={(e) => e.preventDefault()}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMute();
            }}
          >
            {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
          </button>

          {/* Game controls for desktop */}
          <div className="hidden md:block">
            <h3 className="text-white text-sm mb-2">CONTROLS</h3>
            <div className="text-gray-300 text-xs space-y-1">
              <div>⬅️➡️ - Move</div>
              <div>⬆️ - Rotate</div>
              <div>⬇️ - Soft Drop</div>
              <div>SPACE - Hard Drop</div>
              <div>P - Pause</div>
              <div>R - Restart</div>
            </div>
          </div>
        </div>
      </div>

      {/* Touch controls (mobile only) */}
      <div className="md:hidden w-full mt-2">
        <TouchControls containerRef={containerRef} />
      </div>
    </div>
  );
};

export default TetrisGame;