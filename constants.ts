import { Team, Player } from './types';

// Helper to generate random ID
const uid = () => Math.random().toString(36).substr(2, 9);

const TEAM_NAMES = [
  "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Atlético-MG", 
  "Fluminense", "Grêmio", "Internacional", "Botafogo", "Vasco", 
  "Cruzeiro", "Bahia", "Fortaleza", "Athletico-PR", "Santos",
  "Bragantino", "Cuiabá", "Criciúma", "Juventude", "Vitória"
];

// Simplified roster generator
const generateRoster = (teamId: string): Player[] => {
  const roster: Player[] = [];
  const positions = ['GK', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'ATT', 'ATT', 'ATT'];
  
  positions.forEach((pos, i) => {
    roster.push({
      id: uid(),
      name: `${pos === 'GK' ? 'Goleiro' : pos === 'DEF' ? 'Zagueiro' : pos === 'MID' ? 'Meia' : 'Atacante'} ${i+1} (${teamId.split('_')[1]})`,
      position: pos as any,
      rating: Math.floor(Math.random() * (85 - 65 + 1)) + 65,
      value: Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000,
      age: Math.floor(Math.random() * (35 - 18 + 1)) + 18,
      clubId: teamId
    });
  });
  return roster;
};

export const INITIAL_TEAMS: Team[] = TEAM_NAMES.map((name, index) => {
  const id = `team_${index + 1}`;
  return {
    id,
    name,
    primaryColor: '#ff0000', // Simplified colors
    secondaryColor: '#000000',
    roster: generateRoster(id)
  };
});

export const INITIAL_MARKET: Player[] = [
    { id: uid(), name: "Gabriel Barbosa", position: 'ATT', rating: 84, value: 15000000, age: 27 },
    { id: uid(), name: "Arrascaeta", position: 'MID', rating: 88, value: 20000000, age: 29 },
    { id: uid(), name: "Hulk", position: 'ATT', rating: 85, value: 12000000, age: 37 },
    { id: uid(), name: "Lucas Moura", position: 'MID', rating: 82, value: 10000000, age: 31 },
    { id: uid(), name: "Endrick", position: 'ATT', rating: 80, value: 40000000, age: 17 },
    { id: uid(), name: "Payet", position: 'MID', rating: 81, value: 8000000, age: 36 },
    { id: uid(), name: "Veiga", position: 'MID', rating: 86, value: 18000000, age: 28 },
    { id: uid(), name: "Cássio", position: 'GK', rating: 79, value: 5000000, age: 36 },
    { id: uid(), name: "Marcelo", position: 'DEF', rating: 81, value: 6000000, age: 35 },
    { id: uid(), name: "Suárez (Icon)", position: 'ATT', rating: 89, value: 25000000, age: 36 },
];