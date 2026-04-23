import { Play, Square } from 'lucide-react';

interface ChatFormProps {
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onStop: () => void;
}

export function ChatForm({ input, setInput, loading, onSendMessage, onStop }: ChatFormProps) {
  return (
    <div className="p-4 border-t border-white/10 bg-[#020617]/50 backdrop-blur-xl">
      <form onSubmit={onSendMessage} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSendMessage(e as any);
            }
          }}
          placeholder="Initialize divine protocol..."
          rows={2}
          className="relative w-full bg-[#0f172a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 text-[13px] font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none pr-12 custom-scrollbar shadow-inner"
        />
        {loading ? (
          <button
            type="button"
            onClick={onStop}
            className="absolute right-3.5 bottom-4.5 text-accent hover:text-red-400 hover:scale-110 transition-all drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            title="Stop Generation"
          >
            <Square size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-3.5 bottom-4.5 text-primary disabled:opacity-30 hover:text-secondary hover:scale-110 transition-all drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
            title="Send Message"
          >
            <Play size={20} fill="currentColor" />
          </button>
        )}
      </form>
    </div>
  );
}
