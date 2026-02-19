interface ScoreScreenProps {
  netWorth: number;
  initialCash: number;
  startDate: Date;
  currentDate: Date;
  onHome: () => void;
  totalDividends?: number;
}

export const ScoreScreen = ({ netWorth, initialCash, startDate, currentDate, onHome, totalDividends }: ScoreScreenProps) => {
  const profit = netWorth - initialCash;
  const years = (currentDate.getFullYear() - startDate.getFullYear()) + (currentDate.getMonth() - startDate.getMonth()) / 12;
  const cagr = (Math.pow(netWorth / initialCash, 1 / (years || 1)) - 1) * 100;

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono crt flex flex-col items-center justify-center p-4 bg-grid-pattern">
       <div className="max-w-2xl w-full border-2 border-retro-text p-12 bg-retro-surface shadow-[0_0_100px_rgba(51,255,0,0.1)] text-center relative overflow-hidden">
          {/* Decorative Corner Lines */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-retro-text"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-retro-text"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-retro-text"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-retro-text"></div>

          <h1 className="text-4xl md:text-5xl font-retro mb-12 text-retro-accent drop-shadow-[4px_4px_0_rgba(26,51,0,1)]">GAME OVER</h1>
          
          <div className="grid grid-cols-2 gap-12 text-left mb-12">
             <div>
                <div className="text-[10px] font-retro text-retro-muted mb-2 tracking-widest">FINAL NET WORTH</div>
                <div className="text-3xl md:text-4xl font-bold text-retro-text shadow-retro">${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
             </div>
             <div>
                <div className="text-[10px] font-retro text-retro-muted mb-2 tracking-widest">TOTAL PROFIT</div>
                <div className={`text-3xl md:text-4xl font-bold ${profit >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
                   {profit >= 0 ? '+' : ''}${Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
             </div>
             <div>
                <div className="text-[10px] font-retro text-retro-muted mb-2 tracking-widest">DIVIDENDS EARNED</div>
                <div className="text-2xl text-blue-400 font-bold">
                   +${(totalDividends || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
             </div>
             <div>
                <div className="text-[10px] font-retro text-retro-muted mb-2 tracking-widest">ANNUALIZED (CAGR)</div>
                <div className={`text-2xl font-bold ${cagr >= 0 ? 'text-retro-text' : 'text-retro-alert'}`}>
                   {cagr.toFixed(2)}%
                </div>
             </div>
          </div>

          <div className="mb-12 text-xs text-retro-muted border-t border-retro-border pt-6 font-mono">
             SIMULATION PERIOD: <span className="text-retro-text">{startDate.toLocaleDateString()}</span> — <span className="text-retro-text">{currentDate.toLocaleDateString()}</span>
          </div>

          <button 
            onClick={onHome}
            className="w-full py-5 bg-retro-text text-retro-bg font-retro text-xl hover:bg-retro-accent transition-colors shadow-[6px_6px_0px_rgba(26,51,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(26,51,0,1)]"
          >
            RETURN TO MENU
          </button>
       </div>
    </div>
  );
};
