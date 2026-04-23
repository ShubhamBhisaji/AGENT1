import { Message } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MessageListProps {
  messages: Message[];
  activeAgent: { name: string; mandala: string } | null;
  loading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, activeAgent, loading, error, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex-1 p-4 space-y-5 overflow-y-auto custom-scrollbar">
      {activeAgent && (
        <div className="bg-primary/10 backdrop-blur-md border border-primary/30 rounded-lg p-2.5 flex items-center gap-2.5 animate-fade-in shadow-[0_4px_20px_rgba(99,102,241,0.15)]">
          <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping shadow-[0_0_8px_rgba(99,102,241,1)]" />
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
            ACTIVE: {activeAgent.name} ({activeAgent.mandala})
          </span>
        </div>
      )}
      {messages.length === 0 ? (
        <div className="text-center py-12 space-y-6 animate-fade-in">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full animate-spin [animation-duration:3s] blur-md opacity-50" />
            <div className="absolute inset-0.5 bg-[#020617] rounded-full flex items-center justify-center border border-white/10 z-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary animate-pulse text-2xl font-bold">CPU</span>
            </div>
          </div>
          <h3 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent text-xl tracking-tight">DEV-AI ORCHESTRA</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto">
            Your autonomous divine developer. Awaiting your command to architect, design, and build.
          </p>
        </div>
      ) : (
        messages.filter(m => !m.hidden).map(msg => (
          <div key={msg.id} className={cn("flex flex-col gap-1.5 animate-slide-up", msg.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn("px-4 py-3 rounded-2xl text-[13px] leading-relaxed max-w-[90%] backdrop-blur-md shadow-lg",
              msg.role === 'user' ? "bg-gradient-to-br from-primary/90 to-secondary/90 text-white rounded-tr-sm border border-white/20 shadow-[0_4px_20px_rgba(99,102,241,0.3)]" : "bg-[#1e293b]/60 border border-white/10 text-slate-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden")}>
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none prose-pre:p-0 prose-pre:bg-transparent">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md my-2 !bg-[#0d1117] !m-0 !mt-2"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-secondary font-mono text-xs" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <span className="text-[9px] font-semibold tracking-wider text-slate-500 px-2">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))
      )}
      {error && (
        <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-xs shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <strong>System Failure:</strong> {error}
        </div>
      )}
      {loading && (
        <div className="flex gap-2.5 p-3 items-center bg-[#1e293b]/60 backdrop-blur-md rounded-2xl rounded-tl-sm w-fit animate-pulse border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
