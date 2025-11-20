import React, { useState, useRef, useEffect } from 'react';
import { Team, Player } from '../types';
import { generateMatchCommentary } from '../services/geminiService';
import { Play, SkipForward, Activity, MonitorPlay, Timer, AlertTriangle } from 'lucide-react';

interface MatchEngineProps {
  userTeamName: string;
  userSquad: Player[];
  opponent: Team; 
  onMatchComplete: (userGoals: number, oppGoals: number, oppId: string, varLogs: string[]) => void;
}

type MatchPhase = 'pre' | '1st_half' | 'halftime' | '2nd_half' | 'finished';

export const MatchEngine: React.FC<MatchEngineProps> = ({ userTeamName, userSquad, opponent, onMatchComplete }) => {
  const [phase, setPhase] = useState<MatchPhase>('pre');
  const [score, setScore] = useState({ user: 0, opponent: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [varLogs, setVarLogs] = useState<string[]>([]);
  const [aiCommentary, setAiCommentary] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isVarChecking, setIsVarChecking] = useState(false);

  // Safety check for corrupted data
  if (!opponent || !opponent.roster) {
      return (
          <div className="p-6 text-center bg-slate-800 rounded-xl border border-red-500">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
              <h3 className="text-white font-bold">Erro nos dados da partida</h3>
              <p className="text-gray-400 mb-4">Os dados do time adversário estão corrompidos.</p>
              <button 
                  onClick={() => onMatchComplete(0, 0, opponent?.id || 'unknown', ["Partida cancelada por erro de dados"])}
                  className="bg-red-600 text-white px-4 py-2 rounded"
              >
                  Cancelar Partida (W.O.)
              </button>
          </div>
      );
  }

  const calculateTeamStrength = (players: Player[]) => {
    if (!players || players.length === 0) return 50; // Default strength if empty
    const total = players.reduce((acc, p) => acc + p.rating, 0);
    return total / players.length;
  };

  const addLog = (msg: string) => {
      setLogs(prev => [msg, ...prev]); // Newest first
  };

  const playHalf = async (startMin: number, endMin: number, isSecondHalf: boolean) => {
    setPhase(isSecondHalf ? '2nd_half' : '1st_half');
    
    const safeUserSquad = userSquad || [];
    const safeOppRoster = opponent.roster || [];

    const userStrength = calculateTeamStrength(safeUserSquad);
    const oppStrength = calculateTeamStrength(safeOppRoster);
    
    // Advantage factor
    const userLuck = Math.random() * 10;
    const oppLuck = Math.random() * 10;
    
    const userTotal = userStrength + userLuck;
    const oppTotal = oppStrength + oppLuck;

    // 5 events per half
    const eventsPerHalf = 5;
    const interval = (endMin - startMin) / eventsPerHalf;

    for (let i = 1; i <= eventsPerHalf; i++) {
        const minute = Math.floor(startMin + (i * interval) - (Math.random() * 5));
        setCurrentMinute(minute);
        await new Promise(resolve => setTimeout(resolve, 1200)); // Delay for pacing

        const eventRoll = Math.random();
        
        if (eventRoll > 0.6) { // Significant event chance
            // Goal Chance logic
            if (userTotal > oppTotal && Math.random() > 0.45) {
                await handleGoalEvent(minute, true, userTeamName, safeUserSquad);
            } else if (oppTotal > userTotal && Math.random() > 0.45) {
                await handleGoalEvent(minute, false, opponent.name, safeOppRoster);
            } else {
                addLog(`${minute}' - Chute perigoso para fora!`);
            }
        } else {
             const descriptions = [
                 `${minute}' - Troca de passes no meio de campo.`,
                 `${minute}' - A torcida canta alto no estádio!`,
                 `${minute}' - Jogo truncado, muitas faltas.`,
                 `${minute}' - O técnico pede calma ao time.`
             ];
             addLog(descriptions[Math.floor(Math.random() * descriptions.length)]);
        }
    }

    setCurrentMinute(endMin);
    
    if (isSecondHalf) {
        setPhase('finished');
        finishMatch();
    } else {
        setPhase('halftime');
        addLog(`--- FIM DO PRIMEIRO TEMPO ---`);
    }
  };

  const handleGoalEvent = async (minute: number, isUserGoal: boolean, teamName: string, roster: Player[]) => {
      let scorer = "Jogador Desconhecido";
      
      if (roster && roster.length > 0) {
          const randomPlayer = roster[Math.floor(Math.random() * roster.length)];
          if (randomPlayer && randomPlayer.name) scorer = randomPlayer.name;
      }
      
      // Initial Goal Announcement
      addLog(`${minute}' - GOOOOL DO ${teamName.toUpperCase()}! ${scorer} balança a rede!`);
      
      // VAR CHECK LOGIC (25% chance)
      if (Math.random() < 0.25) {
          setIsVarChecking(true);
          addLog(`${minute}' - ✋ Árbitro põe a mão no ouvido. VAR em análise...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Suspense
          
          // Decision (80% confirm, 20% annul)
          const decisionRoll = Math.random();
          if (decisionRoll > 0.2) {
              addLog(`${minute}' - ✅ VAR: Gol Legal! Segue o jogo.`);
              setVarLogs(prev => [...prev, `${minute}' - Gol de ${scorer} (${teamName}) Confirmado após checagem.`]);
              // Confirm Score
              if (isUserGoal) setScore(prev => ({ ...prev, user: prev.user + 1 }));
              else setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
          } else {
              addLog(`${minute}' - ❌ VAR: GOL ANULADO! Impedimento marcado.`);
              setVarLogs(prev => [...prev, `${minute}' - Gol de ${scorer} (${teamName}) ANULADO por impedimento.`]);
              // No score update
          }
          setIsVarChecking(false);
      } else {
          // No VAR, instant goal
          if (isUserGoal) setScore(prev => ({ ...prev, user: prev.user + 1 }));
          else setScore(prev => ({ ...prev, opponent: prev.opponent + 1 }));
      }
  };

  const finishMatch = async () => {
    // AI Commentary
    setIsThinking(true);
    const commentary = await generateMatchCommentary(
        userTeamName, 
        opponent.name, 
        score.user, 
        score.opponent, 
        logs.slice(0, 10) // Send last 10 logs for context
    );
    setAiCommentary(commentary);
    setIsThinking(false);

    // Wait for user to click exit, but pre-calculate
  };

  const handleExit = () => {
      onMatchComplete(score.user, score.opponent, opponent.id, varLogs);
  };

  if (phase === 'pre') {
      return (
          <div className="p-6 max-w-4xl mx-auto">
              <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
                  <h3 className="text-gray-400 font-bold uppercase mb-8 tracking-widest">Brasileirão Série A</h3>

                  <div className="flex gap-4 md:gap-10 items-center justify-center mb-10">
                        <div className="text-center flex-1">
                             <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto border-4 border-slate-600 shadow-lg">
                                 🏠
                             </div>
                             <p className="font-bold text-white text-xl">{userTeamName}</p>
                             <p className="text-sm text-gray-400 mt-1">Força: {Math.round(calculateTeamStrength(userSquad))}</p>
                        </div>
                        
                        <div className="text-4xl font-black text-gray-600 italic">VS</div>
                        
                        <div className="text-center flex-1">
                             <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4 mx-auto border-4 border-slate-600 shadow-lg">
                                 ✈️
                             </div>
                             <p className="font-bold text-white text-xl">{opponent.name}</p>
                             <p className="text-sm text-gray-400 mt-1">Força: {Math.round(calculateTeamStrength(opponent.roster))}</p>
                        </div>
                  </div>

                  <button 
                    onClick={() => playHalf(0, 45, false)}
                    className="w-full max-w-md mx-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/50 transition-all transform hover:scale-105"
                  >
                      <Play className="w-6 h-6 fill-current" /> INICIAR PARTIDA
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
         <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
             {/* VAR Overlay */}
             {isVarChecking && (
                 <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center animate-pulse">
                     <MonitorPlay className="w-20 h-20 text-indigo-500 mb-4" />
                     <h2 className="text-3xl font-bold text-white tracking-wider">VAR</h2>
                     <p className="text-indigo-300 mt-2">Checando lance...</p>
                 </div>
             )}

             {/* Scoreboard */}
             <div className="bg-slate-950 p-8 flex justify-between items-center border-b border-slate-800 relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800 px-4 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono font-bold">{currentMinute}'</span>
                </div>

                <div className="text-center w-1/3 mt-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-2">{userTeamName}</h3>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white">{score.user}</span>
                </div>
                <div className="text-center w-1/3 flex flex-col items-center mt-8">
                    <div className={`px-3 py-1 rounded text-xs font-bold uppercase mb-2 ${phase === 'finished' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                        {phase === '1st_half' && '1º Tempo'}
                        {phase === 'halftime' && 'Intervalo'}
                        {phase === '2nd_half' && '2º Tempo'}
                        {phase === 'finished' && 'Fim de Jogo'}
                    </div>
                    <span className="text-gray-600 text-2xl font-bold">X</span>
                </div>
                <div className="text-center w-1/3 mt-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-2">{opponent.name}</h3>
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white">{score.opponent}</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Live Log */}
                <div className="p-6 border-r border-slate-800 h-80 overflow-y-auto bg-slate-900 flex flex-col-reverse">
                    <div className="space-y-3">
                        {logs.map((log, idx) => (
                            <div key={idx} className={`p-3 rounded border-l-2 text-sm animate-in slide-in-from-left duration-300 ${log.includes('GOOOOL') ? 'bg-green-900/20 border-green-500 text-white font-bold' : log.includes('VAR') ? 'bg-indigo-900/20 border-indigo-500 text-indigo-200' : 'bg-slate-800 border-gray-600 text-gray-300'}`}>
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && <p className="text-gray-600 text-center italic mt-10">A bola vai rolar...</p>}
                    </div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 sticky top-0 bg-slate-900 py-2">
                        <Activity className="w-4 h-4" /> Narração Lance a Lance
                    </h4>
                </div>

                {/* AI Commentary / Phase Control */}
                <div className="p-6 h-80 bg-slate-800/50 flex flex-col">
                     <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                        🎙️ Resumo e Controle
                    </h4>
                    
                    <div className="flex-1 overflow-y-auto">
                        {isThinking ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-xs">O narrador está analisando...</p>
                            </div>
                        ) : phase === 'finished' && aiCommentary ? (
                            <div className="prose prose-invert text-sm">
                                <p className="whitespace-pre-line leading-relaxed text-gray-200 font-medium">
                                    "{aiCommentary}"
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                {phase === 'halftime' && (
                                    <button 
                                        onClick={() => playHalf(45, 90, true)}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg animate-bounce"
                                    >
                                        Iniciar 2º Tempo
                                    </button>
                                )}
                                {phase === 'finished' && !aiCommentary && (
                                    <p className="text-gray-500">Gerando comentários finais...</p>
                                )}
                                {(phase === '1st_half' || phase === '2nd_half') && (
                                     <p className="text-gray-500 italic">Partida em andamento...</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
             </div>

             {phase === 'finished' && !isThinking && (
                 <div className="p-4 bg-slate-950 text-center border-t border-slate-800">
                     <button 
                        onClick={handleExit}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto transition-colors"
                     >
                         <SkipForward className="w-5 h-5" /> Voltar ao Menu
                     </button>
                 </div>
             )}
         </div>
    </div>
  );
};