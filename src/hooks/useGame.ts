import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, GameMode, Exchange } from '../lib/types';
import { generateInitialStocks, nextDay, getHistoricalPrice, checkEvents, calculateDividends } from '../lib/simulation';
import { addDays } from 'date-fns';

const INITIAL_CASH = 10000;
const START_DATE = new Date('1990-01-01');

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentDate: START_DATE,
    cash: INITIAL_CASH,
    initialCash: INITIAL_CASH,
    portfolio: [],
    stocks: generateInitialStocks(START_DATE),
    isPlaying: false,
    speed: 500, // ms per tick
    gameMode: 'HISTORICAL',
    startDate: START_DATE,
    messages: [],
    unlockedExchanges: ['NASDAQ'],
    totalDividends: 0
  });

  const timerRef = useRef<number | null>(null);

  const buyInsiderTip = () => {
    setGameState(prev => {
      const COST = 1000;
      if (prev.cash < COST) {
        return {
           ...prev,
           messages: ["ERROR: Insufficient funds for insider tip!", ...prev.messages]
        };
      }

      // Only tip for unlocked exchanges
      const availableStocks = prev.stocks.filter(s => prev.unlockedExchanges.includes(s.exchange));
      if (availableStocks.length === 0) return prev;
      
      const randomStock = availableStocks[Math.floor(Math.random() * availableStocks.length)];
      
      // Look ahead 30 days
      const futureDate = addDays(prev.currentDate, 30);
      let futurePrice = 0;

      if (prev.gameMode === 'HISTORICAL') {
         futurePrice = getHistoricalPrice(randomStock.symbol, futureDate);
         if (futurePrice === 0) futurePrice = randomStock.price; // No data, assume flat
      } else {
         // Random mode: just make something up or return a generic tip
         futurePrice = randomStock.price * (0.9 + Math.random() * 0.2); // +/- 10% guess
      }

      const diff = ((futurePrice - randomStock.price) / randomStock.price) * 100;
      const direction = diff > 0 ? "RISE" : "FALL";
      
      const tip = `INSIDER: ${randomStock.symbol} expected to ${direction} by ~${Math.abs(diff).toFixed(1)}% in 30 days.`;

      return {
        ...prev,
        cash: prev.cash - COST,
        messages: [tip, ...prev.messages]
      };
    });
  };

  const buyExchangeLicense = (exchange: Exchange, cost: number) => {
    setGameState(prev => {
      if (prev.unlockedExchanges.includes(exchange)) return prev;
      if (prev.cash < cost) {
        return {
          ...prev,
          messages: [`ERROR: Not enough cash for ${exchange} license ($${cost.toLocaleString()})`, ...prev.messages]
        };
      }

      return {
        ...prev,
        cash: prev.cash - cost,
        unlockedExchanges: [...prev.unlockedExchanges, exchange],
        messages: [`UNLOCKED: You can now trade on ${exchange}!`, ...prev.messages]
      };
    });
  };

  const tick = useCallback(() => {
    setGameState(prev => {
      const nextStocks = nextDay(prev.stocks, prev.currentDate, prev.gameMode);
      const event = checkEvents(prev.currentDate);
      
      // Calculate dividends
      const { total, details } = calculateDividends(prev.portfolio, prev.stocks);
      
      let newMessages = [...prev.messages];
      if (event) {
          newMessages = [`NEWS: ${event}`, ...newMessages];
      }
      if (details.length > 0 && Math.random() > 0.95) { // Randomly log some dividends to avoid spam
         newMessages = [`DIVIDENDS: Earned $${total.toFixed(2)} from holdings.`, ...newMessages];
      }

      return {
        ...prev,
        currentDate: addDays(prev.currentDate, 1),
        cash: prev.cash + total,
        totalDividends: prev.totalDividends + total,
        stocks: nextStocks,
        messages: newMessages.slice(0, 50)
      };
    });
  }, []);

  useEffect(() => {
    if (gameState.isPlaying) {
      timerRef.current = window.setInterval(tick, gameState.speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isPlaying, gameState.speed, tick]);

  const buyStock = (symbol: string, quantity: number) => {
    setGameState(prev => {
      const stock = prev.stocks.find(s => s.symbol === symbol);
      if (!stock) return prev;

      const cost = stock.price * quantity;
      if (prev.cash < cost) {
        return {
             ...prev,
             messages: [`ERROR: Not enough cash to buy ${quantity} ${symbol}`, ...prev.messages]
        };
      }

      const existingItem = prev.portfolio.find(p => p.symbol === symbol);
      let newPortfolio;

      if (existingItem) {
        newPortfolio = prev.portfolio.map(p => 
          p.symbol === symbol 
            ? { ...p, quantity: p.quantity + quantity, averageBuyPrice: ((p.averageBuyPrice * p.quantity) + cost) / (p.quantity + quantity) }
            : p
        );
      } else {
        newPortfolio = [...prev.portfolio, { symbol, quantity, averageBuyPrice: stock.price }];
      }

      return {
        ...prev,
        cash: prev.cash - cost,
        portfolio: newPortfolio,
        messages: [`BOUGHT: ${quantity} ${symbol} @ $${stock.price.toFixed(2)}`, ...prev.messages]
      };
    });
  };

  const sellStock = (symbol: string, quantity: number) => {
     setGameState(prev => {
      const stock = prev.stocks.find(s => s.symbol === symbol);
      const existingItem = prev.portfolio.find(p => p.symbol === symbol);
      
      if (!stock || !existingItem || existingItem.quantity < quantity) return prev;

      const earnings = stock.price * quantity;
      let newPortfolio;

      if (existingItem.quantity === quantity) {
        newPortfolio = prev.portfolio.filter(p => p.symbol !== symbol);
      } else {
        newPortfolio = prev.portfolio.map(p => 
          p.symbol === symbol 
            ? { ...p, quantity: p.quantity - quantity }
            : p
        );
      }

      const profit = earnings - (existingItem.averageBuyPrice * quantity);

      return {
        ...prev,
        cash: prev.cash + earnings,
        portfolio: newPortfolio,
        messages: [`SOLD: ${quantity} ${symbol} (Profit: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)})`, ...prev.messages]
      };
    });
  };

  const togglePlay = () => setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  const setSpeed = (speed: number) => setGameState(prev => ({ ...prev, speed }));
  
  const startGame = (mode: GameMode, startYear: number, initialCash: number = 10000) => {
    const date = new Date(`${startYear}-01-01`);
    setGameState({
      currentDate: date,
      cash: initialCash,
      initialCash: initialCash,
      portfolio: [],
      stocks: generateInitialStocks(date),
      isPlaying: true,
      speed: 500,
      gameMode: mode,
      startDate: date,
      messages: ["Welcome to Wall St. Sim! Market is OPEN."],
      unlockedExchanges: ['NASDAQ'],
      totalDividends: 0
    });
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  };

  return {
    gameState,
    buyStock,
    sellStock,
    buyInsiderTip,
    buyExchangeLicense,
    togglePlay,
    setSpeed,
    startGame,
    endGame
  };
};
