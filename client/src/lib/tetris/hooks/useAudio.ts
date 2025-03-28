import { useEffect, useRef } from 'react';
import { useAudio as useGlobalAudio } from '../../stores/useAudio';
import { useTetris } from '../../stores/useTetris';
import { GameState } from '../constants';

export function useTetrisAudio() {
  const {
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
    playHit,
    playSuccess,
    toggleMute,
    isMuted
  } = useGlobalAudio();
  
  const { gameState, level } = useTetris();
  
  // Track previous state for state change detection
  const prevGameStateRef = useRef<GameState>(GameState.READY);
  const prevLevelRef = useRef<number>(0);
  
  // Load sounds
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    setBackgroundMusic(backgroundMusic);
    
    const hitSound = new Audio('/sounds/hit.mp3');
    hitSound.volume = 0.3;
    setHitSound(hitSound);
    
    const successSound = new Audio('/sounds/success.mp3');
    successSound.volume = 0.6;
    setSuccessSound(successSound);
    
    return () => {
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);
  
  // Handle game state changes
  useEffect(() => {
    // Play success sound on level up
    if (level > prevLevelRef.current) {
      playSuccess();
    }
    
    // Update refs
    prevGameStateRef.current = gameState;
    prevLevelRef.current = level;
  }, [gameState, level, playSuccess]);
  
  return {
    toggleMute,
    isMuted
  };
}
