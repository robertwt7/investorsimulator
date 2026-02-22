import { useState } from 'react';
import type { Stock } from '../lib/types';
import { 
  XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, ArrowLeft, Building2, User, Calendar, 
  FileText, Newspaper, ExternalLink, Info 
} from 'lucide-react';

interface StockDetailsProps {
  stock: Stock;
  onBack: () => void;
  onBuy: (symbol: string, amount: number) => void;
  cash: number;
}

export const StockDetails = ({ stock, onBack, onBuy, cash }: StockDetailsProps) => {
  const [amount, setAmount] = useState(1);
  
  const latestPrice = stock.price;
  const prevPrice = stock.history.length > 1 ? stock.history[stock.history.length - 2].price : stock.price;
  const isUp = latestPrice >= prevPrice;

  const chg30 = calculateChange(stock.history, 30);
  const chg1Y = calculateChange(stock.history, 365);

  // Mocked quarterly reports and news based on stock data
  const reports = [
    { period: 'Q3 2025', result: 'BEAT', eps: (Math.random() * 5).toFixed(2), rev: `${(Math.random() * 100).toFixed(1)}B` },
    { period: 'Q2 2025', result: 'MISS', eps: (Math.random() * 5).toFixed(2), rev: `${(Math.random() * 100).toFixed(1)}B` },
    { period: 'Q1 2025', result: 'BEAT', eps: (Math.random() * 5).toFixed(2), rev: `${(Math.random() * 100).toFixed(1)}B` },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-retro-border pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-retro-muted hover:text-retro-text transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-retro text-xs">BACK TO MARKET</span>
        </button>
        <div className="text-right">
           <h2 className="text-3xl font-retro text-retro-accent leading-none">{stock.name}</h2>
           <span className="text-retro-muted font-mono text-sm">{stock.symbol} • {stock.exchange}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content: Chart & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Price Card */}
          <div className="bg-retro-surface/50 border border-retro-border p-6 rounded-sm">
             <div className="flex justify-between items-end mb-6">
                <div>
                   <span className="text-xs text-retro-muted font-retro block mb-1">CURRENT PRICE</span>
                   <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-mono text-retro-text font-bold">${latestPrice.toFixed(2)}</span>
                      <span className={`text-lg font-mono flex items-center gap-1 ${isUp ? 'text-retro-text' : 'text-retro-alert'}`}>
                         {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                         {Math.abs(latestPrice - prevPrice).toFixed(2)} ({((latestPrice - prevPrice)/prevPrice * 100).toFixed(2)}%)
                      </span>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <span className="text-[10px] text-retro-muted font-retro block">30D CHANGE</span>
                      <span className={`font-mono text-sm ${chg30 >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
                        {chg30 >= 0 ? '+' : ''}{chg30.toFixed(1)}%
                      </span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] text-retro-muted font-retro block">1Y CHANGE</span>
                      <span className={`font-mono text-sm ${chg1Y >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
                        {chg1Y >= 0 ? '+' : ''}{chg1Y.toFixed(1)}%
                      </span>
                   </div>
                </div>
             </div>

             <div className="h-[300px] w-full bg-retro-bg/50 border border-retro-border/30 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stock.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? '#33ff00' : '#ff0033'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isUp ? '#33ff00' : '#ff0033'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 10, fill: '#666'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid #33ff00', color: '#33ff00', fontFamily: 'monospace' }}
                      labelStyle={{ color: '#ffcc00' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={isUp ? '#33ff00' : '#ff0033'} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Company Description */}
          <div className="bg-retro-surface/30 border border-retro-border p-6 rounded-sm">
             <h3 className="font-retro text-sm text-retro-accent mb-4 flex items-center gap-2">
                <Info size={16} /> COMPANY OVERVIEW
             </h3>
             <p className="text-retro-text/80 text-sm leading-relaxed font-mono">
                {stock.description || `${stock.name} is a leading player in the ${stock.sector} sector, focused on innovation and long-term market dominance. Headquartered in the financial district, they continue to push boundaries in their respective field.`}
             </p>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <div className="flex flex-col">
                   <span className="text-[10px] text-retro-muted font-retro uppercase mb-1 flex items-center gap-1">
                      <User size={10} /> CEO
                   </span>
                   <span className="text-xs font-mono">{stock.ceo || 'Jane Doe'}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-retro-muted font-retro uppercase mb-1 flex items-center gap-1">
                      <Calendar size={10} /> FOUNDED
                   </span>
                   <span className="text-xs font-mono">{stock.founded || '1975'}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] text-retro-muted font-retro uppercase mb-1 flex items-center gap-1">
                      <Building2 size={10} /> SECTOR
                   </span>
                   <span className="text-xs font-mono">{stock.sector}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Trading & Reports */}
        <div className="flex flex-col gap-6">
           {/* Trading Terminal */}
           <div className="bg-retro-accent/5 border-2 border-retro-accent p-6 rounded-sm shadow-[4px_4px_0px_rgba(51,255,0,0.1)]">
              <h3 className="font-retro text-sm text-retro-accent mb-4">TRADING TERMINAL</h3>
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center bg-retro-bg p-3 border border-retro-border">
                    <span className="text-[10px] font-retro text-retro-muted">AMOUNT</span>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => setAmount(Math.max(1, amount - 1))}
                         className="w-6 h-6 border border-retro-border flex items-center justify-center hover:bg-retro-border transition-colors text-xs font-bold"
                       >
                         -
                       </button>
                       <input 
                         type="number" 
                         value={amount} 
                         onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                         className="w-12 bg-transparent text-center focus:outline-none font-mono text-sm"
                       />
                       <button 
                         onClick={() => setAmount(amount + 1)}
                         className="w-6 h-6 border border-retro-border flex items-center justify-center hover:bg-retro-border transition-colors text-xs font-bold"
                       >
                         +
                       </button>
                    </div>
                 </div>
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-retro text-retro-muted">TOTAL COST</span>
                    <span className="font-mono text-lg text-retro-text">${(latestPrice * amount).toFixed(2)}</span>
                 </div>
                 <button 
                   onClick={() => onBuy(stock.symbol, amount)}
                   disabled={cash < latestPrice * amount}
                   className="w-full py-4 bg-retro-text text-retro-bg font-retro text-sm hover:bg-retro-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_rgba(26,51,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                 >
                   EXECUTE BUY ORDER
                 </button>
                 <div className="text-center">
                    <span className="text-[9px] text-retro-muted font-mono uppercase">Available: ${cash.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           {/* Quarter Reports */}
           <div className="bg-retro-surface/30 border border-retro-border p-4 rounded-sm">
              <h3 className="font-retro text-xs text-retro-muted mb-4 flex items-center gap-2 border-b border-retro-border/30 pb-2">
                 <FileText size={14} /> QUARTERLY REPORTS
              </h3>
              <div className="flex flex-col gap-3">
                 {reports.map((rep, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-retro-border/20 pb-2 last:border-0">
                       <span className="text-retro-text font-bold">{rep.period}</span>
                       <span className={rep.result === 'BEAT' ? 'text-retro-text' : 'text-retro-alert'}>{rep.result}</span>
                       <span className="text-retro-muted">EPS: {rep.eps}</span>
                       <span className="text-retro-muted">REV: {rep.rev}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* News / Links */}
           <div className="bg-retro-surface/30 border border-retro-border p-4 rounded-sm">
              <h3 className="font-retro text-xs text-retro-muted mb-4 flex items-center gap-2 border-b border-retro-border/30 pb-2">
                 <Newspaper size={14} /> RECENT NEWS
              </h3>
              <div className="flex flex-col gap-3">
                 <a href="#" className="group flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-retro-text group-hover:text-retro-accent transition-colors">Market analysts upgrade {stock.symbol} to 'Strong Buy'</span>
                    <span className="text-[8px] text-retro-muted uppercase flex items-center gap-1">
                       WALL ST JOURNAL • 2H AGO <ExternalLink size={8} />
                    </span>
                 </a>
                 <a href="#" className="group flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-retro-text group-hover:text-retro-accent transition-colors">New R&D facility announced by {stock.name}</span>
                    <span className="text-[8px] text-retro-muted uppercase flex items-center gap-1">
                       REUTERS • 5H AGO <ExternalLink size={8} />
                    </span>
                 </a>
              </div>
           </div>
        </div>
      </div>
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
