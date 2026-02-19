import { Play, Pause, FastForward } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
}

export const Controls = ({ isPlaying, onTogglePlay, speed, onSetSpeed }: ControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-retro-bg border-t border-retro-border p-4 flex justify-center items-center gap-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <button 
        onClick={onTogglePlay}
        className="flex items-center gap-2 px-8 py-3 bg-retro-text text-retro-bg font-retro hover:bg-retro-accent transition-colors shadow-[4px_4px_0px_rgba(26,51,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
      >
        {isPlaying ? <><Pause size={16} /> PAUSE</> : <><Play size={16} /> RESUME</>}
      </button>

      <div className="flex gap-2 items-center bg-retro-surface p-2 rounded-sm border border-retro-border">
        <span className="text-[10px] font-retro text-retro-muted mr-2">SPEED:</span>
        <button 
           onClick={() => onSetSpeed(1000)}
           className={`px-3 py-1 text-[10px] font-bold transition-all ${speed === 1000 ? 'bg-retro-text text-retro-bg' : 'text-retro-muted hover:text-retro-text'}`}
        >
          1x
        </button>
        <button 
           onClick={() => onSetSpeed(200)}
           className={`px-3 py-1 text-[10px] font-bold transition-all ${speed === 200 ? 'bg-retro-text text-retro-bg' : 'text-retro-muted hover:text-retro-text'}`}
        >
          5x
        </button>
        <button 
           onClick={() => onSetSpeed(50)}
           className={`px-3 py-1 text-[10px] font-bold transition-all ${speed === 50 ? 'bg-retro-alert text-white animate-pulse' : 'text-retro-muted hover:text-retro-text'}`}
        >
          <FastForward size={12} /> MAX
        </button>
      </div>
    </div>
  );
};
