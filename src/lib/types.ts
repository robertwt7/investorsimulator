export type Exchange = 'NASDAQ' | 'NYSE' | 'LSE' | 'CRYPTO';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  history: { date: string; price: number }[];
  volatility: number;
  sector: 'Tech' | 'Finance' | 'Energy' | 'Consumer' | 'Crypto';
  exchange: Exchange;
  dividendRate?: number; // Annual yield (e.g., 0.02 for 2%)
  description?: string;
  ceo?: string;
  founded?: number;
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  averageBuyPrice: number;
}

export type GameMode = 'HISTORICAL' | 'RANDOM';

export interface GameState {
  currentDate: Date;
  cash: number;
  initialCash: number;
  portfolio: PortfolioItem[];
  stocks: Stock[];
  isPlaying: boolean;
  speed: number; // milliseconds per day
  gameMode: GameMode;
  startDate: Date;
  messages: string[];
  unlockedExchanges: Exchange[];
  totalDividends: number;
}

export interface HighScore {
  id: string;
  date: string; // ISO date of score recording
  netWorth: number;
  initialCash: number;
  mode: GameMode;
  startYear: number;
  yearsPlayed: number;
  returnPct: number;
}
