export const MessageLog = ({ messages }: { messages: string[] }) => {

  return (
    <div className="border-t-2 border-retro-text bg-retro-dim/50 p-2 h-32 overflow-y-auto font-mono text-xs flex flex-col gap-1">
      <div className="sticky top-0 bg-retro-bg/90 p-1 border-b border-retro-dim text-retro-accent uppercase font-bold text-[10px] tracking-wider mb-1 z-10">
         &gt; SYSTEM LOG
      </div>
      {messages.length === 0 && <div className="opacity-50 italic">No activity recorded.</div>}
      {messages.map((msg, i) => (
        <div key={i} className="flex gap-2">
          <span className="opacity-50 text-[10px] min-w-[20px]">{(i + 1).toString().padStart(2, '0')}</span>
          <span className={`${msg.includes('ERROR') ? 'text-retro-alert' : msg.includes('INSIDER') ? 'text-yellow-400' : 'text-retro-text'}`}>
            {msg}
          </span>
        </div>
      ))}
    </div>
  );
};
