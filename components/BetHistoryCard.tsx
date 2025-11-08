
import React from 'react';
import { BetRecord } from '../types';

interface BetHistoryCardProps {
  bet: BetRecord;
}

const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet }) => {
  const statusClasses: { [key: string]: string } = {
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Won: 'bg-green-500/20 text-green-400 border-green-500/30',
    Lost: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-4 shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-gray-400">
            {bet.selections.length} Selection{bet.selections.length > 1 ? 's' : ''} - Placed {new Date(bet.placedAt).toLocaleString()}
          </p>
          <p className="font-bold text-white text-lg">{bet.totalOdds.toFixed(2)}x Odds</p>
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusClasses[bet.status]}`}>
          {bet.status}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {bet.selections.map(selection => (
          <div key={selection.id} className="text-sm p-2 bg-slate-900/50 rounded">
             <p className="text-gray-400">{selection.teamA} vs {selection.teamB}</p>
             <div className="flex justify-between items-center">
                <p className="font-semibold text-white">{selection.selectedOdd.outcome}</p>
                <p className="font-bold text-cyan-400">{selection.selectedOdd.value.toFixed(2)}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-700 pt-3 text-sm">
         <div className="flex justify-between mb-1">
            <span className="text-gray-400">Stake</span>
            <span className="font-semibold text-white">{bet.stake.toFixed(4)} ETH</span>
         </div>
         <div className="flex justify-between">
            <span className="text-gray-400">Potential Winnings</span>
            <span className="font-semibold text-white">{bet.potentialWinnings.toFixed(4)} ETH</span>
         </div>
      </div>
    </div>
  );
};

export default BetHistoryCard;
