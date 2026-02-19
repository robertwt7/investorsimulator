import type { HighScore } from './types';

const STORAGE_KEY = 'investor-sim-highscores';

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
