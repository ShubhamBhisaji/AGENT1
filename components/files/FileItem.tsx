import React from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, FilePlus, FolderPlus, Trash2 } from 'lucide-react';
import { FileNode } from '../../types';

interface FileItemProps {
  node: FileNode;
  depth?: number;
  expandedFolders: Set<string>;
  creatingNode: { path: string; type: 'file' | 'directory' } | null;
  newNodeName: string;
  setNewNodeName: (name: string) => void;
  setCreatingNode: (node: { path: string; type: 'file' | 'directory' } | null) => void;
  setExpandedFolders: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleFolder: (path: string) => void;
  handleCreateNodeSubmit: (e: React.FormEvent) => void;
  handleDeleteNode: (path: string) => void;
  openFile: (path: string, name: string) => void;
}

export const FileItem = ({
  node,
  depth = 0,
  expandedFolders,
  creatingNode,
  newNodeName,
  setNewNodeName,
  setCreatingNode,
  setExpandedFolders,
  toggleFolder,
  handleCreateNodeSubmit,
  handleDeleteNode,
  openFile
}: FileItemProps) => {
  const isExpanded = expandedFolders.has(node.path);
  const padding = depth * 12 + 12;
  const isRoot = node.path === '.';

  if (node.type === 'directory') {
    return (
      <div className="select-none">
        <div
          className="flex items-center justify-between py-1 hover:bg-white/5 group relative"
          style={{ paddingLeft: `${padding}px`, paddingRight: '8px' }}
        >
          <div
            className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white flex-1 overflow-hidden"
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} className="text-blue-400/80 shrink-0" />
            <span className="text-xs font-medium truncate">{node.name}</span>
          </div>

          {/* Quick Actions (Hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); setCreatingNode({ path: node.path, type: 'file' }); setExpandedFolders(prev => new Set(prev).add(node.path)); }} className="p-0.5 text-slate-500 hover:text-primary transition-colors" title="New File">
              <FilePlus size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setCreatingNode({ path: node.path, type: 'directory' }); setExpandedFolders(prev => new Set(prev).add(node.path)); }} className="p-0.5 text-slate-500 hover:text-secondary transition-colors" title="New Folder">
              <FolderPlus size={12} />
            </button>
            {!isRoot && (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.path); }} className="p-0.5 text-slate-500 hover:text-red-400 transition-colors" title="Delete Folder">
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* New Node Input Field */}
        {creatingNode?.path === node.path && isExpanded && (
          <div className="flex items-center py-1" style={{ paddingLeft: `${padding + 20}px`, paddingRight: '8px' }}>
            {creatingNode.type === 'directory' ? <Folder size={14} className="text-blue-400/80 shrink-0 mr-1.5" /> : <FileText size={14} className="text-slate-500 shrink-0 mr-1.5" />}
            <form onSubmit={handleCreateNodeSubmit} className="flex-1">
              <input
                autoFocus
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                onBlur={() => setCreatingNode(null)}
                onKeyDown={(e) => { if(e.key === 'Escape') setCreatingNode(null); }}
                className="w-full bg-[#0f172a] border border-primary/50 text-xs text-white px-1.5 py-0.5 rounded outline-none focus:ring-1 focus:ring-primary shadow-[0_0_5px_rgba(99,102,241,0.5)]"
              />
            </form>
          </div>
        )}

        {isExpanded && node.children?.map(child => (
          <FileItem
            key={child.path}
            node={child}
            depth={depth + 1}
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
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between py-1 hover:bg-white/5 group"
      style={{ paddingLeft: `${padding + 20}px`, paddingRight: '8px' }}
    >
      <div
        className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-white flex-1 overflow-hidden"
        onClick={() => openFile(node.path, node.name)}
      >
        <FileText size={14} className="text-slate-500 shrink-0" />
        <span className="text-xs font-medium truncate">{node.name}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.path); }} className="p-0.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete File">
        <Trash2 size={12} />
      </button>
    </div>
  );
};
