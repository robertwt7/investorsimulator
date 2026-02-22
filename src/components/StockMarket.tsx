import { useState, useMemo } from 'react';
import type { Stock, Exchange } from '../lib/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Lock, LayoutGrid, List, Search } from 'lucide-react';
import { StockDetails } from './StockDetails';

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

type ViewMode = 'grid' | 'list';

export const StockMarket = ({ stocks, onBuy, cash, unlockedExchanges, onUnlock }: StockMarketProps) => {
  const [activeExchange, setActiveExchange] = useState<Exchange>('NASDAQ');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  
  const filteredStocks = useMemo(() => {
    return stocks
      .filter(s => s.exchange === activeExchange)
      .filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [stocks, activeExchange, searchQuery]);

  const selectedStock = useMemo(() => 
    stocks.find(s => s.symbol === selectedStockSymbol),
    [stocks, selectedStockSymbol]
  );

  if (selectedStock) {
    return (
      <StockDetails 
        stock={selectedStock} 
        onBack={() => setSelectedStockSymbol(null)} 
        onBuy={onBuy} 
        cash={cash} 
      />
    );
  }

  const isLocked = !unlockedExchanges.includes(activeExchange);

  return (
    <div className="flex flex-col gap-4">
      {/* Exchange Tabs & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-retro-border pb-2">
        <div className="flex gap-2 overflow-x-auto">
          {(['NASDAQ', 'NYSE', 'LSE', 'CRYPTO'] as Exchange[]).map(ex => (
            <button
              key={ex}
              onClick={() => {
                setActiveExchange(ex);
                setSearchQuery('');
              }}
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

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-retro-muted" size={14} />
            <input 
              type="text"
              placeholder="SEARCH SYMBOL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-retro-surface border border-retro-border text-retro-text text-[10px] pl-8 pr-2 py-2 w-full md:w-48 focus:outline-none focus:border-retro-text font-mono"
            />
          </div>
          <div className="flex border border-retro-border rounded-sm overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-retro-text text-retro-bg' : 'bg-retro-surface text-retro-muted'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-retro-text text-retro-bg' : 'bg-retro-surface text-retro-muted'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
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
             className="px-6 py-3 bg-retro-border text-retro-text font-retro-text font-retro text-xs hover:bg-retro-text hover:text-retro-bg transition-all border border-retro-text shadow-[4px_4px_0px_rgba(26,51,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
           >
             UNLOCK MARKET (${EXCHANGE_COSTS[activeExchange].toLocaleString()})
           </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-retro-surface/30 border border-retro-border/50 rounded-sm min-h-[400px]">
              {filteredStocks.map(stock => (
                <StockCard 
                  key={stock.symbol} 
                  stock={stock} 
                  onBuy={onBuy} 
                  cash={cash} 
                  onClick={() => setSelectedStockSymbol(stock.symbol)}
                />
              ))}
              {filteredStocks.length === 0 && (
                <div className="col-span-full flex items-center justify-center text-retro-muted font-mono py-20">
                  NO STOCKS FOUND MATCHING "{searchQuery}"
                </div>
              )}
            </div>
          ) : (
            <div className="bg-retro-surface/30 border border-retro-border/50 rounded-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-retro-border bg-retro-bg/50">
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase">Symbol</th>
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase">Name</th>
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase text-right">Price</th>
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase text-right">30D Chg</th>
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase text-right">1Y Chg</th>
                      <th className="p-3 text-[10px] font-retro text-retro-muted uppercase text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-retro-border/30">
                    {filteredStocks.map(stock => (
                      <StockRow 
                        key={stock.symbol} 
                        stock={stock} 
                        onBuy={onBuy} 
                        cash={cash} 
                        onClick={() => setSelectedStockSymbol(stock.symbol)}
                      />
                    ))}
                    {filteredStocks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-retro-muted font-mono">
                          NO STOCKS FOUND MATCHING "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const calculateChange = (history: { price: number }[], days: number) => {
  if (history.length < 2) return 0;
  const latest = history[history.length - 1].price;
  const index = Math.max(0, history.length - 1 - days);
  const old = history[index].price;
  return ((latest - old) / old) * 100;
};

const StockRow = ({ stock, onBuy, cash, onClick }: { stock: Stock; onBuy: (s: string, q: number) => void; cash: number; onClick: () => void }) => {
  const [amount, setAmount] = useState(1);
  const chg30 = calculateChange(stock.history, 30);
  const chg1Y = calculateChange(stock.history, 365);
  
  return (
    <tr className="hover:bg-retro-text/5 transition-colors group cursor-pointer" onClick={onClick}>
      <td className="p-3 font-mono text-retro-accent font-bold">{stock.symbol}</td>
      <td className="p-3 text-xs text-retro-text truncate max-w-[120px]">{stock.name}</td>
      <td className="p-3 text-right font-mono text-retro-text font-bold">
        ${stock.price.toFixed(2)}
      </td>
      <td className={`p-3 text-right font-mono text-xs ${chg30 >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
        {chg30 >= 0 ? '+' : ''}{chg30.toFixed(1)}%
      </td>
      <td className={`p-3 text-right font-mono text-xs ${chg1Y >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
        {chg1Y >= 0 ? '+' : ''}{chg1Y.toFixed(1)}%
      </td>
      <td className="p-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-center gap-2">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-10 bg-retro-bg border border-retro-border text-center focus:outline-none focus:border-retro-text font-mono text-[10px] text-retro-text py-1"
          />
          <button 
            onClick={() => onBuy(stock.symbol, amount)}
            disabled={cash < stock.price * amount}
            className="px-2 py-1 bg-retro-text text-retro-bg font-retro text-[8px] hover:bg-retro-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            BUY
          </button>
        </div>
      </td>
    </tr>
  );
};

const StockCard = ({ stock, onBuy, cash, onClick }: { stock: Stock; onBuy: (s: string, q: number) => void; cash: number; onClick: () => void }) => {
  const [amount, setAmount] = useState(1);
  
  const latestPrice = stock.price;
  const prevPrice = stock.history.length > 1 ? stock.history[stock.history.length - 2].price : stock.price;
  const isUp = latestPrice >= prevPrice;

  const handleBuy = () => {
    onBuy(stock.symbol, amount);
  };

  return (
    <div 
      onClick={onClick}
      className="border border-retro-border bg-retro-bg p-4 relative overflow-hidden hover:border-retro-text transition-colors group h-full flex flex-col shadow-sm hover:shadow-[0_0_15px_rgba(51,255,0,0.1)] cursor-pointer"
    >
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

      <div className="flex justify-between items-center mt-auto pt-4 gap-2" onClick={e => e.stopPropagation()}>
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
