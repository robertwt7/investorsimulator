import { useState } from 'react';
import type { Stock, Exchange } from '../lib/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Lock } from 'lucide-react';

interface StockMarketProps {
  stocks: Stock[];
  onBuy: (symbol: string, amount: number) => void;
  cash: number;
  unlockedExchanges: Exchange[];
  onUnlock: (exchange: Exchange, cost: number) => void;
}

const EXCHANGE_COSTS: Record<Exchange, number> = {
  NASDAQ: 0,
  NYSE: 5000,
  LSE: 15000,
  CRYPTO: 50000
};

export const StockMarket = ({ stocks, onBuy, cash, unlockedExchanges, onUnlock }: StockMarketProps) => {
  const [activeExchange, setActiveExchange] = useState<Exchange>('NASDAQ');
  
  const filteredStocks = stocks.filter(s => s.exchange === activeExchange);
  const isLocked = !unlockedExchanges.includes(activeExchange);

  return (
    <div className="flex flex-col gap-4">
      {/* Exchange Tabs */}
      <div className="flex border-b border-retro-border gap-2 overflow-x-auto pb-1">
        {(['NASDAQ', 'NYSE', 'LSE', 'CRYPTO'] as Exchange[]).map(ex => (
          <button
            key={ex}
            onClick={() => setActiveExchange(ex)}
            className={`px-4 py-2 text-xs font-retro transition-all flex items-center gap-2 rounded-t-sm border-t border-x ${
              activeExchange === ex 
                ? 'bg-retro-text text-retro-bg border-retro-text font-bold shadow-[0_0_10px_rgba(51,255,0,0.3)]' 
                : 'bg-retro-surface text-retro-muted border-retro-border hover:text-retro-text hover:border-retro-muted'
            }`}
          >
            {!unlockedExchanges.includes(ex) && <Lock size={10} />}
            {ex}
          </button>
        ))}
      </div>

      {isLocked ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-retro-border bg-retro-surface/50 rounded-sm">
           <Lock size={48} className="text-retro-muted mb-4 opacity-50" />
           <h3 className="text-xl font-retro mb-2 text-retro-accent tracking-widest">{activeExchange} LOCKED</h3>
           <p className="text-sm text-retro-muted mb-8 text-center max-w-md font-mono">
             ACCESS DENIED. PURCHASE LICENSE TO TRADE.
           </p>
           <button 
             onClick={() => onUnlock(activeExchange, EXCHANGE_COSTS[activeExchange])}
             className="px-6 py-3 bg-retro-border text-retro-text font-retro text-xs hover:bg-retro-text hover:text-retro-bg transition-all border border-retro-text shadow-[4px_4px_0px_rgba(26,51,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
           >
             UNLOCK MARKET (${EXCHANGE_COSTS[activeExchange].toLocaleString()})
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-retro-surface/30 border border-retro-border/50 rounded-sm min-h-[400px]">
          {filteredStocks.map(stock => (
            <StockCard key={stock.symbol} stock={stock} onBuy={onBuy} cash={cash} />
          ))}
        </div>
      )}
    </div>
  );
};

const StockCard = ({ stock, onBuy, cash }: { stock: Stock; onBuy: (s: string, q: number) => void; cash: number }) => {
  const [amount, setAmount] = useState(1);
  
  const latestPrice = stock.price;
  const prevPrice = stock.history.length > 1 ? stock.history[stock.history.length - 2].price : stock.price;
  const isUp = latestPrice >= prevPrice;

  const handleBuy = () => {
    onBuy(stock.symbol, amount);
  };

  return (
    <div className="border border-retro-border bg-retro-bg p-4 relative overflow-hidden hover:border-retro-text transition-colors group h-full flex flex-col shadow-sm hover:shadow-[0_0_15px_rgba(51,255,0,0.1)]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-retro text-lg text-retro-accent">{stock.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">{stock.symbol}</span>
            {stock.dividendRate && (
              <span className="text-[10px] bg-blue-900/40 text-blue-400 px-1 border border-blue-400/30">
                DIV: {(stock.dividendRate * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className={`text-xl flex items-center gap-1 ${isUp ? 'text-retro-text' : 'text-retro-alert'}`}>
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          ${latestPrice.toFixed(2)}
        </div>
      </div>

      <div className="h-32 w-full mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stock.history}>
             <XAxis dataKey="date" hide />
             <YAxis domain={['auto', 'auto']} hide />
             <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #33ff00', color: '#33ff00', fontFamily: 'monospace' }}
                labelStyle={{ color: '#ffcc00' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
             />
            <Line 
              type="step" 
              dataKey="price" 
              stroke={isUp ? '#33ff00' : '#ff0033'} 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setAmount(Math.max(1, amount - 1))}
            className="px-2 py-1 border border-retro-border hover:bg-retro-border text-retro-muted hover:text-retro-text text-xs font-bold transition-colors"
          >
            -
          </button>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 bg-retro-surface border-b border-retro-muted text-center focus:outline-none focus:border-retro-text font-mono text-sm text-retro-text"
          />
          <button 
            onClick={() => setAmount(amount + 1)}
            className="px-2 py-1 border border-retro-border hover:bg-retro-border text-retro-muted hover:text-retro-text text-xs font-bold transition-colors"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleBuy}
          disabled={cash < latestPrice * amount}
          className="px-3 py-1 bg-retro-text text-retro-bg font-retro text-[10px] hover:bg-retro-accent disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[2px_2px_0px_rgba(26,51,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          BUY (${(latestPrice * amount).toFixed(2)})
        </button>
      </div>
    </div>
  );
};
