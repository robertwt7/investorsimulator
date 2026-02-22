import type { Stock, GameMode } from './types';
import { addDays, format } from 'date-fns';
import historicalData from './historicalData.json';

// Convert the raw JSON data into a more efficient map or just use it directly.
// The JSON structure is [{ symbol, history: [{ date, price }] }]
const HISTORICAL_MAP = new Map(historicalData.map(item => [item.symbol, item]));

const INITIAL_STOCKS_CONFIG = [
  // NASDAQ (Tech Focus)
  { 
    symbol: 'MSFT', 
    name: 'Microsoft', 
    type: 'giant', 
    basePrice: 0.5, 
    volatility: 0.02, 
    exchange: 'NASDAQ', 
    dividendRate: 0.01,
    description: 'A global leader in software, services, devices and solutions that help people and businesses realize their full potential.',
    ceo: 'Satya Nadella',
    founded: 1975
  },
  { 
    symbol: 'AAPL', 
    name: 'Apple', 
    type: 'giant', 
    basePrice: 0.2, 
    volatility: 0.03, 
    exchange: 'NASDAQ', 
    dividendRate: 0.005,
    description: 'Designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories worldwide.',
    ceo: 'Tim Cook',
    founded: 1976
  },
  { 
    symbol: 'GOOGL', 
    name: 'Google', 
    type: 'tech_boom', 
    basePrice: 50, 
    volatility: 0.04, 
    exchange: 'NASDAQ',
    description: 'Alphabet Inc. is a holding company that provides search and advertising services, cloud computing, and hardware.',
    ceo: 'Sundar Pichai',
    founded: 1998
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon', 
    type: 'giant', 
    basePrice: 1.0, 
    volatility: 0.03, 
    exchange: 'NASDAQ',
    description: 'Operates retail websites and focuses on e-commerce, cloud computing, online advertising, and digital streaming.',
    ceo: 'Andy Jassy',
    founded: 1994
  },
  { 
    symbol: 'NVDA', 
    name: 'Nvidia', 
    type: 'tech_boom', 
    basePrice: 0.1, 
    volatility: 0.07, 
    exchange: 'NASDAQ',
    description: 'The global leader in programmable graphics processor technologies, now a titan in AI and data centers.',
    ceo: 'Jensen Huang',
    founded: 1993
  },
  { 
    symbol: 'AMD', 
    name: 'AMD', 
    type: 'volatile_growth', 
    basePrice: 5.0, 
    volatility: 0.06, 
    exchange: 'NASDAQ',
    description: 'A semiconductor company that develops computer processors and related technologies for business and consumer markets.',
    ceo: 'Lisa Su',
    founded: 1969
  },
  { 
    symbol: 'TSLA', 
    name: 'Tesla', 
    type: 'volatile_growth', 
    basePrice: 2.0, 
    volatility: 0.10, 
    exchange: 'NASDAQ',
    description: 'Designs, develops, manufactures, sells and leases fully electric vehicles and energy generation and storage systems.',
    ceo: 'Elon Musk',
    founded: 2003
  },
  
  // NYSE (Blue Chips & Industrial)
  { 
    symbol: 'IBM', 
    name: 'IBM', 
    type: 'steady', 
    basePrice: 25.0, 
    volatility: 0.015, 
    exchange: 'NYSE', 
    dividendRate: 0.04,
    description: 'International Business Machines Corporation is a multinational technology and consulting company.',
    ceo: 'Arvind Krishna',
    founded: 1911
  },
  { 
    symbol: 'KO', 
    name: 'Coca-Cola', 
    type: 'steady', 
    basePrice: 10.0, 
    volatility: 0.01, 
    exchange: 'NYSE', 
    dividendRate: 0.03,
    description: 'The Coca-Cola Company is a beverage corporation, and manufacturer, retailer, and marketer of non-alcoholic beverages.',
    ceo: 'James Quincey',
    founded: 1886
  },
  { 
    symbol: 'JPM', 
    name: 'JPMorgan', 
    type: 'steady', 
    basePrice: 20.0, 
    volatility: 0.015, 
    exchange: 'NYSE', 
    dividendRate: 0.025,
    description: 'A financial services firm and banking institution, providing investment banking, financial services for consumers and small businesses.',
    ceo: 'Jamie Dimon',
    founded: 1799
  },

  // CRYPTO
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    type: 'volatile_growth', 
    basePrice: 1.0, 
    volatility: 0.15, 
    exchange: 'CRYPTO',
    description: 'The first decentralized digital currency, without a central bank or single administrator.',
    ceo: 'Satoshi Nakamoto',
    founded: 2009
  },
];

