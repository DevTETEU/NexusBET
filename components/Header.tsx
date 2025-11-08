
import React from 'react';
import { CryptoIcon } from './icons/CryptoIcon';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
    balance: number;
}

const Header: React.FC<HeaderProps> = ({ balance }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CryptoIcon className="h-8 w-8 text-cyan-400" />
            <span className="ml-3 text-2xl font-bold text-white tracking-wider">Nexus Bet</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2">
              <span className="text-sm text-gray-400 mr-2">Balance:</span>
              <span className="font-semibold text-cyan-400">{balance.toFixed(4)} ETH</span>
            </div>
            <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
