import React from 'react';
import { Team } from '../types';
import { Shield } from 'lucide-react';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 via-slate-900 to-black overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6">
        <div className="text-center mb-10 mt-4">
          <div className="inline-block p-3 rounded-full bg-green-900/50 border border-green-500/30 mb-4">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl">
            Brasileirão <span className="text-green-500">Manager AI</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-md mx-auto">
            Selecione sua equipe e leve-a à glória no campeonato mais disputado do mundo.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full max-w-6xl pb-10 px-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="relative bg-slate-800/60 backdrop-blur-sm hover:bg-slate-800 border border-slate-700 hover:border-green-500 transition-all duration-300 p-6 rounded-2xl flex flex-col items-center group shadow-lg hover:shadow-green-500/20 hover:-translate-y-1"
            >
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-600 group-hover:border-green-500/50">
                <Shield className="w-10 h-10 text-white drop-shadow-md" fill={team.primaryColor} />
              </div>
              
              <span className="font-bold text-white text-center text-lg group-hover:text-green-400 transition-colors">
                {team.name}
              </span>
              <div className="h-1 w-12 bg-slate-700 mt-3 rounded-full group-hover:bg-green-600 transition-colors"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};