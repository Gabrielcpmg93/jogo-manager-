import React from 'react';
import { Team } from '../types';

interface TeamSelectionProps {
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
}

// Inline SVG components to ensure they always render without external dependencies
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
  return (
    <div className="w-full h-full bg-gradient-to-br from-green-950 via-slate-900 to-black overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12 mt-8 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-900/30 border border-green-500/30 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <ShieldIcon className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl uppercase">
            Brasileirão <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">Manager</span>
          </h1>
          <p className="text-green-100/60 text-lg md:text-xl max-w-lg mx-auto font-medium leading-relaxed">
            Assuma o comando. Escolha seu time. Conquiste o Brasil.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl pb-12 px-4">
          {teams.map((team, index) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="group relative bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/60 border border-white/5 hover:border-green-500/50 transition-all duration-500 p-6 rounded-3xl flex flex-col items-center hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)]"
              style={{ animationDelay: `${index * 50}ms` }} // Staggered animation
            >
              {/* Selection Indicator */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,1)] scale-0 group-hover:scale-100"></div>
              
              {/* Team Shield Placeholder */}
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-slate-700/50 group-hover:border-green-500/30 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <ShieldIcon 
                    className="w-14 h-14 text-gray-400 group-hover:text-white transition-colors duration-300 drop-shadow-lg" 
                    fill={team.primaryColor} 
                    stroke="currentColor"
                 />
              </div>
              
              <span className="font-black text-white text-center text-lg group-hover:text-green-400 transition-colors duration-300 uppercase tracking-wide leading-tight">
                {team.name}
              </span>
              
              {/* Bottom Bar */}
              <div className="h-1 w-12 bg-slate-800 mt-6 rounded-full group-hover:w-20 group-hover:bg-green-500 transition-all duration-500"></div>
            </button>
          ))}
        </div>
        
        <div className="text-white/20 text-xs mt-auto mb-6 uppercase tracking-[0.2em] font-bold">
            Powered by Gemini AI
        </div>
      </div>
    </div>
  );
};