import React from 'react';
import { Team } from '../types';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

export const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam }) => {
  // Fallback visual se a lista estiver vazia
  if (!teams || teams.length === 0) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Carregando Times...</h2>
        <p className="text-slate-400 text-sm mt-2">Se demorar muito, recarregue a página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col">
      {/* Cabeçalho da Seleção */}
      <header className="py-10 px-4 text-center bg-slate-900/50 border-b border-slate-800">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3">
          Brasileirão <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">Manager AI</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          Selecione o clube que você comandará rumo à glória eterna.
        </p>
      </header>

      {/* Grid de Times */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto pb-20">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="group relative flex flex-col items-center bg-slate-900 border-2 border-slate-800 hover:border-green-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-2"
            >
              {/* Ícone do Escudo (SVG Nativo para garantir que sempre apareça) */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-800 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-14 h-14 relative z-10 drop-shadow-lg transition-transform group-hover:scale-110"
                  fill={team.primaryColor} 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                   {/* Formato de Escudo Genérico */}
                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                   {/* Detalhe interno para dar volume */}
                   <path d="M12 22V5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                </svg>
              </div>

              {/* Nome e Detalhes */}
              <h3 className="text-lg font-black uppercase tracking-wide text-center mb-1 group-hover:text-green-400 transition-colors">
                {team.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mb-6">Série A</p>

              {/* Botão Fake de Ação */}
              <div className="w-full mt-auto bg-slate-800 group-hover:bg-green-600 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors text-center">
                Assinar Contrato
              </div>
            </button>
          ))}
        </div>
      </main>
      
      <footer className="py-4 text-center text-slate-600 text-xs border-t border-slate-900">
        &copy; {new Date().getFullYear()} Brasileirão Manager AI
      </footer>
    </div>
  );
};