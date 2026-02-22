import type { PortfolioItem, Stock } from '../lib/types';
import { Briefcase } from 'lucide-react';

interface PortfolioProps {
  portfolio: PortfolioItem[];
  stocks: Stock[];
  onSell: (symbol: string, quantity: number) => void;
}

export const Portfolio = ({ portfolio, stocks, onSell }: PortfolioProps) => {
  const totalValue = portfolio.reduce((acc, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return acc + (stock ? stock.price * item.quantity : 0);
  }, 0);

  return (
    <div className="bg-retro-surface border border-retro-border p-4 shadow-md h-full flex flex-col">
      <h2 className="text-xl font-retro mb-4 border-b border-retro-border pb-2 flex items-center justify-between text-retro-accent">
        <span className="flex items-center gap-2"><Briefcase size={20}/> PORTFOLIO</span>
        <span className="text-sm">${totalValue.toFixed(2)}</span>
      </h2>
      
      {portfolio.length === 0 ? (
        <div className="text-center py-12 text-retro-muted opacity-50 italic border-2 border-dashed border-retro-border/30 rounded-sm">
           NO HOLDINGS ACQUIRED
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {portfolio.map(item => {
            const stock = stocks.find(s => s.symbol === item.symbol);
            if (!stock) return null;
            
            const currentValue = stock.price * item.quantity;
            const costBasis = item.averageBuyPrice * item.quantity;
            const profit = currentValue - costBasis;
            const profitPercent = (profit / costBasis) * 100;
            const isProfit = profit >= 0;

            return (
              <div key={item.symbol} className="border border-retro-border p-3 bg-retro-bg hover:border-retro-muted transition-colors group shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-retro-text">{stock.name} <span className="text-[10px] text-retro-muted block">{item.symbol} • x{item.quantity}</span></div>
                  <div className={`text-sm font-bold ${isProfit ? 'text-retro-text' : 'text-retro-alert'}`}>
                    {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                   <div className="text-[10px] text-retro-muted font-mono leading-tight">
                      Avg: ${item.averageBuyPrice.toFixed(2)}<br/>
                      Cur: ${stock.price.toFixed(2)}
                   </div>
                   <button 
                     onClick={() => onSell(item.symbol, item.quantity)}
                     className="px-2 py-1 bg-retro-dim border border-retro-border text-[10px] hover:bg-retro-alert hover:text-white hover:border-retro-alert transition-colors shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                   >
                     SELL ALL
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
