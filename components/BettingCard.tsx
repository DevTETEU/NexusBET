
import React from 'react';
import { Game, Odd } from '../types';

interface BettingCardProps {
  game: Game;
  onSelectBet: (game: Game, odd: Odd) => void;
  selectedOutcome?: string;
}

const BettingCard: React.FC<BettingCardProps> = ({ game, onSelectBet, selectedOutcome }) => {
  return (
    <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-4 shadow-lg hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{game.sport}</span>
            <span className="text-xs text-gray-400">{game.league}</span>
        </div>
        <div className="text-center my-4">
            <p className="text-lg font-bold text-white">{game.teamA}</p>
            <p className="text-sm text-gray-400 my-1">vs</p>
            <p className="text-lg font-bold text-white">{game.teamB}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {game.odds.map(odd => (
          <button 
            key={odd.outcome}
            onClick={() => onSelectBet(game, odd)}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500
              ${selectedOutcome === odd.outcome 
                ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/30' 
                : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
              }`}
          >
            <span className="block truncate text-xs text-gray-400" title={odd.outcome}>{odd.outcome}</span>
            <span className="block text-base font-bold text-white">{odd.value.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BettingCard;
