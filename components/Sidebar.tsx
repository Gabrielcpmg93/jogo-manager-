import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, PlayCircle, Trophy } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'squad', label: 'Meu Elenco', icon: Users },
    { id: 'match', label: 'Jogar Partida', icon: PlayCircle },
    { id: 'market', label: 'Transferências', icon: ShoppingBag },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
        <Trophy className="w-8 h-8 text-green-500" />
        <span className="ml-3 font-bold text-lg hidden lg:block text-white">Brasileirão AI</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 hidden lg:block">
          <p className="text-xs text-gray-500 text-center">v1.0.0 • Powered by Gemini</p>
      </div>
    </aside>
  );
};