import { useRef, useEffect, useCallback } from 'react';
import { useTetris } from '../../stores/useTetris';
import { GameState, TOUCH_CONTROLS } from '../constants';

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useTouchControls(containerRef: React.RefObject<HTMLDivElement>) {
  const {
    gameState,
    moveLeft,
    moveRight,
    rotateClockwise,
    drop,
    quickDrop,
    start,
    pause,
    restart
  } = useTetris();
  
  const touchStateRef = useRef<TouchState | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now()
    };
    
    // Prevent default scrolling
    e.preventDefault();
  }, []);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStateRef.current || gameState !== GameState.PLAYING) return;
    
    const touch = e.touches[0];
    const { startX, startY } = touchStateRef.current;
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    const currentTime = Date.now();
    
    // Implement a small delay between moves to prevent too rapid movement
    if (currentTime - lastMoveTimeRef.current < 100) {
      return;
    }
    
    // Handle horizontal swipes
    if (Math.abs(deltaX) > TOUCH_CONTROLS.SWIPE_THRESHOLD) {
      if (deltaX > 0) {
        moveRight();
      } else {
        moveLeft();
      }
      
      // Update start position to make control more continuous
      touchStateRef.current.startX = currentX;
      lastMoveTimeRef.current = currentTime;
    }
    
    // Handle vertical swipes (down only)
    if (deltaY > TOUCH_CONTROLS.SWIPE_THRESHOLD) {
      drop();
      
      // Update start position
      touchStateRef.current.startY = currentY;
      lastMoveTimeRef.current = currentTime;
    }
    
    e.preventDefault();
  }, [gameState, moveLeft, moveRight, drop]);
  
  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStateRef.current || gameState !== GameState.PLAYING) return;
    
    const endTime = Date.now();
    const touchDuration = endTime - touchStateRef.current.startTime;
    
    // Detect tap (for rotation)
    if (touchDuration < 300 && 
        Math.abs(e.changedTouches[0].clientX - touchStateRef.current.startX) < 10 &&
        Math.abs(e.changedTouches[0].clientY - touchStateRef.current.startY) < 10) {
      rotateClockwise();
    }
    
    touchStateRef.current = null;
    e.preventDefault();
  }, [gameState, rotateClockwise]);
  
  // Handle double tap (for hard drop)
  const lastTapTimeRef = useRef<number>(0);
  
  const handleDoubleTap = useCallback((e: TouchEvent) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapTimeRef.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (gameState === GameState.PLAYING) {
        quickDrop();
      }
      e.preventDefault();
    }
    
    lastTapTimeRef.current = currentTime;
  }, [gameState, quickDrop]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchend', handleDoubleTap, { passive: false });
    
    // Clean up
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchend', handleDoubleTap);
    };
  }, [
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDoubleTap
  ]);
}
