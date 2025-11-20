import React, { useState, useEffect } from 'react';
import { Team, Player, AppView, GameState, MatchFixture } from './types';
import { INITIAL_TEAMS, INITIAL_MARKET } from './constants';
import { TeamManagement } from './components/TeamManagement';
import { MarketPlace } from './components/MarketPlace';
import { MatchEngine } from './components/MatchEngine';
import { MainMenu } from './components/MainMenu';
import { TeamSelection } from './components/TeamSelection';
import { Trophy, ArrowLeft, DollarSign, TrendingDown, TrendingUp, Award, Video, AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppView>('select_team');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [marketPlayers, setMarketPlayers] = useState<Player[]>(INITIAL_MARKET);
  
  // Initial Game State
  const [gameState, setGameState] = useState<GameState>({
    userTeamId: null, 
    budget: 50000000, // 50 Million R$
    transferExpenses: 0,
    seasonWeek: 1,
    leagueTable: INITIAL_TEAMS.map(t => ({ teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, points: 0, goalsFor: 0, goalsAgainst: 0 })),
    myPlayers: [], 
    fixtures: [],
    trophies: [],
    varLogs: []
  });

  // Generate Fixtures (Round Robin)
  const generateSeasonFixtures = (allTeams: Team[]): MatchFixture[] => {
    const fixtures: MatchFixture[] = [];
    const teamIds = allTeams.map(t => t.id);
    const numberOfTeams = teamIds.length;
    const rounds = (numberOfTeams - 1) * 2; // Home and Away
    const matchesPerRound = numberOfTeams / 2;

    if (numberOfTeams < 2) return [];

    let tempTeams = [...teamIds];
    // Remove the first team to keep it fixed in round robin algorithm
    const fixedTeam = tempTeams.shift()!; 

    for (let round = 0; round < rounds; round++) {
        const isSecondHalf = round >= (rounds / 2);
        
        // Pairings for this round
        const home1 = isSecondHalf ? tempTeams[tempTeams.length - 1] : fixedTeam;
        const away1 = isSecondHalf ? fixedTeam : tempTeams[tempTeams.length - 1];
        
        fixtures.push({ week: round + 1, homeTeamId: home1, awayTeamId: away1, played: false });

        for (let i = 0; i < matchesPerRound - 1; i++) {
            const t1 = tempTeams[i];
            const t2 = tempTeams[tempTeams.length - 2 - i];
            
            if (t1 && t2) {
                const home = isSecondHalf ? t2 : t1;
                const away = isSecondHalf ? t1 : t2;
                fixtures.push({ week: round + 1, homeTeamId: home, awayTeamId: away, played: false });
            }
        }

        // Rotate array
        const last = tempTeams.pop()!;
        tempTeams.unshift(last);
    }
    
    return fixtures;
  };

  // Initialize User's Squad when team is selected
  const handleTeamSelection = (teamId: string) => {
    const userTeam = teams.find(t => t.id === teamId);
    if (userTeam) {
      const seasonFixtures = generateSeasonFixtures(teams);
      
      setGameState(prev => ({
        ...prev,
        userTeamId: teamId,
        myPlayers: userTeam.roster,
        fixtures: seasonFixtures
      }));
      setView('menu');
    }
  };

  const handleTransfer = (player: Player, action: 'buy' | 'sell') => {
    if (action === 'buy') {
      if (gameState.budget >= player.value) {
        setGameState(prev => ({
          ...prev,
          budget: prev.budget - player.value,
          transferExpenses: prev.transferExpenses + player.value, // Add to expenses
          myPlayers: [...prev.myPlayers, player]
        }));
        setMarketPlayers(prev => prev.filter(p => p.id !== player.id));
      } else {
        alert("Saldo insuficiente!");
      }
    } else {
      // Sell
      setGameState(prev => ({
        ...prev,
        budget: prev.budget + (player.value * 0.8), // Sell for 80% value
        myPlayers: prev.myPlayers.filter(p => p.id !== player.id)
      }));
      setMarketPlayers(prev => [...prev, player]);
    }
  };

  const updateLeagueTable = (userGoals: number, opponentGoals: number, opponentId: string, matchVarLogs: string[]) => {
    setGameState(prev => {
        // Safety check to ensure leagueTable exists
        const safeTable = prev.leagueTable || [];
        const newTable = safeTable.map(entry => ({ ...entry }));
        
        // Update User Team
        const userStats = newTable.find(t => t.teamId === prev.userTeamId);
        if (userStats) {
            userStats.played += 1;
            userStats.goalsFor += userGoals;
            userStats.goalsAgainst += opponentGoals;
            if (userGoals > opponentGoals) { userStats.points += 3; userStats.won += 1; }
            else if (userGoals === opponentGoals) { userStats.points += 1; userStats.drawn += 1; }
            else { userStats.lost += 1; }
        }

        // Update Opponent Team
        const oppStats = newTable.find(t => t.teamId === opponentId);
        if (oppStats) {
            oppStats.played += 1;
            oppStats.goalsFor += opponentGoals;
            oppStats.goalsAgainst += userGoals;
            if (opponentGoals > userGoals) { oppStats.points += 3; oppStats.won += 1; }
            else if (opponentGoals === userGoals) { oppStats.points += 1; oppStats.drawn += 1; }
            else { oppStats.lost += 1; }
        }

        // Simulate other matches for this week
        const otherMatches = prev.fixtures.filter(f => f.week === prev.seasonWeek && f.homeTeamId !== prev.userTeamId && f.awayTeamId !== prev.userTeamId);
        
        otherMatches.forEach(match => {
            const g1 = Math.floor(Math.random() * 4);
            const g2 = Math.floor(Math.random() * 4);
            
            const hStats = newTable.find(t => t.teamId === match.homeTeamId);
            if (hStats) {
                hStats.played += 1; hStats.goalsFor += g1; hStats.goalsAgainst += g2;
                if (g1 > g2) { hStats.points += 3; hStats.won += 1; }
                else if (g1 === g2) { hStats.points += 1; hStats.drawn += 1; }
                else hStats.lost += 1;
            }
            const aStats = newTable.find(t => t.teamId === match.awayTeamId);
            if (aStats) {
                aStats.played += 1; aStats.goalsFor += g2; aStats.goalsAgainst += g1;
                if (g2 > g1) { aStats.points += 3; aStats.won += 1; }
                else if (g2 === g1) { aStats.points += 1; aStats.drawn += 1; }
                else aStats.lost += 1;
            }
        });

        const nextWeek = prev.seasonWeek + 1;
        
        // Sort Table
        newTable.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));

        // Check Champion
        let newTrophies = [...prev.trophies];
        if (prev.seasonWeek === 38) {
             const champion = newTable[0];
             if (champion && champion.teamId === prev.userTeamId) {
                 newTrophies.push(`Brasileirão Série A - Temporada ${new Date().getFullYear()}`);
             }
        }

        return {
            ...prev,
            seasonWeek: nextWeek,
            leagueTable: newTable,
            varLogs: matchVarLogs || [], // Ensure never undefined
            trophies: newTrophies
        };
    });
  };

  const skipWeek = () => {
      if (gameState.seasonWeek > 38) {
          alert("A temporada acabou!");
          return;
      }
      
      // Find user match safely
      const userMatch = gameState.fixtures.find(f => f.week === gameState.seasonWeek && (f.homeTeamId === gameState.userTeamId || f.awayTeamId === gameState.userTeamId));
      
      if (userMatch) {
          const oppId = userMatch.homeTeamId === gameState.userTeamId ? userMatch.awayTeamId : userMatch.homeTeamId;
          updateLeagueTable(0, 0, oppId, ["Semana simulada, VAR não utilizado."]);
          alert("Semana simulada (Empate 0-0).");
      } else {
          // If no match is found for user (bug or odd number of teams), advance anyway to avoid stuck state
          console.warn("Fixture not found for user in week", gameState.seasonWeek);
          setGameState(prev => ({ ...prev, seasonWeek: prev.seasonWeek + 1 }));
      }
  };

  const PageWrapper = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="h-full bg-slate-900 text-white flex flex-col">
        <div className="bg-slate-950 p-4 flex items-center gap-4 border-b border-slate-800 shrink-0">
            <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-800 rounded-full">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto pb-20">
            {children}
        </div>
    </div>
  );

  const renderContent = () => {
    if (!gameState.userTeamId) {
        return <TeamSelection teams={teams} onSelectTeam={handleTeamSelection} />;
    }

    switch (view) {
      case 'select_team': // Fallback
         return <TeamSelection teams={teams} onSelectTeam={handleTeamSelection} />;
      case 'menu':
        return <MainMenu onNavigate={setView} onSkipWeek={skipWeek} currentWeek={gameState.seasonWeek} />;
      case 'league':
        return (
            <PageWrapper title="Tabela do Campeonato">
                <div className="p-4 md:p-6">
                    <div className="mb-4 text-center text-gray-400 text-sm">Rodada {gameState.seasonWeek > 38 ? 38 : gameState.seasonWeek} de 38</div>
                    <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 pb-2">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                                <tr>
                                    <th className="px-3 py-4">Pos</th>
                                    <th className="px-3 py-4">Time</th>
                                    <th className="px-3 py-4">PTS</th>
                                    <th className="px-3 py-4">J</th>
                                    <th className="px-3 py-4">V</th>
                                    <th className="px-3 py-4">E</th>
                                    <th className="px-3 py-4">D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gameState.leagueTable.map((entry, index) => {
                                    const team = teams.find(t => t.id === entry.teamId);
                                    return (
                                        <tr key={entry.teamId} className={`border-b border-slate-700 ${entry.teamId === gameState.userTeamId ? 'bg-green-900/30' : ''}`}>
                                            <td className={`px-3 py-3 font-bold ${index === 0 ? 'text-yellow-400' : ''}`}>{index + 1}</td>
                                            <td className="px-3 py-3 font-medium text-white flex items-center gap-2 min-w-[120px]">
                                                {entry.teamId === gameState.userTeamId && <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>}
                                                <span className="truncate">{team?.name || 'Time Desconhecido'}</span>
                                            </td>
                                            <td className="px-3 py-3 font-bold text-white">{entry.points}</td>
                                            <td className="px-3 py-3">{entry.played}</td>
                                            <td className="px-3 py-3 text-green-400">{entry.won}</td>
                                            <td className="px-3 py-3 text-yellow-400">{entry.drawn}</td>
                                            <td className="px-3 py-3 text-red-400">{entry.lost}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </PageWrapper>
        );
      case 'finances':
        return (
            <PageWrapper title="Finanças do Clube">
                <div className="p-6 space-y-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                         <div className="flex items-center gap-4 mb-4">
                             <div className="p-3 bg-green-900 rounded-full">
                                 <DollarSign className="w-8 h-8 text-green-400" />
                             </div>
                             <div>
                                 <h3 className="text-gray-400 text-sm font-bold uppercase">Saldo Atual</h3>
                                 <p className="text-3xl font-mono text-white font-bold">R$ {gameState.budget.toLocaleString('pt-BR')}</p>
                             </div>
                         </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                         <div className="flex items-center gap-4 mb-4">
                             <div className="p-3 bg-red-900 rounded-full">
                                 <TrendingDown className="w-8 h-8 text-red-400" />
                             </div>
                             <div>
                                 <h3 className="text-gray-400 text-sm font-bold uppercase">Despesas com Transferências</h3>
                                 <p className="text-3xl font-mono text-red-400 font-bold">- R$ {gameState.transferExpenses.toLocaleString('pt-BR')}</p>
                             </div>
                         </div>
                         <p className="text-xs text-gray-500">Valor total gasto na compra de jogadores nesta temporada.</p>
                    </div>
                </div>
            </PageWrapper>
        );
      case 'trophies':
          return (
            <PageWrapper title="Sala de Troféus">
                 <div className="p-6">
                     {gameState.trophies.length === 0 ? (
                         <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700 border-dashed">
                             <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                             <h3 className="text-xl font-bold text-gray-400">Nenhum Troféu Conquistado</h3>
                             <p className="text-gray-500 mt-2">Vença o campeonato para preencher sua estante.</p>
                         </div>
                     ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {gameState.trophies.map((t, i) => (
                                 <div key={i} className="bg-gradient-to-br from-yellow-700/20 to-yellow-900/20 border border-yellow-600/30 p-6 rounded-xl flex items-center gap-4">
                                     <Award className="w-12 h-12 text-yellow-400" />
                                     <div>
                                         <h4 className="text-yellow-100 font-bold text-lg">{t}</h4>
                                         <p className="text-yellow-500/70 text-sm">Conquista Histórica</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
            </PageWrapper>
          );
      case 'var':
          return (
              <PageWrapper title="Relatório do VAR">
                  <div className="p-6">
                      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                          <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                              <Video className="w-8 h-8 text-indigo-500" />
                              <div>
                                  <h3 className="text-lg font-bold text-white">Registro da Cabine do VAR</h3>
                                  <p className="text-sm text-gray-400">Última partida disputada</p>
                              </div>
                          </div>

                          {(!gameState.varLogs || gameState.varLogs.length === 0) ? (
                              <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                                  <AlertCircle className="w-12 h-12 mb-2 opacity-30" />
                                  <p>Nenhuma intervenção do VAR registrada na última partida.</p>
                              </div>
                          ) : (
                              <div className="space-y-4">
                                  {gameState.varLogs.map((log, idx) => (
                                      <div key={idx} className="bg-slate-900 p-4 rounded-lg border-l-4 border-indigo-500 flex items-start gap-3">
                                          <Video className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                                          <p className="text-gray-200 text-sm">{log}</p>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              </PageWrapper>
          );
      case 'squad':
        return (
            <PageWrapper title="Meu Elenco">
                <TeamManagement players={gameState.myPlayers} onSell={(p) => handleTransfer(p, 'sell')} />
            </PageWrapper>
        );
      case 'market':
        return (
            <PageWrapper title="Mercado de Transferências">
                <MarketPlace players={marketPlayers} budget={gameState.budget} onBuy={(p) => handleTransfer(p, 'buy')} />
            </PageWrapper>
        );
      case 'match':
        // Identify the current match for the user
        if (gameState.seasonWeek > 38) {
             return (
                <PageWrapper title="Temporada Finalizada">
                    <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
                        <Trophy className="w-20 h-20 text-yellow-500 mb-4" />
                        <h2 className="text-2xl font-bold text-white">Temporada Encerrada</h2>
                        <p className="text-gray-400 mt-2">Verifique a tabela para ver sua classificação final.</p>
                    </div>
                </PageWrapper>
             );
        }

        const currentMatch = gameState.fixtures.find(
            f => f.week === gameState.seasonWeek && (f.homeTeamId === gameState.userTeamId || f.awayTeamId === gameState.userTeamId)
        );

        // Determine Opponent with safety checks
        let opponent: Team | undefined;
        if (currentMatch) {
            const opponentId = currentMatch.homeTeamId === gameState.userTeamId ? currentMatch.awayTeamId : currentMatch.homeTeamId;
            opponent = teams.find(t => t.id === opponentId);
        }

        return (
            <PageWrapper title={`Rodada ${gameState.seasonWeek}`}>
                {opponent ? (
                    <MatchEngine 
                        userTeamName={teams.find(t => t.id === gameState.userTeamId)?.name || "Meu Time"} 
                        userSquad={gameState.myPlayers}
                        opponent={opponent} 
                        onMatchComplete={updateLeagueTable}
                    />
                ) : (
                     <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                         <p className="text-red-400 mb-2">Nenhuma partida encontrada para esta rodada.</p>
                         <button onClick={skipWeek} className="bg-blue-600 text-white px-4 py-2 rounded">Avançar Calendário</button>
                     </div>
                )}
            </PageWrapper>
        );
      // Placeholder views for items not fully implemented
      case 'tactics':
      case 'uniform':
      case 'youth':
      case 'stadium':
      case 'social':
        return (
            <PageWrapper title="Em Desenvolvimento">
                <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                    <Trophy className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white">Recurso em Breve</h3>
                    <p className="text-gray-400 mt-2">Esta funcionalidade estará disponível na próxima atualização do Rumo ao Estrelato.</p>
                </div>
            </PageWrapper>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-gray-100 font-sans overflow-hidden flex flex-col">
      {renderContent()}
    </div>
  );
}