import React from 'react';
import { Team } from '../types';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

// Ícone SVG Inline Seguro
const ShieldIcon = ({ className, fill, stroke = "currentColor" }: { className?: string, fill?: string, stroke?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={fill || "none"} 
    stroke={stroke} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam }) => {
  // Fallback de segurança caso não haja times
  if (!teams || teams.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <ShieldIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-xl font-bold">Nenhum time encontrado</h2>
        <p className="text-gray-400">Reinicie a aplicação para recarregar os dados.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col">
      {/* Header Fixo */}
      <div className="py-8 px-4 text-center bg-slate-900 border-b border-slate-800 shadow-lg z-10">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2">
          Brasileirão <span className="text-green-500">Manager</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Escolha sua equipe para iniciar a jornada rumo ao título.
        </p>
      </div>

      {/* Área de Rolagem dos Times */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="group relative flex flex-col items-center p-6 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-green-500 transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
            >
              {/* Círculo do Escudo */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-green-500 flex items-center justify-center mb-4 shadow-inner transition-colors">
                 <ShieldIcon 
                    className="w-10 h-10 md:w-12 md:h-12 text-slate-400 group-hover:text-green-400 transition-colors" 
                    fill={team.primaryColor} 
                 />
              </div>
              
              {/* Nome do Time */}
              <span className="font-bold text-white text-sm md:text-base text-center uppercase tracking-wide group-hover:text-green-300">
                {team.name}
              </span>

              {/* Indicador de Seleção */}
              <div className="mt-4 px-4 py-1 rounded-full bg-slate-900 text-slate-500 text-xs font-bold border border-slate-700 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500 transition-all">
                SELECIONAR
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-slate-600 text-xs uppercase tracking-widest bg-slate-950">
        Powered by Gemini AI
      </div>
    </div>
  );
};