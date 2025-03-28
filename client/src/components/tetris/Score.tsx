import React from 'react';
import { useTetris } from '@/lib/stores/useTetris';

const Score: React.FC = () => {
  const { score, level, lines } = useTetris();
  
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
