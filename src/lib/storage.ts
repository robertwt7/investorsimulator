import type { HighScore } from './types';

const STORAGE_KEY = 'investor-sim-highscores';
const SESSION_KEY = 'investor-sim-session';

export const saveScore = (score: HighScore) => {
  const existing = getHighScores();
  const newScores = [...existing, score]
    .sort((a, b) => b.netWorth - a.netWorth)
    .slice(0, 10); // Keep top 10
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
};

export const getHighScores = (): HighScore[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const saveSession = (state: any) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(state));
};

export const getSession = (): any | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    const state = JSON.parse(stored);
    // Revive dates
    if (state.currentDate) state.currentDate = new Date(state.currentDate);
    if (state.startDate) state.startDate = new Date(state.startDate);
    return state;
  } catch (e) {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
