import React, { useState } from 'react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';
import { Search, Filter } from 'lucide-react';
import { generateScoutReport } from '../services/geminiService';

interface MarketPlaceProps {
  players: Player[];
  budget: number;
  onBuy: (player: Player) => void;
}

export const MarketPlace: React.FC<MarketPlaceProps> = ({ players, budget, onBuy }) => {
  const [filter, setFilter] = useState('');
  const [scoutReport, setScoutReport] = useState<{id: string, text: string} | null>(null);
  const [loadingScout, setLoadingScout] = useState(false);

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.position.toLowerCase().includes(filter.toLowerCase())
  );

  const handleScout = async (player: Player) => {
      setLoadingScout(true);
      setScoutReport(null);
      const report = await generateScoutReport(`${player.name}, posição ${player.position}, rating ${player.rating}, idade ${player.age}`);
      setScoutReport({ id: player.id, text: report });
      setLoadingScout(false);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Mercado da Bola</h2>
            <p className="text-gray-400">Reforce seu elenco para a temporada</p>
          </div>
          <div className="bg-green-900/30 border border-green-500/30 px-4 py-2 rounded-lg">
              <span className="text-sm text-green-400 uppercase font-bold mr-2">Orçamento:</span>
              <span className="text-xl text-white font-mono">R$ {budget.toLocaleString('pt-BR')}</span>
          </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar jogador..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
        </div>
        <button className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:bg-slate-700">
            <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlayers.map(player => (
            <div key={player.id} className="relative">
                <PlayerCard 
                    player={player} 
                    actionLabel={player.value <= budget ? "Contratar" : "Saldo Insuficiente"}
                    onAction={() => {
                        if (player.value <= budget) onBuy(player);
                    }}
                    secondaryActionLabel="Relatório do Olheiro"
                    onSecondaryAction={() => handleScout(player)}
                />
                {/* Scout Report Modal/Overlay for this player */}
                {scoutReport?.id === player.id && (
                    <div className="absolute inset-0 bg-slate-900/95 p-4 rounded-xl flex flex-col justify-center items-center text-center z-10 animate-fade-in border border-blue-500">
                        <h4 className="text-blue-400 font-bold mb-2">Relatório AI</h4>
                        <p className="text-sm text-gray-200">{scoutReport.text}</p>
                        <button 
                            onClick={() => setScoutReport(null)}
                            className="mt-4 text-xs text-gray-500 underline hover:text-white"
                        >
                            Fechar
                        </button>
                    </div>
                )}
                {loadingScout && scoutReport?.id === undefined && (
                     // Very basic loading state logic, ideally we'd track which player is loading
                     <></> 
                )}
            </div>
        ))}
      </div>
      
      {filteredPlayers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              Nenhum jogador encontrado.
          </div>
      )}
    </div>
  );
};