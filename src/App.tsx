import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { Header } from './components/Header';
import { StockMarket } from './components/StockMarket';
import { Portfolio } from './components/Portfolio';
import { Controls } from './components/Controls';
import { ScoreScreen } from './components/ScoreScreen';
import { MessageLog } from './components/MessageLog';
import { getHighScores, saveScore, clearSession } from './lib/storage';
import type { GameMode, HighScore } from './lib/types';
import { Monitor, TrendingUp, History, Shuffle, Trophy, DollarSign, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';

function App() {
  const { gameState, buyStock, sellStock, buyInsiderTip, buyExchangeLicense, togglePlay, setSpeed, startGame, endGame } = useGame();
  const [appState, setAppState] = useState<'SETUP' | 'PLAYING' | 'FINISHED'>(() => {
    return (localStorage.getItem('investor-sim-app-state') as any) || 'SETUP';
  });

  useEffect(() => {
    localStorage.setItem('investor-sim-app-state', appState);
  }, [appState]);

  const handleStart = (mode: GameMode, year: number, initialCash: number) => {
    startGame(mode, year, initialCash);
    setAppState('PLAYING');
  };

  const calculateNetWorth = () => {
    const portfolioValue = gameState.portfolio.reduce((acc, item) => {
      const stock = gameState.stocks.find(s => s.symbol === item.symbol);
      return acc + (stock ? stock.price * item.quantity : 0);
    }, 0);
    return gameState.cash + portfolioValue;
  };

  const handleEndGame = () => {
    endGame();
    
    // Save Score
    const netWorth = calculateNetWorth();
    const profit = netWorth - gameState.initialCash;
    const yearsPlayed = (gameState.currentDate.getFullYear() - gameState.startDate.getFullYear()) + 
                       (gameState.currentDate.getMonth() - gameState.startDate.getMonth()) / 12;
    
    const score: HighScore = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      netWorth,
      initialCash: gameState.initialCash,
      mode: gameState.gameMode,
      startYear: gameState.startDate.getFullYear(),
      yearsPlayed,
      returnPct: (profit / gameState.initialCash) * 100
    };
    
    saveScore(score);
    setAppState('FINISHED');
  };

  const handleHome = () => {
    clearSession();
    setAppState('SETUP');
  };

  if (appState === 'SETUP') {
    return <SetupScreen onStart={handleStart} />;
  }

  if (appState === 'FINISHED') {
    return (
      <ScoreScreen 
        netWorth={calculateNetWorth()} 
        initialCash={gameState.initialCash}
        startDate={gameState.startDate}
        currentDate={gameState.currentDate}
        onHome={handleHome}
        totalDividends={gameState.totalDividends}
      />
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono crt pb-24 selection:bg-retro-text selection:text-retro-bg overflow-y-auto flex flex-col bg-grid-pattern">
       <Header 
          date={gameState.currentDate} 
          cash={gameState.cash} 
          netWorth={calculateNetWorth()} 
          onEndGame={handleEndGame}
       />
       <main className="p-4 max-w-7xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
             <div className="flex justify-between items-center border-b border-retro-dim pb-2 mb-2">
                <h2 className="text-xl font-retro flex items-center gap-2">
                   <TrendingUp /> MARKET
                </h2>
                <button 
                  onClick={buyInsiderTip}
                  className="px-3 py-1 text-xs border border-yellow-600 text-yellow-500 hover:bg-yellow-900/30 flex items-center gap-2 transition-colors"
                  title="Cost: $1,000"
                >
                  <Lightbulb size={12} /> BUY TIP ($1k)
                </button>
             </div>
             <StockMarket 
                stocks={gameState.stocks} 
                onBuy={buyStock} 
                cash={gameState.cash} 
                unlockedExchanges={gameState.unlockedExchanges}
                onUnlock={buyExchangeLicense}
             />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-4">
             <Portfolio portfolio={gameState.portfolio} stocks={gameState.stocks} onSell={sellStock} />
             <MessageLog messages={gameState.messages} />
          </div>
       </main>
       <Controls isPlaying={gameState.isPlaying} onTogglePlay={togglePlay} speed={gameState.speed} onSetSpeed={setSpeed} />
    </div>
  );
}

const SetupScreen = ({ onStart }: { onStart: (mode: GameMode, year: number, initialCash: number) => void }) => {
  const [year, setYear] = useState(1990);
  const [mode, setMode] = useState<GameMode>('HISTORICAL');
  const [initialCash, setInitialCash] = useState(10000);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [view, setView] = useState<'SETUP' | 'SCORES'>('SETUP');

  useEffect(() => {
    setHighScores(getHighScores());
  }, []);

  return (
    <div className="min-h-screen bg-retro-bg text-retro-text font-mono flex items-center justify-center crt p-4">
      <div className="max-w-2xl w-full border-4 border-retro-text p-8 bg-retro-dim/20 shadow-[0_0_50px_rgba(51,255,0,0.2)] relative">
        
        {/* Tab Switcher */}
        <div className="absolute top-0 right-0 p-4 flex gap-4">
           <button 
             onClick={() => setView('SETUP')}
             className={`px-4 py-1 text-sm ${view === 'SETUP' ? 'bg-retro-text text-retro-bg' : 'text-retro-text border border-retro-text'}`}
           >
             NEW GAME
           </button>
           <button 
             onClick={() => setView('SCORES')}
             className={`px-4 py-1 text-sm ${view === 'SCORES' ? 'bg-retro-text text-retro-bg' : 'text-retro-text border border-retro-text'}`}
           >
             HIGH SCORES
           </button>
        </div>

        <div className="text-center mb-8 mt-8">
          <Monitor size={48} className="mx-auto mb-4 text-retro-text animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-retro mb-2 text-retro-text shadow-retro">WALL ST. SIM</h1>
        </div>

        {view === 'SCORES' ? (
          <div className="min-h-[400px]">
             <h2 className="text-2xl font-retro mb-6 text-center border-b border-retro-dim pb-2 flex items-center justify-center gap-2">
               <Trophy className="text-yellow-500" /> HALL OF FAME
             </h2>
             {highScores.length === 0 ? (
               <div className="text-center opacity-50 py-12">NO RECORDS FOUND</div>
             ) : (
               <div className="space-y-4">
                 {highScores.map((score, i) => (
                   <div key={score.id} className="flex justify-between items-center border-b border-retro-dim/50 pb-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-6">{i + 1}.</span>
                        <div>
                          <div className="text-retro-accent font-bold">${score.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          <div className="text-xs opacity-70">{format(new Date(score.date), 'MMM d, yyyy')} • {score.yearsPlayed.toFixed(1)} yrs</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className={`font-bold ${score.returnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {score.returnPct > 0 ? '+' : ''}{score.returnPct.toFixed(0)}%
                         </div>
                         <div className="text-xs opacity-70">{score.mode} • Start {score.startYear}</div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div 
                className={`p-4 border-2 cursor-pointer transition-all ${mode === 'HISTORICAL' ? 'border-retro-text bg-retro-dim/40' : 'border-retro-dim hover:border-retro-accent'}`}
                onClick={() => setMode('HISTORICAL')}
              >
                <h3 className="text-lg font-retro mb-1 flex items-center gap-2"><History size={16}/> HISTORICAL</h3>
                <p className="text-xs opacity-80">Real market patterns.</p>
              </div>
              <div 
                className={`p-4 border-2 cursor-pointer transition-all ${mode === 'RANDOM' ? 'border-retro-text bg-retro-dim/40' : 'border-retro-dim hover:border-retro-accent'}`}
                onClick={() => setMode('RANDOM')}
              >
                <h3 className="text-lg font-retro mb-1 flex items-center gap-2"><Shuffle size={16}/> RANDOM WALK</h3>
                <p className="text-xs opacity-80">Pure chaos.</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block font-retro mb-2 text-sm">STARTING YEAR: {year}</label>
                <input 
                  type="range" 
                  min="1980" 
                  max="2020" 
                  value={year} 
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full h-2 bg-retro-dim rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-retro-text"
                />
                <div className="flex justify-between text-[10px] mt-1 opacity-60">
                  <span>1980</span>
                  <span>2020</span>
                </div>
              </div>

              <div>
                <label className="block font-retro mb-2 text-sm flex items-center gap-2">
                   <DollarSign size={16} /> INITIAL CAPITAL
                </label>
                <div className="grid grid-cols-4 gap-2">
                   {[1000, 10000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setInitialCash(amt)}
                        className={`py-2 text-xs border ${initialCash === amt ? 'bg-retro-text text-retro-bg border-retro-text' : 'border-retro-dim text-retro-text hover:border-retro-accent'}`}
                      >
                        ${amt.toLocaleString()}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => onStart(mode, year, initialCash)}
              className="w-full py-4 bg-retro-text text-retro-bg font-retro text-xl hover:bg-retro-accent transition-colors blink"
            >
              INSERT COIN / START
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;