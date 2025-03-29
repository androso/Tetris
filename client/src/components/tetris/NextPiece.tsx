import React, { useCallback } from 'react';
import { useCanvas, drawCell } from '@/lib/tetris/hooks/useCanvas';
import { useTetris } from '@/lib/stores/useTetris';
import { CELL_SIZE } from '@/lib/tetris/constants';
import { useIsMobile } from '@/hooks/use-is-mobile';

const NextPiece: React.FC = () => {
  const { nextPiece } = useTetris();
  const isMobile = useIsMobile();
  
  // Calculate canvas size based on the maximum tetromino size (4x4)
  const previewSize = 4;
  // Use smaller cell size for mobile view to fit better in the layout
  const mobileCellSize = Math.floor(CELL_SIZE * 0.7);
  const actualCellSize = isMobile ? mobileCellSize : CELL_SIZE;
  const canvasSize = previewSize * actualCellSize;
  
  // Drawing function for the canvas
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    
    if (nextPiece) {
      const shape = nextPiece.shape;
      const color = nextPiece.color;
      
      // Calculate center offset to position the piece in the middle
      const shapeWidth = shape[0].length;
      const shapeHeight = shape.length;
      const offsetX = Math.floor((previewSize - shapeWidth) / 2);
      const offsetY = Math.floor((previewSize - shapeHeight) / 2);
      
      // Draw the tetromino
      for (let y = 0; y < shapeHeight; y++) {
        for (let x = 0; x < shapeWidth; x++) {
          if (shape[y][x]) {
            // Use the smaller cell size for mobile
            const cellSize = actualCellSize;
            
            // Simplified drawCell implementation with size adjustment
            const xPos = (x + offsetX) * cellSize;
            const yPos = (y + offsetY) * cellSize;
            
            // Inner fill
            ctx.fillStyle = color;
            ctx.fillRect(xPos, yPos, cellSize, cellSize);
            
            // Highlight (top and left edges)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(xPos, yPos, cellSize, 2); // top edge
            ctx.fillRect(xPos, yPos, 2, cellSize); // left edge
            
            // Shadow (bottom and right edges)
            ctx.fillStyle = '#000000';
            ctx.fillRect(xPos, yPos + cellSize - 2, cellSize, 2); // bottom edge
            ctx.fillRect(xPos + cellSize - 2, yPos, 2, cellSize); // right edge
          }
        }
      }
    }
  }, [nextPiece, canvasSize, actualCellSize]);
  
  // Create canvas reference with the draw function
  const canvasRef = useCanvas({ draw, width: canvasSize, height: canvasSize });
  
  return (
    <div className={`next-piece bg-gray-900 ${isMobile ? 'p-2' : 'p-3'} rounded-lg`}>
      <h3 className={`text-white text-center ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>NEXT</h3>
      <div className={`border-2 border-white ${isMobile ? 'border' : 'border-2'}`}>
        <canvas 
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block"
        />
      </div>
    </div>
  );
};

export default NextPiece;
