export type Position = 'GK' | 'DEF' | 'MID' | 'ATT';

export interface Player {
  id: string;
  name: string;
  position: Position;
  rating: number; // 1-100
  value: number;
  age: number;
  clubId?: string;
}

export interface Team {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  roster: Player[];
}

export interface LeagueEntry {
    teamId: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
}

export interface MatchFixture {
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
}

export interface GameState {
  userTeamId: string | null; // Can be null before selection
  budget: number;
  transferExpenses: number; // Track expenses on players
  seasonWeek: number;
  leagueTable: LeagueEntry[];
  myPlayers: Player[];
  fixtures: MatchFixture[];
  trophies: string[]; // Array of trophy names
  varLogs: string[]; // Logs of VAR decisions from the last match
}

export type AppView = 
  | 'select_team'
  | 'menu'
  | 'squad'
  | 'market'
  | 'match'
  | 'league'
  | 'finances'
  | 'tactics'
  | 'uniform'
  | 'youth'
  | 'stadium'
  | 'social'
  | 'trophies'
  | 'var';