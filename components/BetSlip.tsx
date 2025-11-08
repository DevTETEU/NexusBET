
import React, { useState, useMemo, useEffect } from 'react';
import { BetSelection } from '../types';

interface BetSlipProps {
  selections: BetSelection[];
  onRemoveBet: (gameId: string) => void;
  onClearSlip: () => void;
  onPlaceBetConfirm: () => void;
  balance: number;
}

const BetSlip: React.FC<BetSlipProps> = ({ selections, onRemoveBet, onClearSlip, onPlaceBetConfirm, balance }) => {
  const [stake, setStake] = useState<string>('0.01');

  useEffect(() => {
    // Reset stake when selections change
    if (selections.length > 0) {
      setStake('0.01');
    }
  }, [selections.length]);

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;
    return selections.reduce((acc, s) => acc * s.selectedOdd.value, 1);
  }, [selections]);

  const potentialWinnings = useMemo(() => {
    const stakeValue = parseFloat(stake);
    if (isNaN(stakeValue) || stakeValue <= 0) return 0;
    return stakeValue * totalOdds;
  }, [stake, totalOdds]);
  
  const isStakeInvalid = isNaN(parseFloat(stake)) || parseFloat(stake) <= 0;
  const hasInsufficientBalance = parseFloat(stake) > balance;

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 shadow-lg sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Bet Slip</h2>
        {selections.length > 0 && (
           <button onClick={onClearSlip} className="text-xs text-cyan-400 hover:text-cyan-300">Clear All</button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {selections.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">Click on odds to add bets to your slip.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selections.map(selection => (
              <div key={selection.id} className="bg-slate-700/50 p-3 rounded-md animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400">{selection.teamA} vs {selection.teamB}</p>
                    <p className="font-semibold text-white">{selection.selectedOdd.outcome}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">{selection.selectedOdd.value.toFixed(2)}</p>
                    <button onClick={() => onRemoveBet(selection.id)} className="text-xs text-red-400 hover:text-red-300 mt-1">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selections.length > 0 && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <div>
            <label htmlFor="stake" className="block text-sm font-medium text-gray-300 mb-1">Stake (ETH)</label>
            <input
              id="stake"
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="0.001"
              step="0.001"
              className={`w-full bg-slate-700 border rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${hasInsufficientBalance ? 'border-red-500' : 'border-slate-600'}`}
            />
            {hasInsufficientBalance && <p className="text-red-400 text-xs mt-1">Insufficient balance.</p>}
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Selections</span>
              <span className="font-medium text-white">{selections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Odds</span>
              <span className="font-medium text-white">{totalOdds.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-gray-300 font-semibold">Potential Winnings</span>
              <span className="font-bold text-cyan-400">{potentialWinnings.toFixed(4)} ETH</span>
            </div>
          </div>
          <button 
            onClick={onPlaceBetConfirm}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selections.length === 0 || isStakeInvalid || hasInsufficientBalance}
          >
            Place Bet
          </button>
        </div>
      )}
    </div>
  );
};

export default BetSlip;
