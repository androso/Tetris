import React, { useCallback, useEffect, useState } from 'react';
import { useCanvas, drawCell, drawGrid } from '@/lib/tetris/hooks/useCanvas';
import { useTetris } from '@/lib/stores/useTetris';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE } from '@/lib/tetris/constants';
import { useIsMobile } from '@/hooks/use-is-mobile';

const TetrisBoard: React.FC = () => {
  const { 
    board, 
    activePiece, 
    activePosition,
    shadowPosition
  } = useTetris();
  const isMobile = useIsMobile();
  
  // Calculate the best cell size for mobile based on available width
  const [mobileCellSize, setMobileCellSize] = useState(CELL_SIZE * 0.8);
  
  useEffect(() => {
    if (isMobile) {
      // Calculate suitable cell size based on screen width
      // Leave some space for the next piece display (about 30% of width)
      const calculateCellSize = () => {
        const availableWidth = window.innerWidth * 0.65; // 65% of screen width
        const calculatedSize = Math.floor(availableWidth / BOARD_WIDTH);
        setMobileCellSize(calculatedSize);
      };
      
      calculateCellSize();
      
      // Update on resize
      window.addEventListener('resize', calculateCellSize);
      return () => window.removeEventListener('resize', calculateCellSize);
    }
  }, [isMobile]);
  
  // Use appropriate cell size based on device
  const actualCellSize = isMobile ? mobileCellSize : CELL_SIZE;
  
  // Calculate canvas dimensions
  const canvasWidth = BOARD_WIDTH * actualCellSize;
  const canvasHeight = BOARD_HEIGHT * actualCellSize;
  
  // Drawing function for the canvas
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    drawGrid(ctx, BOARD_WIDTH, BOARD_HEIGHT, actualCellSize);
    
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
              const xPos = boardX * actualCellSize;
              const yPos = boardY * actualCellSize;
              
              // Draw shadow cell
              ctx.fillStyle = activePiece.color + '50'; // 50% opacity
              ctx.fillRect(xPos, yPos, actualCellSize, actualCellSize);
              
              // Draw outline
              ctx.strokeStyle = activePiece.color + '80'; // 80% opacity
              ctx.lineWidth = 1;
              ctx.strokeRect(xPos, yPos, actualCellSize, actualCellSize);
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
          // Use custom drawing for different cell sizes
          const xPos = x * actualCellSize;
          const yPos = y * actualCellSize;
          
          // Inner fill
          ctx.fillStyle = cell.color;
          ctx.fillRect(xPos, yPos, actualCellSize, actualCellSize);
          
          // Highlight (top and left edges)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(xPos, yPos, actualCellSize, isMobile ? 1 : 2); // top edge
          ctx.fillRect(xPos, yPos, isMobile ? 1 : 2, actualCellSize); // left edge
          
          // Shadow (bottom and right edges)
          ctx.fillStyle = '#000000';
          const shadowWidth = isMobile ? 1 : 2;
          ctx.fillRect(xPos, yPos + actualCellSize - shadowWidth, actualCellSize, shadowWidth); // bottom
          ctx.fillRect(xPos + actualCellSize - shadowWidth, yPos, shadowWidth, actualCellSize); // right
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
              // Use custom drawing for different cell sizes
              const xPos = boardX * actualCellSize;
              const yPos = boardY * actualCellSize;
              
              // Inner fill
              ctx.fillStyle = activePiece.color;
              ctx.fillRect(xPos, yPos, actualCellSize, actualCellSize);
              
              // Highlight (top and left edges)
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(xPos, yPos, actualCellSize, isMobile ? 1 : 2); // top edge
              ctx.fillRect(xPos, yPos, isMobile ? 1 : 2, actualCellSize); // left edge
              
              // Shadow (bottom and right edges)
              ctx.fillStyle = '#000000';
              const shadowWidth = isMobile ? 1 : 2;
              ctx.fillRect(xPos, yPos + actualCellSize - shadowWidth, actualCellSize, shadowWidth); // bottom
              ctx.fillRect(xPos + actualCellSize - shadowWidth, yPos, shadowWidth, actualCellSize); // right
            }
          }
        }
      }
    }
  }, [board, activePiece, activePosition, shadowPosition, canvasWidth, canvasHeight, actualCellSize, isMobile]);
  
  // Create canvas reference with the draw function
  const canvasRef = useCanvas({ draw, width: canvasWidth, height: canvasHeight });
  
  return (
    <div className={`tetris-board ${isMobile ? 'border-2' : 'border-4'} border-white`}>
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
