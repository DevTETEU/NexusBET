
import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';

interface SidebarProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    activeView: 'markets' | 'history';
    onSelectView: (view: 'markets' | 'history') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategory, onSelectCategory, activeView, onSelectView }) => {
    return (
        <aside className="w-full md:w-56 flex-shrink-0 bg-slate-800/50 rounded-lg p-4 self-start">
            <h2 className="text-xl font-semibold mb-4 text-white">Menu</h2>
            <nav className="flex flex-col gap-2">
                 <button
                    onClick={() => onSelectView('markets')}
                    className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-md transition-all duration-200 ease-in-out font-medium
                        ${activeView === 'markets' 
                            ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' 
                            : 'bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white'
                        }`}
                >
                    <span>Markets</span>
                </button>
                 <button
                    onClick={() => onSelectView('history')}
                    className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-md transition-all duration-200 ease-in-out font-medium
                        ${activeView === 'history' 
                            ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20' 
                            : 'bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white'
                        }`}
                >
                    <HistoryIcon className="w-5 h-5" />
                    <span>History</span>
                </button>
            </nav>

            <div className="border-t border-slate-700 my-4"></div>

            {activeView === 'markets' && (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-white">Categories</h2>
                    <nav className="flex flex-col gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => onSelectCategory(category)}
                                className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ease-in-out text-sm font-medium
                                    ${activeCategory === category 
                                        ? 'bg-cyan-500/80 text-slate-900' 
                                        : 'bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </nav>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
