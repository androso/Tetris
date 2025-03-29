import React from 'react';
import { useTetris } from '@/lib/stores/useTetris';
import { useIsMobile } from '@/hooks/use-is-mobile';

const Score: React.FC = () => {
  const { score, level, lines } = useTetris();
  const isMobile = useIsMobile();
  
  if (isMobile) {
    // Compact mobile view
    return (
      <div className="score-display bg-gray-900 p-2 rounded-lg text-white">
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="score">
            <h3 className="text-xs mb-0">SCR</h3>
            <div className="text-right text-sm font-bold">{score.toString().padStart(6, '0')}</div>
          </div>
          
          <div className="level">
            <h3 className="text-xs mb-0">LVL</h3>
            <div className="text-center text-sm font-bold">{level}</div>
          </div>
          
          <div className="lines">
            <h3 className="text-xs mb-0">LNS</h3>
            <div className="text-center text-sm font-bold">{lines}</div>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop view (unchanged)
  return (
    <div className="score-display bg-gray-900 p-3 rounded-lg text-white">
      <div className="score mb-3">
        <h3 className="text-sm mb-1">SCORE</h3>
        <div className="text-right text-xl font-bold">{score.toString().padStart(6, '0')}</div>
      </div>
      
      <div className="level mb-3">
        <h3 className="text-sm mb-1">LEVEL</h3>
        <div className="text-right text-xl font-bold">{level}</div>
      </div>
      
      <div className="lines">
        <h3 className="text-sm mb-1">LINES</h3>
        <div className="text-right text-xl font-bold">{lines}</div>
      </div>
    </div>
  );
};

export default Score;
