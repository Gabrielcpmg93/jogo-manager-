import React from 'react';
import { Team } from '../types';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam }) => {
  // Proteção contra array nulo ou vazio
  const hasTeams = Array.isArray(teams) && teams.length > 0;

  if (!hasTeams) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white p-4 z-50 relative">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Carregando Times...</h2>
        <p className="text-slate-400 text-sm mt-2">Organizando o campeonato...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col relative z-40">
      {/* Background Pattern Sutil */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Cabeçalho */}
      <header className="relative z-10 py-8 px-4 text-center border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-lg">
          Brasileirão <span className="text-green-400">Manager</span>
        </h1>
        <p className="text-slate-300 font-medium max-w-md mx-auto text-sm md:text-base">
          A temporada vai começar. Escolha seu clube e leve-o à glória.
        </p>
      </header>

      {/* Grid de Times */}
      <main className="relative z-10 flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 max-w-7xl mx-auto pb-20">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="group relative flex flex-col items-center bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-green-500 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1"
            >
              {/* Ícone SVG Inline para garantir renderização */}
              <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                 <div className="absolute inset-0 bg-white/5 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                 <svg 
                    viewBox="0 0 24 24" 
                    className="w-12 h-12 text-white drop-shadow-md transition-transform group-hover:scale-110"
                    fill={team.primaryColor || '#333'} 
                    stroke="white" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 5v17" stroke="rgba(255,255,255,0.2)" />
                    <path d="M4 9h16" stroke="rgba(255,255,255,0.2)" />
                  </svg>
              </div>

              <h3 className="text-lg font-bold uppercase text-center text-white mb-1 group-hover:text-green-400 transition-colors w-full truncate">
                {team.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono border border-slate-700">SÉRIE A</span>
              </div>

              <div className="w-full mt-auto bg-slate-800 group-hover:bg-green-600 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-all text-center border border-slate-700 group-hover:border-green-500">
                Selecionar
              </div>
            </button>
          ))}
        </div>
      </main>
      
      <footer className="relative z-10 py-4 text-center text-slate-500 text-xs border-t border-slate-900 bg-slate-950">
        Brasileirão Manager AI &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};