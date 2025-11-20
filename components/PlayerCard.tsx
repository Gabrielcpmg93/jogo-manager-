import React from 'react';
import { Player } from '../types';
import { User, DollarSign, BarChart } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'compact' | 'full';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  actionLabel, 
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'full' 
}) => {
  const getPosColor = (pos: string) => {
    switch(pos) {
      case 'GK': return 'bg-yellow-600';
      case 'DEF': return 'bg-blue-600';
      case 'MID': return 'bg-green-600';
      case 'ATT': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  if (variant === 'compact') {
      return (
        <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getPosColor(player.position)}`}>
                    {player.position}
                </div>
                <div>
                    <p className="font-semibold text-white text-sm">{player.name}</p>
                    <p className="text-xs text-gray-400">OVR: {player.rating}</p>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1 group relative">
      <div className={`h-2 w-full ${getPosColor(player.position)}`} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
             <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-1 ${getPosColor(player.position)} bg-opacity-20 text-white border border-white/20`}>
               {player.position}
             </span>
             <h3 className="font-bold text-lg text-white truncate w-40" title={player.name}>{player.name}</h3>
          </div>
          <div className="bg-slate-900 rounded-lg p-2 text-center min-w-[50px]">
            <span className="block text-xs text-gray-500">OVR</span>
            <span className={`text-lg font-bold ${player.rating >= 85 ? 'text-yellow-400' : player.rating >= 75 ? 'text-green-400' : 'text-gray-300'}`}>
              {player.rating}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
           <div className="flex items-center text-sm text-gray-400">
             <BarChart className="w-4 h-4 mr-2 text-blue-400" />
             <span>Idade: {player.age} anos</span>
           </div>
           <div className="flex items-center text-sm text-gray-400">
             <DollarSign className="w-4 h-4 mr-2 text-green-400" />
             <span>R$ {player.value.toLocaleString('pt-BR')}</span>
           </div>
        </div>

        <div className="flex gap-2">
            {actionLabel && (
            <button 
                onClick={onAction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
            >
                {actionLabel}
            </button>
            )}
            {secondaryActionLabel && (
                 <button 
                 onClick={onSecondaryAction}
                 className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
             >
                 {secondaryActionLabel}
             </button>
            )}
        </div>
      </div>
    </div>
  );
};