import React, { useCallback } from 'react';
import { useCanvas, drawCell } from '@/lib/tetris/hooks/useCanvas';
import { useTetris } from '@/lib/stores/useTetris';
import { CELL_SIZE } from '@/lib/tetris/constants';

const NextPiece: React.FC = () => {
  const { nextPiece } = useTetris();
  
  // Calculate canvas size based on the maximum tetromino size (4x4)
  const previewSize = 4;
  const canvasSize = previewSize * CELL_SIZE;
  
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
            drawCell(ctx, x + offsetX, y + offsetY, color);
          }
        }
      }
    }
  }, [nextPiece, canvasSize]);
  
  // Create canvas reference with the draw function
  const canvasRef = useCanvas({ draw, width: canvasSize, height: canvasSize });
  
  return (
    <div className="next-piece bg-gray-900 p-3 rounded-lg">
      <h3 className="text-white text-center text-sm mb-2">NEXT</h3>
      <div className="border-2 border-white">
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
