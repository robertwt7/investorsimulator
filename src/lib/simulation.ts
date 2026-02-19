import type { Stock, GameMode } from './types';
import { addDays, format } from 'date-fns';
import historicalData from './historicalData.json';

// Convert the raw JSON data into a more efficient map or just use it directly.
// The JSON structure is [{ symbol, history: [{ date, price }] }]
const HISTORICAL_MAP = new Map(historicalData.map(item => [item.symbol, item]));

const INITIAL_STOCKS_CONFIG = [
  // NASDAQ (Tech Focus)
  { symbol: 'MSFT', name: 'Microsoft', type: 'giant', basePrice: 0.5, volatility: 0.02, exchange: 'NASDAQ', dividendRate: 0.01 },
  { symbol: 'AAPL', name: 'Apple', type: 'giant', basePrice: 0.2, volatility: 0.03, exchange: 'NASDAQ', dividendRate: 0.005 },
  { symbol: 'GOOGL', name: 'Google', type: 'tech_boom', basePrice: 50, volatility: 0.04, exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon', type: 'giant', basePrice: 1.0, volatility: 0.03, exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'Nvidia', type: 'tech_boom', basePrice: 0.1, volatility: 0.07, exchange: 'NASDAQ' },
  { symbol: 'AMD', name: 'AMD', type: 'volatile_growth', basePrice: 5.0, volatility: 0.06, exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta', type: 'tech_boom', basePrice: 20, volatility: 0.05, exchange: 'NASDAQ' },
  { symbol: 'NFLX', name: 'Netflix', type: 'volatile_growth', basePrice: 1.0, volatility: 0.08, exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla', type: 'volatile_growth', basePrice: 2.0, volatility: 0.10, exchange: 'NASDAQ' },
  { symbol: 'COST', name: 'Costco', type: 'steady', basePrice: 30, volatility: 0.02, exchange: 'NASDAQ', dividendRate: 0.006 },
  
  // NYSE (Blue Chips & Industrial)
  { symbol: 'IBM', name: 'IBM', type: 'steady', basePrice: 25.0, volatility: 0.015, exchange: 'NYSE', dividendRate: 0.04 },
  { symbol: 'KO', name: 'Coca-Cola', type: 'steady', basePrice: 10.0, volatility: 0.01, exchange: 'NYSE', dividendRate: 0.03 },
  { symbol: 'JPM', name: 'JPMorgan', type: 'steady', basePrice: 20.0, volatility: 0.015, exchange: 'NYSE', dividendRate: 0.025 },
  { symbol: 'GE', name: 'Gen Electric', type: 'steady', basePrice: 15.0, volatility: 0.02, exchange: 'NYSE', dividendRate: 0.035 },
  { symbol: 'DIS', name: 'Disney', type: 'steady', basePrice: 12.0, volatility: 0.025, exchange: 'NYSE', dividendRate: 0.012 },
  { symbol: 'V', name: 'Visa', type: 'giant', basePrice: 15.0, volatility: 0.02, exchange: 'NYSE', dividendRate: 0.008 },
  { symbol: 'WMT', name: 'Walmart', type: 'steady', basePrice: 10.0, volatility: 0.015, exchange: 'NYSE', dividendRate: 0.015 },
  { symbol: 'PG', name: 'P&G', type: 'steady', basePrice: 25.0, volatility: 0.01, exchange: 'NYSE', dividendRate: 0.022 },
  { symbol: 'XOM', name: 'Exxon Mobil', type: 'commodity', basePrice: 15.0, volatility: 0.03, exchange: 'NYSE', dividendRate: 0.038 },
  { symbol: 'CVX', name: 'Chevron', type: 'commodity', basePrice: 20.0, volatility: 0.03, exchange: 'NYSE', dividendRate: 0.04 },

  // LSE (Global/Energy)
  { symbol: 'BP', name: 'BP Oil', type: 'commodity', basePrice: 5.0, volatility: 0.04, exchange: 'LSE', dividendRate: 0.05 },
  { symbol: 'HSBC', name: 'HSBC Holdings', type: 'steady', basePrice: 8.0, volatility: 0.02, exchange: 'LSE', dividendRate: 0.045 },
  { symbol: 'AZN', name: 'AstraZeneca', type: 'steady', basePrice: 30.0, volatility: 0.02, exchange: 'LSE', dividendRate: 0.028 },
  { symbol: 'RIO', name: 'Rio Tinto', type: 'commodity', basePrice: 40.0, volatility: 0.045, exchange: 'LSE', dividendRate: 0.06 },
  { symbol: 'SHEL', name: 'Shell', type: 'commodity', basePrice: 25.0, volatility: 0.035, exchange: 'LSE', dividendRate: 0.04 },

  // CRYPTO
  { symbol: 'BTC', name: 'Bitcoin', type: 'volatile_growth', basePrice: 1.0, volatility: 0.15, exchange: 'CRYPTO' },
  { symbol: 'ETH', name: 'Ethereum', type: 'volatile_growth', basePrice: 0.5, volatility: 0.18, exchange: 'CRYPTO' },
  { symbol: 'SOL', name: 'Solana', type: 'volatile_growth', basePrice: 0.1, volatility: 0.25, exchange: 'CRYPTO' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'volatile_growth', basePrice: 0.001, volatility: 0.40, exchange: 'CRYPTO' },
  { symbol: 'XRP', name: 'Ripple', type: 'volatile_growth', basePrice: 0.2, volatility: 0.15, exchange: 'CRYPTO' },
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
      history: [...stock.history.slice(-100), { date: dateStr, price: newPrice }] // Reduce history size for performance
    };
  });
};
