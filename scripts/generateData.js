import fs from 'fs';
import { addMonths, format, differenceInMonths } from 'date-fns';

// Key historical price points (approximate adjusted close)
const STOCK_MILESTONES = {
  'MSFT': [
    { date: '1990-01-01', price: 0.60 },
    { date: '1999-12-01', price: 58.00 },
    { date: '2000-12-01', price: 22.00 }, // Dotcom crash
    { date: '2008-01-01', price: 35.00 },
    { date: '2009-03-01', price: 15.00 }, // GFC
    { date: '2015-01-01', price: 45.00 },
    { date: '2020-01-01', price: 160.00 },
    { date: '2023-01-01', price: 240.00 }
  ],
  'AAPL': [
    { date: '1990-01-01', price: 0.30 },
    { date: '1997-01-01', price: 0.15 }, // Near bankruptcy
    { date: '2000-01-01', price: 1.00 },
    { date: '2003-01-01', price: 0.25 },
    { date: '2008-01-01', price: 6.00 },
    { date: '2012-09-01', price: 23.00 }, // iPhone boom
    { date: '2018-10-01', price: 55.00 },
    { date: '2020-01-01', price: 75.00 },
    { date: '2023-01-01', price: 130.00 }
  ],
  'AMZN': [
    { date: '1997-05-01', price: 0.10 }, // IPO adjusted
    { date: '1999-12-01', price: 5.00 },
    { date: '2001-09-01', price: 0.30 }, // Crash
    { date: '2010-01-01', price: 6.00 },
    { date: '2015-01-01', price: 15.00 },
    { date: '2018-09-01', price: 100.00 },
    { date: '2020-01-01', price: 90.00 },
    { date: '2021-07-01', price: 180.00 } // Split adjusted approx
  ],
  'GOOGL': [
    { date: '2004-08-01', price: 2.50 }, // IPO
    { date: '2007-11-01', price: 17.00 },
    { date: '2008-11-01', price: 7.00 },
    { date: '2013-01-01', price: 18.00 },
    { date: '2017-01-01', price: 40.00 },
    { date: '2020-01-01', price: 70.00 },
    { date: '2021-11-01', price: 148.00 }
  ],
  'TSLA': [
    { date: '2010-06-01', price: 1.50 }, // IPO
    { date: '2013-01-01', price: 2.50 },
    { date: '2019-06-01', price: 15.00 },
    { date: '2020-01-01', price: 30.00 },
    { date: '2021-11-01', price: 400.00 }, // Massive spike
    { date: '2023-01-01', price: 120.00 }
  ],
  'JPM': [
    { date: '1990-01-01', price: 5.00 },
    { date: '2000-01-01', price: 30.00 },
    { date: '2002-01-01', price: 15.00 },
    { date: '2008-01-01', price: 30.00 },
    { date: '2009-03-01', price: 15.00 },
    { date: '2018-01-01', price: 110.00 },
    { date: '2023-01-01', price: 140.00 }
  ],
  'KO': [
    { date: '1990-01-01', price: 5.00 },
    { date: '1998-01-01', price: 25.00 },
    { date: '2009-01-01', price: 20.00 },
    { date: '2015-01-01', price: 40.00 },
    { date: '2020-01-01', price: 55.00 },
    { date: '2023-01-01', price: 60.00 }
  ],
  'IBM': [
     { date: '1990-01-01', price: 25.00 },
     { date: '1999-01-01', price: 120.00 },
     { date: '2002-01-01', price: 60.00 },
     { date: '2013-01-01', price: 130.00 },
     { date: '2020-01-01', price: 115.00 },
     { date: '2023-01-01', price: 140.00 }
  ]
};

const interpolateData = () => {
  const results = [];
  
  for (const [symbol, milestones] of Object.entries(STOCK_MILESTONES)) {
    console.log(`Generating data for ${symbol}...`);
    const history = [];
    let currentDate = new Date('1980-01-01');
    const endDate = new Date('2025-01-01');
    
    // If stock didn't exist yet, price is 0 or undefined? 
    // We'll start tracking from the first milestone date.
    // But for game purposes, let's say it's flat 0 until IPO.
    
    const firstMilestoneDate = new Date(milestones[0].date);
    
    // Helper to find surrounding milestones
    const getMilestones = (date) => {
        if (date < firstMilestoneDate) return null;
        for (let i = 0; i < milestones.length - 1; i++) {
            const start = new Date(milestones[i].date);
            const end = new Date(milestones[i+1].date);
            if (date >= start && date <= end) {
                return { start: milestones[i], end: milestones[i+1] };
            }
        }
        return { start: milestones[milestones.length-1], end: null };
    };

    while (currentDate <= endDate) {
        const ms = getMilestones(currentDate);
        let price = 0;

        if (ms && ms.end) {
            const startPrice = ms.start.price;
            const endPrice = ms.end.price;
            const startDate = new Date(ms.start.date);
            const endDateMs = new Date(ms.end.date);
            
            const totalTime = endDateMs.getTime() - startDate.getTime();
            const currentTime = currentDate.getTime() - startDate.getTime();
            const ratio = currentTime / totalTime;
            
            // Linear interpolation + Noise
            // Add some sine wave for "market cycles" and random noise
            const trend = startPrice + (endPrice - startPrice) * ratio;
            const noise = (Math.random() - 0.5) * (trend * 0.1); // 10% volatility
            const cycle = Math.sin(currentTime / (1000 * 60 * 60 * 24 * 365) * 2) * (trend * 0.15); // 2 year cycle
            
            price = trend + noise + cycle;
        } else if (ms && !ms.end) {
             // After last milestone, just add noise
             price = ms.start.price + (Math.random() - 0.5) * 5;
        }
        
        if (price < 0.01 && currentDate >= firstMilestoneDate) price = 0.01;
        if (currentDate < firstMilestoneDate) price = 0;

        if (price > 0) {
             history.push({
                 date: format(currentDate, 'yyyy-MM-dd'),
                 price: parseFloat(price.toFixed(2))
             });
        }

        currentDate = addMonths(currentDate, 1);
    }

    results.push({
        symbol,
        name: getFullName(symbol),
        sector: getSector(symbol),
        history,
        price: 0, // will be set by game init
        volatility: 0
    });
  }
  
  return results;
};

const getFullName = (s) => {
    const map = { 
        'MSFT': 'Microsoft', 'AAPL': 'Apple', 'AMZN': 'Amazon', 
        'GOOGL': 'Google', 'TSLA': 'Tesla', 'JPM': 'JPMorgan', 
        'KO': 'Coca-Cola', 'IBM': 'IBM' 
    };
    return map[s];
};

const getSector = (s) => {
    if (['MSFT', 'AAPL', 'GOOGL', 'IBM'].includes(s)) return 'Tech';
    if (['AMZN', 'TSLA'].includes(s)) return 'Consumer'; // Simplified
    if (s === 'JPM') return 'Finance';
    return 'Consumer';
};

const data = interpolateData();
fs.writeFileSync('src/lib/historicalData.json', JSON.stringify(data, null, 2));
console.log('Done.');
