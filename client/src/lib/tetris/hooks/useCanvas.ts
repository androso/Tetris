import { useRef, useEffect } from 'react';
import { CELL_SIZE } from '../constants';
import { Cell } from '../gameEngine';
import { Position } from '../tetrominos';

interface UseCanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}

// Hook for rendering and updating canvas
export function useCanvas({ draw, width, height }: UseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set correct canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Run the draw callback
    draw(context);
  }, [draw, width, height]);

  return canvasRef;
}

// Helper to draw a single cell
export function drawCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number, 
  color: string,
  isEmpty: boolean = false,
  isGhost: boolean = false
) {
  const cellX = x * CELL_SIZE;
  const cellY = y * CELL_SIZE;
  
  // Draw cell background
  ctx.fillStyle = isEmpty ? 'transparent' : color;
  ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
  
  // Draw cell border
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.strokeRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
  
  // Draw inner highlight/shadow for 3D effect
  if (!isEmpty && !isGhost) {
    // Lighter shade for top and left edges
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(cellX, cellY);
    ctx.lineTo(cellX + CELL_SIZE, cellY);
    ctx.lineTo(cellX, cellY + CELL_SIZE);
    ctx.fill();
    
    // Darker shade for bottom and right edges
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cellX + CELL_SIZE, cellY);
    ctx.lineTo(cellX + CELL_SIZE, cellY + CELL_SIZE);
    ctx.lineTo(cellX, cellY + CELL_SIZE);
    ctx.fill();
  }
  
  // Draw ghost piece with lower opacity
  if (isGhost) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(cellX + 3, cellY + 3, CELL_SIZE - 6, CELL_SIZE - 6);
  }
}

// Helper to draw the grid
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // Draw horizontal grid lines
  for (let y = 0; y <= height; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL_SIZE);
    ctx.lineTo(width * CELL_SIZE, y * CELL_SIZE);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  }
  
  // Draw vertical grid lines
  for (let x = 0; x <= width; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL_SIZE, 0);
    ctx.lineTo(x * CELL_SIZE, height * CELL_SIZE);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();
  }
}
