import { format } from 'date-fns';

interface HeaderProps {
  date: Date;
  cash: number;
  netWorth: number;
  onEndGame: () => void;
}

export const Header = ({ date, cash, netWorth, onEndGame }: HeaderProps) => {
  return (
    <div className="border-b border-retro-border bg-retro-surface p-4 flex flex-col md:flex-row justify-between items-center font-retro text-sm md:text-base sticky top-0 z-30 shadow-lg shadow-retro-accent/5 gap-4 md:gap-0 backdrop-blur-sm bg-opacity-90">
      <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex gap-2">
          <span className="text-retro-muted">DATE:</span>
          <span>{format(date, 'dd MMM yyyy')}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto justify-between">
         <div className="flex gap-4">
            <div><span className="text-retro-accent">CASH:</span> ${cash.toFixed(2)}</div>
            <div><span className="text-retro-accent">NET WORTH:</span> ${netWorth.toFixed(2)}</div>
         </div>
         <button 
           onClick={onEndGame}
           className="px-4 py-1 border border-retro-alert text-retro-alert hover:bg-retro-alert hover:text-white text-xs ml-4"
         >
           CASH OUT / QUIT
         </button>
      </div>
    </div>
  );
};
