import React from 'react';
import { Team } from '../types';
import { Shield } from 'lucide-react';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam }) => {
  return (
    <div className="w-full h-full bg-slate-900 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Brasileirão Manager AI</h1>
          <p className="text-gray-400 text-sm md:text-base">Escolha seu time para iniciar o Rumo ao Estrelato</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-4xl pb-8">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 transition-all p-6 rounded-xl flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" fill={team.primaryColor} />
              </div>
              <span className="font-bold text-white text-center text-sm md:text-base">{team.name}</span>
              <span className="text-xs text-gray-500 mt-1">Série A</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};