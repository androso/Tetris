import { useRef, useEffect, useCallback } from 'react';
import { useTetris } from '../../stores/useTetris';
import { GameState, TOUCH_CONTROLS } from '../constants';

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isLongPress: boolean;
  hasMovedSignificantly: boolean;
}

export function useTouchControls(containerRef: React.RefObject<HTMLDivElement>) {
  const {
    gameState,
    moveLeft,
    moveRight,
    rotateClockwise,
    drop,
    quickDrop,
  } = useTetris();
  
  const touchStateRef = useRef<TouchState | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<number | null>(null);
  
  // Function to handle long press completion
  const handleLongPress = useCallback(() => {
    if (gameState === GameState.PLAYING && touchStateRef.current) {
      // Only perform hard drop if the touch hasn't moved significantly
      if (!touchStateRef.current.hasMovedSignificantly) {
        touchStateRef.current.isLongPress = true;
        quickDrop();
      }
      
      // Clear the timer reference
      longPressTimerRef.current = null;
    }
  }, [gameState, quickDrop]);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only handle game controls if the game is in playing state
    if (gameState !== GameState.PLAYING) return;
    
    const touch = e.touches[0];
    
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isLongPress: false,
      hasMovedSignificantly: false
    };
    
    // Start the long press timer
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = window.setTimeout(
      handleLongPress,
      TOUCH_CONTROLS.LONG_PRESS_DURATION
    );
    
    // Prevent default scrolling
    e.preventDefault();
  }, [gameState, handleLongPress]);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStateRef.current || gameState !== GameState.PLAYING) return;
    
    const touch = e.touches[0];
    const { startX, startY } = touchStateRef.current;
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    // Check if touch has moved significantly
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
      touchStateRef.current.hasMovedSignificantly = true;
      
      // Cancel long press timer if touch moves significantly
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
    
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
    
    // Clear any pending long press timer
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const endTime = Date.now();
    const touchDuration = endTime - touchStateRef.current.startTime;
    
    // Detect tap for rotation (only if not a long press and hasn't moved significantly)
    if (!touchStateRef.current.isLongPress && 
        !touchStateRef.current.hasMovedSignificantly &&
        touchDuration < 300 && 
        Math.abs(e.changedTouches[0].clientX - touchStateRef.current.startX) < 10 &&
        Math.abs(e.changedTouches[0].clientY - touchStateRef.current.startY) < 10) {
      rotateClockwise();
    }
    
    touchStateRef.current = null;
    e.preventDefault();
  }, [gameState, rotateClockwise]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Clean up
    return () => {
      // Clear any pending long press timer
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
