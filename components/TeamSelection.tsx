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
          <div className="inline-block p-3 rounded-full bg-green-900/50 border border-green-500/30 mb-4 shadow-xl">
            <Shield className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl uppercase">
            Brasileirão <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">Manager AI</span>
          </h1>
          <p className="text-green-100/80 text-base md:text-lg max-w-md mx-auto font-medium">
            A temporada começou! Escolha seu clube e conquiste a glória nacional.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 w-full max-w-6xl pb-10 px-4">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="relative bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-green-400/50 transition-all duration-300 p-6 rounded-2xl flex flex-col items-center group shadow-lg hover:shadow-green-500/30 hover:-translate-y-2"
            >
              {/* Selection Indicator */}
              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              
              {/* Team Shield Placeholder */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300 border-2 border-slate-700 group-hover:border-green-500 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Shield className="w-12 h-12 text-gray-300 group-hover:text-white transition-colors drop-shadow-md" fill={team.primaryColor} />
              </div>
              
              <span className="font-black text-white text-center text-lg group-hover:text-green-300 transition-colors uppercase tracking-wide">
                {team.name}
              </span>
              
              {/* Bottom Bar */}
              <div className="h-1 w-16 bg-slate-700 mt-4 rounded-full group-hover:w-24 group-hover:bg-green-500 transition-all duration-300"></div>
            </button>
          ))}
        </div>
        
        <div className="text-green-500/40 text-xs mt-auto mb-4 uppercase tracking-widest font-bold">
            Powered by Gemini AI
        </div>
      </div>
    </div>
  );
};