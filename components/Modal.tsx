
import React, { useMemo } from 'react';
import { BetSelection } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stake: number, totalOdds: number, potentialWinnings: number) => void;
  selections: BetSelection[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, selections }) => {
  if (!isOpen) return null;
  
  // This is a bit of a hack since we don't have access to the stake state from BetSlip
  // In a real app, this would be managed by a global state manager (Redux, Zustand)
  const stake = useMemo(() => {
    const stakeInput = document.getElementById('stake') as HTMLInputElement;
    return stakeInput ? parseFloat(stakeInput.value) : 0;
  }, [selections]);

  const totalOdds = useMemo(() => {
    if (selections.length === 0) return 0;
    return selections.reduce((acc, s) => acc * s.selectedOdd.value, 1);
  }, [selections]);

  const potentialWinnings = useMemo(() => {
    if (isNaN(stake) || stake <= 0) return 0;
    return stake * totalOdds;
  }, [stake, totalOdds]);

  const handleConfirm = () => {
    onConfirm(stake, totalOdds, potentialWinnings);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-2xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Bet</h2>
        <div className="space-y-2 text-gray-300 mb-6">
          <div className="flex justify-between"><span>Selections:</span> <span className="font-semibold text-white">{selections.length}</span></div>
          <div className="flex justify-between"><span>Total Odds:</span> <span className="font-semibold text-white">{totalOdds.toFixed(2)}x</span></div>
          <hr className="border-slate-700 my-2" />
          <div className="flex justify-between text-lg"><span>Stake:</span> <span className="font-bold text-cyan-400">{stake.toFixed(4)} ETH</span></div>
          <div className="flex justify-between text-lg"><span>Potential Winnings:</span> <span className="font-bold text-cyan-400">{potentialWinnings.toFixed(4)} ETH</span></div>
        </div>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="px-6 py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
