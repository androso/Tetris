import React, { useCallback } from 'react';
import { useCanvas, drawCell, drawGrid } from '@/lib/tetris/hooks/useCanvas';
import { useTetris } from '@/lib/stores/useTetris';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '@/lib/tetris/constants';

const TetrisBoard: React.FC = () => {
  const { 
    board, 
    activePiece, 
    activePosition,
    shadowPosition
  } = useTetris();
  
  // Calculate canvas dimensions
  const canvasWidth = BOARD_WIDTH * CELL_SIZE;
  const canvasHeight = BOARD_HEIGHT * CELL_SIZE;
  
  // Drawing function for the canvas
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    drawGrid(ctx, BOARD_WIDTH, BOARD_HEIGHT);
    
    // Draw shadow piece (ghost piece)
    if (activePiece && shadowPosition) {
      for (let y = 0; y < activePiece.shape.length; y++) {
        for (let x = 0; x < activePiece.shape[y].length; x++) {
          if (activePiece.shape[y][x]) {
            const boardX = shadowPosition.x + x;
            const boardY = shadowPosition.y + y;
            
            // Only draw if within board boundaries
            if (
              boardX >= 0 && 
              boardX < BOARD_WIDTH && 
              boardY >= 0 && 
              boardY < BOARD_HEIGHT
            ) {
              drawCell(ctx, boardX, boardY, activePiece.color, false, true);
            }
          }
        }
      }
    }
    
    // Draw the board (filled cells)
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const cell = board[y][x];
        if (cell.filled) {
          drawCell(ctx, x, y, cell.color);
        }
      }
    }
    
    // Draw active piece
    if (activePiece) {
      for (let y = 0; y < activePiece.shape.length; y++) {
        for (let x = 0; x < activePiece.shape[y].length; x++) {
          if (activePiece.shape[y][x]) {
            const boardX = activePosition.x + x;
            const boardY = activePosition.y + y;
            
            // Only draw if within board boundaries
            if (
              boardX >= 0 && 
              boardX < BOARD_WIDTH && 
              boardY >= 0 && 
              boardY < BOARD_HEIGHT
            ) {
              drawCell(ctx, boardX, boardY, activePiece.color);
            }
          }
        }
      }
    }
  }, [board, activePiece, activePosition, shadowPosition, canvasWidth, canvasHeight]);
  
  // Create canvas reference with the draw function
  const canvasRef = useCanvas({ draw, width: canvasWidth, height: canvasHeight });
  
  return (
    <div className="tetris-board border-4 border-white">
      <canvas 
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="block"
      />
    </div>
  );
};

export default TetrisBoard;
