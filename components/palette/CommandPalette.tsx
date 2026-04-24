import React from 'react';
import { Command, Play, MessageSquare, Layers, Zap } from 'lucide-react';

interface CommandPaletteProps {
  onClose: () => void;
  onRunProject: () => void;
  onInvokeChat: () => void;
  onSummonAgent: (agent: string, prompt: string) => void;
}

export function CommandPalette({ onClose, onRunProject, onInvokeChat, onSummonAgent }: CommandPaletteProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div
        className="w-full max-w-2xl bg-[#0f172a]/95 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_15px_rgba(99,102,241,0.2)] rounded-xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/5 relative">
          <Command size={16} className="text-primary mr-3" />
          <input
            autoFocus
            placeholder="Search commands, agents, or files..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400 font-mono">ESC</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
          <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Actions</div>
          <button
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-primary/20 flex items-center justify-between group transition-colors"
            onClick={() => { onRunProject(); onClose(); }}
          >
            <div className="flex items-center gap-3">
              <Play size={14} className="text-emerald-400" />
              <span className="text-sm text-slate-300 group-hover:text-white font-medium">Run Project Environment</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">F5</span>
          </button>
          <button
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-secondary/20 flex items-center justify-between group transition-colors"
            onClick={() => { onInvokeChat(); onClose(); }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={14} className="text-secondary" />
              <span className="text-sm text-slate-300 group-hover:text-white font-medium">Invoke Dev-AI Assistant</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Ctrl+B</span>
          </button>

          <div className="px-2 py-1.5 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent Shortcuts</div>
          <button
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors"
            onClick={() => { onSummonAgent("BRAHMA", "Review the current architecture and suggest improvements."); onClose(); }}
          >
            <div className="flex items-center gap-3">
              <Layers size={14} className="text-slate-400" />
              <span className="text-sm text-slate-300 group-hover:text-white">Summon <span className="font-bold text-primary">BRAHMA</span> (Architecture)</span>
            </div>
          </button>
          <button
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors"
            onClick={() => { onSummonAgent("SHIVA", "Refactor the open code to remove technical debt."); onClose(); }}
          >
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-slate-400" />
              <span className="text-sm text-slate-300 group-hover:text-white">Summon <span className="font-bold text-primary">SHIVA</span> (Optimization)</span>
            </div>
          </button>
        </div>
      </div>
      {/* Invisible backdrop click catcher */}
      <div className="absolute inset-0 z-[-1]" onClick={() => onClose()} />
    </div>
  );
}
