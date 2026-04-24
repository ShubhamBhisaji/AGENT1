'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText,
  Terminal as TerminalIcon,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Folder,
  Files,
  Settings,
  Play,
  Plus,
  X,
  Search,
  Layers,
  Activity,
  Globe,
  RotateCw,
  ExternalLink,
  Zap,
  Sparkles,
  Command,
  ShieldCheck,
  Workflow,
  Box,
  Network,
  GitBranch,
  Database,
  HardDrive
} from 'lucide-react';

import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatForm } from '../components/chat/ChatForm';
import { MessageList } from '../components/chat/MessageList';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { CommandPalette } from '../components/palette/CommandPalette';
import { FileItem } from '../components/files/FileItem';

const Code2 = (props: any) => <span {...props}>&lt;/&gt;</span>;
const Cpu = (props: any) => <span {...props}>CPU</span>;

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle
} from 'react-resizable-panels';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DEV-AI AGENT LORE DATA
const MANDALAS = [
  { name: 'MANDALA I: TRIMURTI', role: 'Executive Orchestration', color: 'text-indigo-400', agents: ['BRAHMA (Architect)', 'VISHNU (Preserver)', 'SHIVA (Transformer)'] },
  { name: 'MANDALA II: SARASWATI', role: 'Creative & UI/UX', color: 'text-fuchsia-400', agents: ['SARASWATI (Design)', 'LAKSHMI (Assets)', 'RATI (Motion)', 'CHANDRA (Theme)', 'VAYU (Perf)', 'MAYA (Illusions)', 'TVAK (Styling)'] },
  { name: 'MANDALA III: VISHWAKARMA', role: 'Core Engineering', color: 'text-blue-400', agents: ['VISHWAKARMA (Lead)', 'INDRA (Network)', 'AGNI (Compiler)', 'VARUNA (Data)', 'KUBERA (Storage)', 'GANESHA (Router)', 'SKANDA (Logic)', 'DHANVANTARI (Docs)', 'SURYA (SEO)', 'YAMA (Errors)'] },
  { name: 'MANDALA IV: HANUMAN', role: 'Security & Quality', color: 'text-emerald-400', agents: ['HANUMAN (Tester)', 'DURGA (Shield)', 'KARTIKEYA (Strategy)', 'BHAIRAVA (Guardian)', 'NANDI (Gatekeeper)'] },
  { name: 'MANDALA V: RISHI', role: 'Intellectual Support', color: 'text-amber-400', agents: ['NARADA (Messaging)', 'BRIHASPATI (Standards)', 'SHUKRA (Research)', 'CHITRAGUPTA (Logging)', 'ADITI (Scale)'] }
];

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  hidden?: boolean;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export default function ChatPage() {
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationCount, setIterationCount] = useState(0);

  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');

  // UI Layout State
  const [sidebarTab, setSidebarTab] = useState<'files' | 'chat' | 'search' | 'agents' | 'git' | 'database'>('chat');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeAgent, setActiveAgent] = useState<{ name: string; mandala: string } | null>(null);
  const [mainView, setMainView] = useState<'editor' | 'browser' | 'kanban'>('editor');

  // IDE State
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<{name: string; path: string; content: string}[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(-1);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['.']));
  const [mounted, setMounted] = useState(false);
  const [executingCommand, setExecutingCommand] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedPort, setDetectedPort] = useState(3001);

  // Power User Features State
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({ cpu: 12, ram: 42, latency: 24, threads: 108 });
  const [creatingNode, setCreatingNode] = useState<{ path: string, type: 'file' | 'directory' } | null>(null);
  const [newNodeName, setNewNodeName] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Abort mechanisms
  const abortControllerRef = useRef<AbortController | null>(null);
  const stopRequestedRef = useRef(false);

  // Auto-scroll logic
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollTerminalToBottom = useCallback(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + J to toggle terminal
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      }
      // Ctrl/Cmd + K for Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Simulate real-time metrics fluctuation
    const metricsInterval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(2, Math.min(98, prev.cpu + (Math.random() * 10 - 5))),
        ram: Math.max(20, Math.min(80, prev.ram + (Math.random() * 4 - 2))),
        latency: Math.max(10, Math.min(100, prev.latency + (Math.random() * 10 - 5))),
        threads: prev.threads
      }));
    }, 2000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(metricsInterval);
    };
  }, []);

  // --- Persistence ---
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const savedMessages = window.localStorage.getItem('devi_messages');
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          if (Array.isArray(parsed)) {
            setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
          }
        } catch (e) { console.error("History load failed"); }
      }
      const savedFiles = window.localStorage.getItem('devi_open_files');
      if (savedFiles) {
        try {
          const parsed = JSON.parse(savedFiles);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOpenFiles(parsed);
            setActiveFileIndex(0);
          }
        } catch (e) { console.error("Files load failed"); }
      } else {
        // If no files saved, clear index
        setActiveFileIndex(-1);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        let serialized = JSON.stringify(messages);
        // Browser localStorage limit is typically ~5MB. If size approaches 4MB (4 * 1024 * 1024), trim history.
        if (serialized.length > 4 * 1024 * 1024) {
          const trimmedMessages = messages.slice(Math.max(0, messages.length - 100)); // Keep last 100 messages
          serialized = JSON.stringify(trimmedMessages);
          console.warn('Chat history trimmed to prevent exceeding localStorage limits.');
        }
        window.localStorage.setItem('devi_messages', serialized);
      } catch (e) {
        console.error('Error saving messages to localStorage:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem('devi_open_files', JSON.stringify(openFiles));
    }
  }, [openFiles]);

  useEffect(() => {
    if (messages.length > 0) {
      // Use requestAnimationFrame to ensure DOM is painted before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToBottom());
      });
    }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (terminalOutput.length > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollTerminalToBottom());
      });
    }
  }, [terminalOutput.length, scrollTerminalToBottom]);

  // Remove the bloated hydration timeout effect

  // --- API Actions ---

  const fetchFileTree = async () => {
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'listDir' }),
      });
      const data = await res.json();
      if (data.success) setFileTree(data.tree);
    } catch (err) {
      console.error('Failed to fetch file tree:', err);
    }
  };

  const handleCreateNodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingNode || !newNodeName.trim()) {
      setCreatingNode(null);
      return;
    }

    // Determine the full path based on the parent. If parent is root '.', just use the name.
    const parentPath = creatingNode.path === '.' ? '' : `${creatingNode.path}/`;
    const fullPath = `${parentPath}${newNodeName.trim()}`;

    // Windows/Unix compatible way to create files/folders via bash (using our remote executor)
    // Note: Assuming git bash or WSL if on Windows, or just generic unix commands
    // We will use standard touch/mkdir assuming a proper terminal environment
    const cmd = creatingNode.type === 'directory' ? `mkdir -p "${fullPath}"` : `touch "${fullPath}"`;

    await executeRemoteCommand(cmd);
    setCreatingNode(null);
    setNewNodeName('');

    // Refresh the tree after short delay to allow filesystem to update
    setTimeout(() => fetchFileTree(), 500);
  };

  const handleDeleteNode = async (path: string) => {
    if(confirm(`Are you sure you want to permanently delete ${path}?`)) {
       // rm -rf is dangerous but standard for IDE deletions. User is warned.
       await executeRemoteCommand(`rm -rf "${path}"`);
       setTimeout(() => fetchFileTree(), 500);
    }
  };

  const triggerSamudraManthan = () => {
    const prompt = `Dev-AI: Initiate Samudra Manthan (The Great Churning).

Objective: Architect, design, and build a complete production-ready application based on my next requirements.
Primary Deity: BRAHMA
Constraint Level: Divine (No placeholders, 100% production-ready).

Command: Orchestrate all 30 agents. NARADA manages communication flow. CHITRAGUPTA logs every decision. Return a complete manifestation, not a partial draft.`;
    handleSendMessage(null, prompt, false);
  };

  useEffect(() => {
    fetchFileTree();
  }, []);

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('devi_messages');
    addTerminalLog('Chat history cleared.');
  };

  const openFile = async (filePath: string, fileName: string) => {
    const existingIndex = openFiles.findIndex(f => f.path === filePath);
    if (existingIndex >= 0) {
      setActiveFileIndex(existingIndex);
      return;
    }

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'readFile', params: { filePath } }),
      });
      const data = await res.json();
      if (data.success) {
        setOpenFiles(prev => [...prev, { path: filePath, name: fileName, content: data.content }]);
        setActiveFileIndex(openFiles.length);
      }
    } catch (err) {
      addTerminalLog(`ERROR: Could not open file ${filePath}`);
    }
  };

  const closeFile = (index: number) => {
    const newFiles = openFiles.filter((_, i) => i !== index);
    setOpenFiles(newFiles);
    if (activeFileIndex === index) {
      setActiveFileIndex(newFiles.length > 0 ? newFiles.length - 1 : -1);
    } else if (activeFileIndex > index) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const addTerminalLog = (log: string) => {
    setTerminalOutput((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const processActions = async (text: string) => {
    // Catch Agent activation
    const agentRegex = /\[\[AGENT:(.*?)\]\]/g;
    let agentMatch;
    if ((agentMatch = agentRegex.exec(text)) !== null) {
      const agentName = agentMatch[1];
      setActiveAgent({ name: agentName, mandala: getAgentMandala(agentName) });
      addTerminalLog(`⚡ AGENT ACTIVATED: ${agentName}`);
    }

    const actionRegex = /\[\[ACTION:(\w+)\|([\s\S]*?)\]\]/g;
    let match;
    let actionResults = [];

    while ((match = actionRegex.exec(text)) !== null) {
      const [_, action, paramsStr] = match;
      try {
        // Handle case where AI might forget JSON and just put text
        let params;
        try {
          params = JSON.parse(paramsStr.trim());
        } catch (jsonErr) {
          // If it's a raw string, try to wrap it nicely
          if (action === 'runCommand') params = { command: paramsStr.trim() };
          else throw jsonErr;
        }
        addTerminalLog(`Executing ${action}...`);
        if (action === 'runCommand') setExecutingCommand(true);

        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, params }),
        });

        const result = await response.json();
        const resultLabel = result.success ? "SUCCESS" : "ERROR";
        const resultSummary = `${resultLabel}: ${result.message || ''} ${result.stdout || ''} ${result.stderr || ''}`;

        actionResults.push(`Action ${action} result: ${resultSummary}`);
        addTerminalLog(`${resultLabel}: ${result.message || 'Action completed'}`);
        if (result.stdout) addTerminalLog(result.stdout);

        // Detect port from output
        if (action === 'runCommand' && result.stdout) {
          const portMatch = result.stdout.match(/port\s+(\d+)/i) || result.stdout.match(/:\s*(\d+)/);
          if (portMatch) {
            const detectedPortNum = parseInt(portMatch[1]);
            setDetectedPort(detectedPortNum);
            setPreviewUrl(`http://localhost:${detectedPortNum}`);
          }
        }

        // Sync Editor if file was written
        if (action === 'writeFile') {
          setOpenFiles(prev => prev.map(f =>
            f.path === params.filePath ? { ...f, content: params.content } : f
          ));
        }
        fetchFileTree();
      } catch (e) {
        addTerminalLog(`FAILED to parse action: ${paramsStr}`);
        actionResults.push(`Action ${action} failed to execute due to system error.`);
      } finally {
        setExecutingCommand(false);
      }
    }

    // Check if stop was requested before continuing
    if (stopRequestedRef.current) {
      addTerminalLog("⚠️ Autonomous loop stopped by user.");
      setIterationCount(0);
      return;
    }

    // If actions were performed, continue the autonomous loop (with iteration limit)
    if (actionResults.length > 0 && iterationCount < 10) {
      const observation = `[[OBSERVATION]]\n${actionResults.join('\n')}\n\nContinue with the next step. If complete, say "TASK COMPLETE".`;

      setIterationCount(iterationCount + 1);
      // Automatic follow-up to keep the "chain" going
      setTimeout(() => {
        handleSendMessage(null, observation, true);
      }, 500);
    } else if (iterationCount >= 10) {
      addTerminalLog("⚠️ Reached maximum iterations (10). Task may need manual intervention.");
      setIterationCount(0);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | null, overrideInput?: string, isSystemAction?: boolean) => {
    if (e) e.preventDefault();

    // Reset stop flag on new user action
    if (!isSystemAction) {
      stopRequestedRef.current = false;
    }

    const messageContent = overrideInput || input;
    if (!messageContent.trim()) return;

    // Reset iteration counter on user message (not system/observation)
    if (!isSystemAction && !overrideInput?.includes('[[OBSERVATION]]')) {
      setIterationCount(0);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: isSystemAction ? 'system' : 'user',
      content: messageContent,
      timestamp: new Date(),
      hidden: isSystemAction
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    if (!overrideInput) setInput('');
    setLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: messageContent,
          fullHistory: updatedMessages  // Always send complete history
        }),
        signal: abortControllerRef.current.signal
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      await processActions(data.message);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        addTerminalLog('⚠️ Request aborted by user.');
        return;
      }
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      addTerminalLog(`ERROR: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    stopRequestedRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    addTerminalLog('⚠️ Stop signal sent.');
  };

  const handleManualCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      const command = terminalInput;
      setTerminalInput('');
      setExecutingCommand(true);
      addTerminalLog(`> ${command}`);

      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'runCommand', params: { command } }),
        });
        const result = await response.json();
        if (result.success) {
          if (result.stdout) addTerminalLog(result.stdout);
          if (result.stderr) addTerminalLog(`STDERR: ${result.stderr}`);
          fetchFileTree(); // Refresh file tree after commands
        } else {
          addTerminalLog(`ERROR: ${result.message}`);
        }
      } catch (err) {
        addTerminalLog('FAILED to execute command');
      } finally {
        setExecutingCommand(false);
      }
    }
  };

  const findAvailablePort = async (startPort = 3001, maxAttempts = 10): Promise<number> => {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      try {
        await fetch(`http://localhost:${port}/`, {
          signal: AbortSignal.timeout(200)
        });
        // Port is responding, try next
      } catch {
        // Port is likely available
        return port;
      }
    }
    return startPort;  // Fallback
  };

  const runProject = async () => {
    addTerminalLog('> Starting project...');
    const availablePort = await findAvailablePort(3001);
    setDetectedPort(availablePort);
    setPreviewUrl(`http://localhost:${availablePort}`);

    // Use npm run dev for development sandboxes as it doesn't require a build step
    let command = `set PORT=${availablePort} && npm run dev`;

    addTerminalLog(`> Running on port ${availablePort} (dev mode)...`);
    await executeRemoteCommand(command);
  };

  const executeRemoteCommand = async (command: string) => {
    setExecutingCommand(true);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'runCommand', params: { command } }),
      });
      const result = await response.json();
      if (result.success) {
        if (result.stdout) addTerminalLog(result.stdout);
        if (result.stderr) addTerminalLog(`STDERR: ${result.stderr}`);
        fetchFileTree();
      } else {
        addTerminalLog(`ERROR: ${result.message}`);
      }
    } catch (err) {
      addTerminalLog('FAILED to execute command');
    } finally {
      setExecutingCommand(false);
    }
  };

  const getAgentMandala = (name: string) => {
    const map: Record<string, string> = {
      'BRAHMA': 'TRIMURTI', 'VISHNU': 'TRIMURTI', 'SHIVA': 'TRIMURTI',
      'SARASWATI': 'SARASWATI MANDALA', 'VISHWAKARMA': 'VISHWAKARMA MANDALA',
      'INDRA': 'VISHWAKARMA MANDALA', 'AGNI': 'VISHWAKARMA MANDALA'
    };
    return map[name.toUpperCase()] || 'DEV-AI ORCHESTRA';
  };

  if (!mounted) return <div className="h-screen bg-[#020617]" />;

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden relative selection:bg-indigo-500/30">

      {/* Cyberpunk ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-[#020617] to-[#020617] z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-50 pointer-events-none" />

      {/* Main App Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Global Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 max-w-sm bg-red-950/80 backdrop-blur-xl border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(239,68,68,0.2)] z-[100] animate-slide-up">
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Activity Bar (Slim Sidebar) */}
      <div className="w-14 flex flex-col items-center py-4 gap-4 border-r border-white/10 bg-[#020617]/60 backdrop-blur-xl z-50 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => { setSidebarTab('files'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", sidebarTab === 'files' ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Explorer"
        >
          <Files size={22} />
        </button>
        <button
          onClick={() => { setSidebarTab('chat'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300 relative group", sidebarTab === 'chat' ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Devi AI Assistant"
        >
          <MessageSquare size={22} />
          {/* Glowing indicator */}
          <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
        </button>
        <button
          onClick={() => { setSidebarTab('search'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", sidebarTab === 'search' ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Search"
        >
          <Search size={22} />
        </button>
        <button
          onClick={() => { setSidebarTab('agents'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", sidebarTab === 'agents' ? "text-accent bg-accent/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Agent Swarm (Mandalas)"
        >
          <Network size={22} />
        </button>
        <button
          onClick={() => { setSidebarTab('git'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", sidebarTab === 'git' ? "text-orange-400 bg-orange-400/10 shadow-[0_0_15px_rgba(251,146,60,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Source Control"
        >
          <GitBranch size={22} />
        </button>
        <button
          onClick={() => { setSidebarTab('database'); setShowSidebar(true); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", sidebarTab === 'database' ? "text-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Database & Storage"
        >
          <Database size={22} />
        </button>

        <div className="w-8 h-[1px] bg-white/10 my-2" />

        <button
          onClick={() => { setMainView(mainView === 'editor' ? 'browser' : 'editor'); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", mainView === 'browser' ? "text-secondary bg-secondary/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Toggle Browser Preview"
        >
          <Globe size={22} />
        </button>
        <button
          onClick={() => { setMainView(mainView === 'kanban' ? 'editor' : 'kanban'); }}
          className={cn("p-2.5 rounded-xl transition-all duration-300", mainView === 'kanban' ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5")}
          title="Orchestration Matrix (Kanban)"
        >
          <Workflow size={22} />
        </button>
        <div className="mt-auto flex flex-col gap-4">
          <button className="text-slate-500 hover:text-slate-200 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300" title="Activity"><Activity size={20} /></button>
          <button className="text-slate-500 hover:text-slate-200 p-2.5 hover:bg-white/5 rounded-xl transition-all duration-300" title="Settings"><Settings size={20} /></button>
        </div>
      </div>

      <PanelGroup orientation="horizontal" className="flex-1">
        {/* Main Sidebar (Explorer / Chat) */}
        {showSidebar && (
          <>
            <Panel defaultSize={20} minSize={15}>
              <div className="h-full flex flex-col border-r border-white/10 bg-[#0f172a]/40 backdrop-blur-md relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="p-3 border-b border-white/10 flex items-center justify-between relative z-10 bg-[#020617]/50 backdrop-blur-xl">
                  <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                    {sidebarTab === 'files' ? 'Explorer' : sidebarTab === 'chat' ? 'Devi AI Chat' : sidebarTab === 'agents' ? 'Agent Swarm' : sidebarTab === 'git' ? 'Source Control' : sidebarTab === 'database' ? 'Database' : 'Search'}
                  </span>
                  <button onClick={() => setShowSidebar(false)} className="text-slate-500 hover:text-white transition-colors">
                    <ChevronRight size={16} className="rotate-180" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                  {sidebarTab === 'agents' && (
                    <div className="py-2 px-3 space-y-4">
                      <div className="text-center py-4 border-b border-white/5 mb-2">
                        <Network size={32} className="mx-auto text-accent mb-2 opacity-80 animate-pulse" />
                        <h3 className="text-sm font-bold text-slate-200">DEV-AI SWARM</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">30 Divine Agents Online</p>
                      </div>
                      {MANDALAS.map(mandala => (
                        <div key={mandala.name} className="bg-[#0f172a]/60 border border-white/5 rounded-lg p-2.5">
                          <h4 className={cn("text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center justify-between", mandala.color)}>
                            {mandala.name}
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                          </h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">{mandala.role}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {mandala.agents.map(agent => {
                              const isAgentActive = activeAgent?.name && agent.includes(activeAgent.name);
                              return (
                                <span key={agent} className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded border transition-colors",
                                  isAgentActive
                                    ? `bg-${mandala.color.replace('text-', '')}/20 border-${mandala.color.replace('text-', '')}/50 ${mandala.color} shadow-[0_0_8px_currentColor]`
                                    : "bg-black/30 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/20"
                                )}>
                                  {agent}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sidebarTab === 'git' && (
                    <div className="py-4 px-4 text-center space-y-4">
                      <GitBranch size={32} className="mx-auto text-orange-400 opacity-80" />
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Chitragupta's Ledger</h3>
                      <p className="text-xs text-slate-500">Version control tracking and state history is currently managed by Chitragupta.</p>
                      <button className="w-full bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 text-orange-400 py-2 rounded transition-all text-xs font-bold uppercase tracking-widest">
                        Commit Current State
                      </button>
                    </div>
                  )}

                  {sidebarTab === 'database' && (
                    <div className="py-4 px-4 text-center space-y-4">
                      <Database size={32} className="mx-auto text-emerald-400 opacity-80" />
                      <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Vishnu's Core</h3>
                      <p className="text-xs text-slate-500">State preservation, caching, and database schemas.</p>
                      <div className="bg-[#0f172a]/60 border border-white/5 rounded-lg p-3 text-left">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Connected Entities</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><HardDrive size={12}/> users</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1"><HardDrive size={12}/> sessions</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400"><HardDrive size={12}/> agent_logs</div>
                      </div>
                    </div>
                  )}

                  {sidebarTab === 'files' && (
                    <div className="py-2">
                      <div className="px-4 py-1 text-[10px] font-bold text-gray-500 uppercase flex items-center justify-between group">
                        <span>Workspace: projects</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                          <button onClick={fetchFileTree} title="Refresh Workspace"><Plus size={12} className="rotate-45" /></button>
                        </div>
                      </div>
                      {fileTree && fileTree.children && fileTree.children.length > 0 ? (
                        <FileItem
                          node={fileTree}
                          expandedFolders={expandedFolders}
                          creatingNode={creatingNode}
                          newNodeName={newNodeName}
                          setNewNodeName={setNewNodeName}
                          setCreatingNode={setCreatingNode}
                          setExpandedFolders={setExpandedFolders}
                          toggleFolder={toggleFolder}
                          handleCreateNodeSubmit={handleCreateNodeSubmit}
                          handleDeleteNode={handleDeleteNode}
                          openFile={openFile}
                        />
                      ) : (
                        <div className="p-8 text-center space-y-2">
                          <Folder size={24} className="mx-auto text-gray-700" />
                          <p className="text-xs text-gray-600 italic">Workspace is empty. Ask Devi to build something!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {sidebarTab === 'chat' && (
                    <div className="flex flex-col h-full relative z-10">
                      {activeAgent && (
                        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-accent z-50 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                      )}

                      <ChatHeader
                        onTriggerSamudraManthan={triggerSamudraManthan}
                        onClearChatHistory={clearChatHistory}
                      />

                      <MessageList
                        messages={messages}
                        activeAgent={activeAgent}
                        loading={loading}
                        error={error}
                        messagesEndRef={messagesEndRef}
                      />

                      <ChatForm
                        input={input}
                        setInput={setInput}
                        loading={loading}
                        onSendMessage={handleSendMessage}
                        onStop={handleStop}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            <PanelResizeHandle className="w-1 bg-transparent hover:bg-primary/30 transition-colors" />
          </>
        )}

        {/* Editor & Content Area */}
        <Panel defaultSize={80} minSize={30}>
          <div className="h-full flex flex-col overflow-hidden bg-[#020617]/40 backdrop-blur-md relative z-10">
            <PanelGroup orientation="vertical">
              <Panel defaultSize={70} minSize={20}>
                <div className="h-full flex flex-col relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />

                  {/* Tab Bar */}
                  <div className="flex bg-[#020617]/60 backdrop-blur-xl border-b border-white/10 h-10 overflow-x-auto custom-scrollbar items-center justify-between pr-3 relative z-10">
                    <div className="flex h-full">
                      {openFiles.length === 0 ? (
                        <div className="flex items-center px-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase h-full">System Idle</div>
                      ) : (
                        openFiles.map((file, i) => (
                          <div
                            key={file.path}
                            className={cn(
                              "flex items-center gap-2 px-4 border-r border-white/5 cursor-pointer select-none transition-all duration-200 h-full group relative",
                              activeFileIndex === i ? "bg-[#0f172a]/80 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                            )}
                            onClick={() => setActiveFileIndex(i)}
                          >
                            {activeFileIndex === i && (
                              <div className="absolute top-0 inset-x-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            )}
                            <FileText size={14} className={activeFileIndex === i ? "text-primary drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" : "text-slate-600"} />
                            <span className="text-xs font-medium tracking-wide">{file.name}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); closeFile(i); }}
                              className="p-1 hover:bg-white/10 hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={runProject}
                        disabled={executingCommand}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:from-emerald-600/30 hover:to-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] text-[10px] font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:grayscale"
                        title="Run project (npm start)"
                      >
                        <Play size={12} fill="currentColor" />
                        Execute
                      </button>
                    </div>
                  </div>

                  {/* Editor Main Section */}
                  <div className="flex-1 relative flex flex-col z-10">
                    {mainView === 'browser' ? (
                      <div className="flex-1 flex flex-col bg-[#020617] relative">
                        <div className="bg-[#0f172a]/80 backdrop-blur-md p-2 flex items-center gap-3 border-b border-white/10 z-10 shadow-lg">
                          <button onClick={() => setPreviewUrl(previewUrl)} className="text-slate-400 hover:text-primary transition-colors p-1.5 hover:bg-white/5 rounded-md"><RotateCw size={14}/></button>
                          <div className="flex-1 bg-[#020617] border border-white/5 shadow-inner rounded-md px-3 py-1.5 text-xs font-mono text-slate-300 truncate">
                            {previewUrl || `http://localhost:${detectedPort}`}
                          </div>
                          <a href={previewUrl || '#'} target="_blank" className="text-slate-400 hover:text-primary transition-colors p-1.5 hover:bg-white/5 rounded-md"><ExternalLink size={14}/></a>
                        </div>
                        {previewUrl ? (
                          <iframe src={previewUrl} className="flex-1 border-none w-full h-full bg-white z-0" />
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center bg-[#020617]/50 text-slate-500 font-mono text-sm space-y-4">
                            <Globe size={48} className="text-slate-700 opacity-50" />
                            <p>Awaiting execution to bind port.</p>
                          </div>
                        )}
                      </div>
                    ) : mainView === 'kanban' ? (
                      <KanbanBoard />
                    ) : activeFileIndex >= 0 ? (
                      <div className="flex-1 relative bg-[#020617]/50 backdrop-blur-sm group/editor">
                        {/* Floating Editor Actions - Visible on hover or active */}
                        <div className="absolute top-4 right-6 z-20 flex items-center gap-2 opacity-0 group-hover/editor:opacity-100 transition-opacity duration-300">
                          <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-1 flex items-center gap-1">
                            <button
                              onClick={() => {
                                handleSendMessage(null, `[[AGENT:SHIVA]] Review and optimize this file: ${openFiles[activeFileIndex].path}`, false);
                                setSidebarTab('chat'); setShowSidebar(true);
                              }}
                              className="px-2.5 py-1.5 flex items-center gap-1.5 rounded-md hover:bg-white/10 text-xs font-semibold text-primary transition-colors"
                              title="Optimize with SHIVA"
                            >
                              <Sparkles size={12} /> Optimize
                            </button>
                            <button
                              onClick={() => {
                                handleSendMessage(null, `[[AGENT:HANUMAN]] Analyze this file for bugs or vulnerabilities: ${openFiles[activeFileIndex].path}`, false);
                                setSidebarTab('chat'); setShowSidebar(true);
                              }}
                              className="px-2.5 py-1.5 flex items-center gap-1.5 rounded-md hover:bg-white/10 text-xs font-semibold text-accent transition-colors"
                              title="Find Bugs with HANUMAN"
                            >
                              <ShieldCheck size={12} /> Analyze
                            </button>
                            <button
                              onClick={() => {
                                handleSendMessage(null, `[[AGENT:BRIHASPATI]] Add comprehensive documentation and comments to: ${openFiles[activeFileIndex].path}`, false);
                                setSidebarTab('chat'); setShowSidebar(true);
                              }}
                              className="px-2.5 py-1.5 flex items-center gap-1.5 rounded-md hover:bg-white/10 text-xs font-semibold text-secondary transition-colors"
                              title="Document with BRIHASPATI"
                            >
                              <FileText size={12} /> Document
                            </button>
                          </div>
                        </div>

                        <Editor
                          height="100%"
                          theme="vs-dark"
                          path={openFiles[activeFileIndex].path}
                          defaultLanguage="typescript"
                          value={openFiles[activeFileIndex].content}
                          onChange={(value) => {
                            if (activeFileIndex >= 0) {
                              setOpenFiles(prev => prev.map((f, i) =>
                                i === activeFileIndex ? { ...f, content: value || '' } : f
                              ));
                            }
                          }}
                          options={{
                            fontSize: 14,
                            minimap: { enabled: true },
                            padding: { top: 16 },
                            scrollBeyondLastLine: false,
                            fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                            automaticLayout: true,
                            cursorBlinking: 'smooth',
                            smoothScrolling: true,
                            lineHeight: 24,
                            renderLineHighlight: 'all',
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-8 animate-fade-in relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative group cursor-pointer" onClick={() => { setSidebarTab('chat'); setShowSidebar(true); }}>
                          <Code2 size={120} className="text-white/5 group-hover:text-primary/20 transition-colors duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border border-primary/20 border-t-primary border-r-secondary border-b-accent animate-spin [animation-duration:3s]" />
                            <div className="absolute w-14 h-14 rounded-full border border-secondary/20 border-l-secondary border-t-accent animate-spin [animation-duration:2s] [animation-direction:reverse]" />
                          </div>
                        </div>
                        <div className="space-y-3 z-10">
                          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 tracking-tight">System Online</h2>
                          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            Welcome to the <span className="text-primary font-bold">DEV-AI</span> operating environment. Select a node or invoke an agent to begin structural generation.
                          </p>
                        </div>
                        <div className="flex gap-4 z-10">
                          <div className="px-4 py-3 rounded-xl bg-[#0f172a]/60 backdrop-blur-md border border-white/5 text-center shadow-lg shadow-black/20 hover:border-primary/30 transition-colors">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">New Node</p>
                            <p className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">Ctrl + N</p>
                          </div>
                          <div className="px-4 py-3 rounded-xl bg-[#0f172a]/60 backdrop-blur-md border border-white/5 text-center shadow-lg shadow-black/20 hover:border-secondary/30 transition-colors">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Compile</p>
                            <p className="text-xs font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">F5</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              {showTerminal && (
                <>
                  <PanelResizeHandle className="h-1 bg-transparent hover:bg-primary/50 transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />
                  </PanelResizeHandle>
                  <Panel defaultSize={30} minSize={10}>
                    {/* Bottom Terminal Panel */}
                    <div className="h-full bg-[#020617]/80 backdrop-blur-md flex flex-col relative">
                      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest border-b-2 border-primary pb-1.5 pt-0.5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                            <TerminalIcon size={14} />
                            Terminal
                          </button>
                          <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors pb-1.5 pt-0.5">
                            <Layers size={14} />
                            Output
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setTerminalOutput([])} className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-colors" title="Clear Console">
                            <X size={14} />
                          </button>
                          <button onClick={() => setShowTerminal(false)} className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-white/5 transition-colors">
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] space-y-1.5 custom-scrollbar bg-transparent z-10">
                        {terminalOutput.map((log, i) => (
                          <div key={i} className="text-slate-400 leading-relaxed tracking-wide">
                            {log.startsWith('>') ? (
                              <div className="flex items-center gap-2 text-primary font-bold mt-3 mb-1">
                                <ChevronRight size={14} className="animate-pulse" />
                                <span>{log.substring(1)}</span>
                              </div>
                            ) : log.includes('ERROR') || log.includes('FAILED') ? (
                              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{log}</span>
                            ) : log.includes('SUCCESS') || log.includes('COMPLETE') ? (
                              <span className="text-emerald-400 font-medium">{log}</span>
                            ) : log.includes('⚡') ? (
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">{log}</span>
                            ) : (
                              <span className="opacity-80 whitespace-pre-wrap">{log}</span>
                            )}
                          </div>
                        ))}

                        <div className="flex items-center text-slate-300 mt-3 group bg-black/20 p-1.5 rounded-sm border border-white/5 focus-within:border-primary/30 focus-within:bg-black/40 transition-all">
                          <span className="text-primary mx-2 font-bold select-none whitespace-nowrap">dev-ai@oracle:~$</span>
                          <input
                            type="text"
                            value={terminalInput}
                            disabled={executingCommand}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            onKeyDown={handleManualCommand}
                            className={cn("bg-transparent border-none outline-none flex-1 caret-primary text-emerald-300 font-medium placeholder-slate-600", executingCommand && "opacity-50 cursor-not-allowed")}
                            placeholder={executingCommand ? "Executing command sequence..." : "Type a command..."}
                            autoFocus
                          />
                        </div>
                        <div ref={terminalEndRef} />
                      </div>
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
      </div> {/* End Main Content Flex */}

      {/* Footer System Status Bar */}
      <div className="h-6 bg-[#020617] border-t border-white/5 flex items-center justify-between px-3 text-[10px] font-mono tracking-widest uppercase text-slate-500 z-50 select-none shadow-[0_-5px_15px_rgba(0,0,0,0.5)] relative">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-primary hover:text-primary/80 cursor-pointer">
            <ShieldCheck size={12} />
            <span className="font-bold">DEV-AI v2.0</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Workflow size={12} />
            <span>MANDALAS: 5</span>
          </div>
          {activeAgent && (
            <div className="flex items-center gap-1.5 text-accent animate-pulse">
              <Zap size={12} />
              <span>ENGAGED: {activeAgent.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer transition-colors" title="Command Palette (Ctrl+K)" onClick={() => setShowCommandPalette(true)}>
            <Command size={12} />
            <span>CMD</span>
          </div>
          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="flex items-center gap-1 w-16" title="CPU Load">
              <Cpu size={12} className={systemMetrics.cpu > 80 ? "text-red-500" : "text-emerald-500"} />
              <span>{Math.round(systemMetrics.cpu)}%</span>
            </div>
            <div className="flex items-center gap-1 w-16" title="Memory Allocation">
              <Box size={12} className={systemMetrics.ram > 80 ? "text-red-500" : "text-secondary"} />
              <span>{Math.round(systemMetrics.ram)}%</span>
            </div>
            <div className="flex items-center gap-1 w-16" title="Network Latency">
              <Activity size={12} className={systemMetrics.latency > 50 ? "text-amber-500" : "text-emerald-500"} />
              <span>{Math.round(systemMetrics.latency)}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette Overlay */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onRunProject={runProject}
          onInvokeChat={() => {
            setSidebarTab('chat');
            setShowSidebar(true);
          }}
          onSummonAgent={(agent, prompt) => {
            handleSendMessage(null, `[[AGENT:${agent}]] ${prompt}`, false);
            setSidebarTab('chat');
            setShowSidebar(true);
          }}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
      `}</style>
    </div>
  );
}
