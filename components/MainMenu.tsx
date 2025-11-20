import React from 'react';
import { AppView } from '../types';
import { 
  Clock, Calendar, DollarSign, Shield, Shirt, Users, Baby, 
  Hammer, MessageCircle, ArrowLeftRight, Trophy, Video, Play, SkipForward 
} from 'lucide-react';

interface MainMenuProps {
  onNavigate: (view: AppView) => void;
  onSkipWeek: () => void;
  currentWeek: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onNavigate, onSkipWeek, currentWeek }) => {
  const MenuButton = ({ 
    label, 
    icon: Icon, 
    colorClass, 
    onClick,
    fullWidth = true
  }: { 
    label: string, 
    icon: any, 
    colorClass: string, 
    onClick: () => void,
    fullWidth?: boolean
  }) => (
    <button 
      onClick={onClick}
      className={`${fullWidth ? 'w-full' : 'flex-1'} ${colorClass} text-white font-bold py-4 px-6 rounded-lg shadow-md transform transition-transform active:scale-95 flex items-center justify-center gap-3 mb-3 shrink-0`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-lg tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center overflow-y-auto">
      {/* Header */}
      <div className="w-full bg-white py-6 shadow-sm mb-4 flex justify-center items-center shrink-0 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-blue-700">Menu Principal</h1>
      </div>

      {/* Menu List */}
      <div className="w-full max-w-md px-4 pb-20 flex flex-col gap-1">
        
        <MenuButton label="Tempo" icon={Clock} colorClass="bg-blue-600" onClick={() => onNavigate('menu')} />
        
        <MenuButton label="Campeonato" icon={Calendar} colorClass="bg-purple-600" onClick={() => onNavigate('league')} />
        
        <MenuButton label="Finanças" icon={DollarSign} colorClass="bg-emerald-700" onClick={() => onNavigate('finances')} />
        
        <MenuButton label="Táticas" icon={Shield} colorClass="bg-emerald-600" onClick={() => onNavigate('tactics')} />
        
        <MenuButton label="Personalizar Uniforme" icon={Shirt} colorClass="bg-purple-500" onClick={() => onNavigate('uniform')} />
        
        <MenuButton label="Elenco" icon={Users} colorClass="bg-green-600" onClick={() => onNavigate('squad')} />
        
        <MenuButton label="Base" icon={Baby} colorClass="bg-cyan-600" onClick={() => onNavigate('youth')} />
        
        <MenuButton label="Personalização do Estádio" icon={Hammer} colorClass="bg-yellow-600" onClick={() => onNavigate('stadium')} />
        
        <MenuButton label="Redes Sociais" icon={MessageCircle} colorClass="bg-pink-600" onClick={() => onNavigate('social')} />
        
        <MenuButton label="Transferências" icon={ArrowLeftRight} colorClass="bg-orange-600" onClick={() => onNavigate('market')} />
        
        <MenuButton label="Troféus" icon={Trophy} colorClass="bg-yellow-700" onClick={() => onNavigate('trophies')} />
        
        <MenuButton label="VAR" icon={Video} colorClass="bg-indigo-600" onClick={() => onNavigate('var')} />
        
        <MenuButton label="Partida Simular" icon={Play} colorClass="bg-red-600" onClick={() => onNavigate('match')} />
        
        <MenuButton label={`Semana Pular (${currentWeek}ª)`} icon={SkipForward} colorClass="bg-purple-600" onClick={onSkipWeek} />

      </div>
    </div>
  );
};