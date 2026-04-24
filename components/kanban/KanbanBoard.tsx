import React from 'react';
import { Workflow } from 'lucide-react';

export function KanbanBoard() {
  return (
    <div className="flex-1 flex flex-col bg-[#020617]/50 backdrop-blur-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-widest flex items-center gap-2">
            <Workflow size={24} className="text-primary" />
            Orchestration Matrix
          </h2>
          <p className="text-xs text-slate-500 tracking-wider mt-1">Real-time visualization of the Divine Engine pipeline.</p>
        </div>
      </div>
      <div className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar">
        {/* Column 1 */}
        <div className="w-80 shrink-0 bg-[#0f172a]/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akasha (Backlog)</span>
            <span className="bg-white/10 text-slate-400 text-[10px] px-2 py-0.5 rounded">3</span>
          </div>
          <div className="bg-[#1e293b]/60 border border-white/5 p-3 rounded-lg shadow-lg">
            <div className="text-xs font-medium text-slate-300 mb-2">Design Global Authentication Context</div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 rounded border border-indigo-500/30">BRAHMA</span>
            </div>
          </div>
          <div className="bg-[#1e293b]/60 border border-white/5 p-3 rounded-lg shadow-lg">
            <div className="text-xs font-medium text-slate-300 mb-2">Map JWT Routes</div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 rounded border border-blue-500/30">GANESHA</span>
            </div>
          </div>
        </div>
        {/* Column 2 */}
        <div className="w-80 shrink-0 bg-[#0f172a]/60 border border-primary/20 rounded-xl p-4 flex flex-col gap-3 relative shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-primary animate-pulse" />
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Sudarshan (In Progress)</span>
            <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded">1</span>
          </div>
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-primary/40 p-3 rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <div className="text-xs font-medium text-white mb-2">Implement Supabase RLS Policies</div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> DURGA
              </span>
              <span className="text-[9px] text-slate-500">Executing...</span>
            </div>
          </div>
        </div>
        {/* Column 3 */}
        <div className="w-80 shrink-0 bg-[#0f172a]/40 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moksha (Completed)</span>
            <span className="bg-white/10 text-slate-400 text-[10px] px-2 py-0.5 rounded">1</span>
          </div>
          <div className="bg-[#020617]/60 border border-white/5 p-3 rounded-lg opacity-60">
            <div className="text-xs font-medium text-slate-400 line-through mb-2">Generate Project Architecture</div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 rounded border border-indigo-500/30">BRAHMA</span>
              <span className="text-[10px] text-emerald-500">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
