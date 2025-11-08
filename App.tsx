
import React, { useState, useEffect, useCallback } from 'react';
import { Game, Odd, BetSelection, BetRecord } from './types';
import { fetchBettingData } from './services/geminiService';
import { NotificationProvider, useNotifier } from './context/NotificationContext';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BettingCard from './components/BettingCard';
import BetSlip from './components/BetSlip';
import Spinner from './components/Spinner';
import ToastContainer from './components/Toast';
import Modal from './components/Modal';
import BetHistoryCard from './components/BetHistoryCard';

const AppContent: React.FC = () => {
  const [games, setGames] = useLocalStorage<Game[]>('nexus-games', []);
  const [betSelections, setBetSelections] = useLocalStorage<BetSelection[]>('nexus-bet-slip', []);
  const [betHistory, setBetHistory] = useLocalStorage<BetRecord[]>('nexus-bet-history', []);
  const [balance, setBalance] = useLocalStorage<number>('nexus-balance', 1.0);
  
  const [isLoading, setIsLoading] = useState<boolean>(!games.length);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'markets' | 'history'>('markets');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { addNotification } = useNotifier();

  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBettingData();
      setGames(data);
    } catch (err) {
      setError('Failed to load betting markets. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [setGames]);

  useEffect(() => {
    if (games.length === 0) {
      loadGames();
    }
  }, [games.length, loadGames]);

  // Simulate live odds changing
  useEffect(() => {
    const interval = setInterval(() => {
      setGames(prevGames =>
        prevGames.map(game => ({
          ...game,
          odds: game.odds.map(odd => ({
            ...odd,
            value: Math.max(1.05, odd.value + (Math.random() - 0.5) * 0.1),
          })),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [setGames]);

  const handleSelectBet = (game: Game, odd: Odd) => {
    setBetSelections(prev => {
      const existingIndex = prev.findIndex(selection => selection.id === game.id);
      const newSelection: BetSelection = { ...game, selectedOdd: odd };

      if (existingIndex > -1) {
        if (prev[existingIndex].selectedOdd.outcome === odd.outcome) {
          return prev.filter(selection => selection.id !== game.id);
        }
        const updatedSelections = [...prev];
        updatedSelections[existingIndex] = newSelection;
        return updatedSelections;
      } else {
        return [...prev, newSelection];
      }
    });
  };

  const handleRemoveBet = (gameId: string) => {
    setBetSelections(prev => prev.filter(selection => selection.id !== gameId));
  };
  
  const handleClearSlip = () => setBetSelections([]);

  const handlePlaceBet = (stake: number, totalOdds: number, potentialWinnings: number) => {
    if (stake > balance) {
      addNotification('Insufficient balance to place this bet.', 'error');
      return;
    }
    
    const newBet: BetRecord = {
      id: `bet-${Date.now()}`,
      selections: betSelections,
      stake,
      totalOdds,
      potentialWinnings,
      placedAt: Date.now(),
      status: 'Pending',
    };
    
    setBalance(prev => prev - stake);
    setBetHistory(prev => [newBet, ...prev]);
    setBetSelections([]);
    addNotification('Bet placed successfully!', 'success');

    // Simulate bet resolution
    setTimeout(() => {
      const isWin = Math.random() > 0.5;
      setBetHistory(prevHistory =>
        prevHistory.map(bet => {
          if (bet.id === newBet.id) {
            const newStatus = isWin ? 'Won' : 'Lost';
            if (isWin) {
              setBalance(prevBalance => prevBalance + bet.potentialWinnings);
              addNotification(`Bet Won! +${bet.potentialWinnings.toFixed(4)} ETH credited.`, 'success');
            } else {
              addNotification('Bet lost. Better luck next time.', 'info');
            }
            return { ...bet, status: newStatus };
          }
          return bet;
        })
      );
    }, 15000); // Resolve after 15 seconds
  };

  const filteredGames = activeCategory === 'All' 
    ? games 
    : games.filter(game => game.sport === activeCategory);

  const categories = ['All', ...Array.from(new Set(games.map(g => g.sport)))];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <ToastContainer />
      <Header balance={balance} />
      <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto p-4 gap-6">
        <Sidebar 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory}
          activeView={activeView}
          onSelectView={setActiveView}
        />
        
        <main className="flex-grow">
          {activeView === 'markets' && (
            <>
              <h1 className="text-3xl font-bold mb-4 text-cyan-400">Live Markets</h1>
              {isLoading ? (
                <div className="flex justify-center items-center h-96"><Spinner /></div>
              ) : error ? (
                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                  <p>{error}</p>
                  <button onClick={loadGames} className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-md text-slate-900 font-semibold transition">
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {filteredGames.map(game => (
                    <BettingCard 
                      key={game.id} 
                      game={game} 
                      onSelectBet={handleSelectBet} 
                      selectedOutcome={betSelections.find(s => s.id === game.id)?.selectedOdd.outcome}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeView === 'history' && (
            <>
              <h1 className="text-3xl font-bold mb-4 text-cyan-400">Bet History</h1>
              {betHistory.length === 0 ? (
                <p className="text-gray-400 text-center mt-8">You have no past bets.</p>
              ) : (
                <div className="space-y-4">
                  {betHistory.map(bet => <BetHistoryCard key={bet.id} bet={bet} />)}
                </div>
              )}
            </>
          )}
        </main>

        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <BetSlip 
            selections={betSelections} 
            onRemoveBet={handleRemoveBet} 
            onClearSlip={handleClearSlip}
            onPlaceBetConfirm={() => setIsModalOpen(true)}
            balance={balance}
          />
        </aside>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePlaceBet}
        selections={betSelections}
       />
    </div>
  );
};

const App: React.FC = () => (
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
);


export default App;