// Helper for dividends
export const calculateDividends = (portfolio: any[], stocks: Stock[]): { total: number, details: string[] } => {
  let total = 0;
  const details: string[] = [];

  portfolio.forEach(item => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    if (stock && stock.dividendRate) {
      // Annual dividend paid daily (simplified)
      const dailyDiv = (stock.price * item.quantity * stock.dividendRate) / 365;
      if (dailyDiv > 0.01) { // Only log if it's notable
        total += dailyDiv;
        details.push(`${stock.symbol} paid $${dailyDiv.toFixed(2)} dividend`);
      }
    }
  });

  return { total, details };
};

// Helper for RANDOM mode
const getRandomPriceChange = (price: number): number => {
  const randomMove = (Math.random() - 0.5) * 2;
  // Simplified random logic
  return price * (0.0002 + (randomMove * 0.03));
};

export const getHistoricalPrice = (symbol: string, date: Date): number => {
  const data = HISTORICAL_MAP.get(symbol);
  if (!data) return 0;

  const dateStr = format(date, 'yyyy-MM-dd');
  // Find exact match
  const exact = data.history.find((h: any) => h.date === dateStr);
  if (exact) return exact.price;

  // Interpolate
  // Optimization: Since data is sorted by date, we can find the interval.
  // For a small array (600 items), find is fast enough.
  
  const dateObj = new Date(dateStr);
  
  // Find the data point immediately BEFORE or ON the date
  let prev = null;
  let next = null;

  for (let i = 0; i < data.history.length; i++) {
      const hDate = new Date(data.history[i].date);
      if (hDate <= dateObj) {
          prev = data.history[i];
      } else {
          next = data.history[i];
          break; // Found the immediate next
      }
  }

  if (!prev && next) return next.price; // Before data starts
  if (prev && !next) return prev.price; // After data ends
  if (prev && next) {
      const prevDate = new Date(prev.date).getTime();
      const nextDate = new Date(next.date).getTime();
      const currDate = dateObj.getTime();
      
      const total = nextDate - prevDate;
      const elapsed = currDate - prevDate;
      const ratio = elapsed / total;
      
      return prev.price + (next.price - prev.price) * ratio;
  }

  return 0;
};

const HEADLINES: Record<string, string> = {
  '1987-10-19': 'BLACK MONDAY: Markets crash worldwide!',
  '1990-08-02': 'Gulf War begins. Oil prices fluctuate.',
  '1995-08-09': 'Netscape IPO sparks internet boom!',
  '1997-07-02': 'Asian Financial Crisis begins.',
  '2000-03-10': 'NASDAQ peaks. Dot-com bubble bursting?',
  '2001-09-11': 'Market closed due to attacks.',
  '2008-09-15': 'Lehman Brothers files for bankruptcy.',
  '2020-03-16': 'COVID-19 fears trigger market crash.',
  '2021-01-28': 'Meme stock frenzy! GME to the moon?'
};

export const checkEvents = (date: Date): string | null => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return HEADLINES[dateStr] || null;
};

export const generateInitialStocks = (startDate: Date): Stock[] => {
  return INITIAL_STOCKS_CONFIG.map(config => {
    // Get initial price from history if available, else fallback to config
    const histPrice = getHistoricalPrice(config.symbol, startDate);
    const price = histPrice > 0 ? histPrice : config.basePrice;

    return {
      symbol: config.symbol,
      name: config.name,
      price: price,
      history: [{ date: format(startDate, 'yyyy-MM-dd'), price }],
      volatility: config.volatility,
      sector: config.exchange === 'CRYPTO' ? 'Crypto' : 'Tech',
      exchange: config.exchange as any,
      dividendRate: config.dividendRate
    };
  });
};

export const nextDay = (stocks: Stock[], currentDate: Date, mode: GameMode): Stock[] => {
  const nextDate = addDays(currentDate, 1);
  const dateStr = format(nextDate, 'yyyy-MM-dd');

  return stocks.map(stock => {
    let newPrice = stock.price;

    if (mode === 'HISTORICAL') {
        const histPrice = getHistoricalPrice(stock.symbol, nextDate);
        // If history returns 0 (out of bounds), stick to last price or slight random walk?
        // Let's stick to last price but add tiny noise so it doesn't look dead if gap is huge
        if (histPrice > 0) {
            newPrice = histPrice;
        } else {
            // Fallback if no data
            newPrice = stock.price; 
        }
        // Add tiny daily noise to make chart look "live" even if interpolating linear
        newPrice += (Math.random() - 0.5) * (newPrice * 0.005);
    } else {
        // RANDOM MODE
        const change = getRandomPriceChange(stock.price);
        newPrice = stock.price + change;
    }
    
    if (newPrice < 0.01) newPrice = 0.01;

    return {
      ...stock,
      price: newPrice,
      history: [...stock.history.slice(-365), { date: dateStr, price: newPrice }] // Increased to 365 for yearly view
    };
  });
};
