import React from 'react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { Shield } from 'lucide-react';

interface TeamManagementProps {
  players: Player[];
  onSell: (player: Player) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ players, onSell }) => {
  // Sort players by position automatically for display
  const goalkeepers = players.filter(p => p.position === 'GK');
  const defenders = players.filter(p => p.position === 'DEF');
  const midfielders = players.filter(p => p.position === 'MID');
  const attackers = players.filter(p => p.position === 'ATT');

  const getAverageRating = () => {
      if (players.length === 0) return 0;
      const sum = players.reduce((acc, p) => acc + p.rating, 0);
      return Math.round(sum / players.length);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="p-4 bg-slate-900 rounded-full border-2 border-green-500">
             <Shield className="w-10 h-10 text-green-500" />
          </div>
          <div>
              <h2 className="text-3xl font-bold text-white">Gestão do Elenco</h2>
              <p className="text-gray-400">Defina a estratégia do time titular</p>
          </div>
          <div className="ml-auto text-right">
              <p className="text-sm text-gray-500 uppercase">Força Geral</p>
              <p className="text-4xl font-bold text-white">{getAverageRating()}</p>
          </div>
      </div>

      <div className="space-y-8">
          <section>
              <h3 className="text-xl font-bold text-red-400 mb-4 border-b border-red-400/20 pb-2">Atacantes ({attackers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {attackers.map(p => <PlayerCard key={p.id} player={p} variant="compact" actionLabel="Vender" onAction={() => onSell(p)} />)}
              </div>
          </section>

          <section>
              <h3 className="text-xl font-bold text-green-400 mb-4 border-b border-green-400/20 pb-2">Meio-Campistas ({midfielders.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {midfielders.map(p => <PlayerCard key={p.id} player={p} variant="compact" actionLabel="Vender" onAction={() => onSell(p)} />)}
              </div>
          </section>

          <section>
              <h3 className="text-xl font-bold text-blue-400 mb-4 border-b border-blue-400/20 pb-2">Defensores ({defenders.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {defenders.map(p => <PlayerCard key={p.id} player={p} variant="compact" actionLabel="Vender" onAction={() => onSell(p)} />)}
              </div>
          </section>

          <section>
              <h3 className="text-xl font-bold text-yellow-500 mb-4 border-b border-yellow-500/20 pb-2">Goleiros ({goalkeepers.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {goalkeepers.map(p => <PlayerCard key={p.id} player={p} variant="compact" actionLabel="Vender" onAction={() => onSell(p)} />)}
              </div>
          </section>
      </div>
    </div>
  );
};