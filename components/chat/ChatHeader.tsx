import { Flame, X } from 'lucide-react';

interface ChatHeaderProps {
  onTriggerSamudraManthan: () => void;
  onClearChatHistory: () => void;
}

export function ChatHeader({ onTriggerSamudraManthan, onClearChatHistory }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-[#020617]/30 backdrop-blur-md">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chat Session</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onTriggerSamudraManthan}
          className="text-[10px] font-bold text-accent hover:text-white transition-all flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/20 hover:border-accent/50 px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(244,63,94,0.2)]"
          title="Initiate Full Orchestra"
        >
          <Flame size={12} className="animate-pulse" /> Samudra Manthan
        </button>
        <button
          onClick={onClearChatHistory}
          className="text-[10px] text-slate-500 hover:text-red-400 transition-all flex items-center gap-1 bg-white/5 hover:bg-red-500/10 px-2 py-1 rounded-md"
          title="Clear Chat History"
        >
          <X size={12} /> Clear
        </button>
      </div>
    </div>
  );
}
