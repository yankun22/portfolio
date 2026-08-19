import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Note,
  GraphNode,
  GraphLink,
  BacklinkItem,
  ViewMode,
  GraphPhysicsSettings,
} from '../types/wiki';
import { STARTER_VAULT } from '../data/starterVault';
import { extractWikiLinks, extractTags, findBacklinks, findUnlinkedMentions } from '../utils/wikiParser';
import confetti from 'canvas-confetti';

interface WikiContextType {
  notes: Note[];
  activeNoteId: string | null;
  activeNote: Note | null;
  setActiveNoteId: (id: string | null) => void;
  graphNodes: GraphNode[];
  graphLinks: GraphLink[];
  backlinks: BacklinkItem[];
  unlinkedMentions: BacklinkItem[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  physicsSettings: GraphPhysicsSettings;
  setPhysicsSettings: React.Dispatch<React.SetStateAction<GraphPhysicsSettings>>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isExportOpen: boolean;
  setIsExportOpen: (open: boolean) => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;

  // Note CRUD & Actions
  createNote: (title?: string, content?: string) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  renameNote: (id: string, newTitle: string) => void;
  deleteNote: (id: string) => void;
  openNoteByTitle: (title: string) => void;
  linkUnlinkedMention: (sourceNoteId: string, targetTitle: string) => void;
  importNotes: (imported: Note[], mode?: 'merge' | 'replace') => void;
  resetToStarterVault: () => void;
}

const STORAGE_KEY = 'nexus_wiki_vault_v1';

const DEFAULT_PHYSICS: GraphPhysicsSettings = {
  chargeStrength: -160,
  linkDistance: 90,
  collisionRadius: 28,
  particleFlow: true,
  showOrphans: true,
  colorByTag: true,
  is3dPerspective: false,
};

const WikiContext = createContext<WikiContextType | undefined>(undefined);

export const WikiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return STARTER_VAULT;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    return notes[0]?.id || null;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [physicsSettings, setPhysicsSettings] = useState<GraphPhysicsSettings>(DEFAULT_PHYSICS);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // Global Keyboard listener for Cmd+K / Ctrl+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Derive Backlinks & Unlinked mentions for the active note
  const backlinks = useMemo(() => {
    if (!activeNote) return [];
    return findBacklinks(activeNote.title, notes);
  }, [activeNote, notes]);

  const unlinkedMentions = useMemo(() => {
    if (!activeNote) return [];
    return findUnlinkedMentions(activeNote.title, notes);
  }, [activeNote, notes]);

  // Compute D3 Knowledge Graph Nodes and Links dynamically from vault notes
  const { graphNodes, graphLinks } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const titleToIdMap = new Map<string, string>();

    // Color palette for tags
    const tagColors: Record<string, string> = {
      ai: '#06b6d4',
      'deep-learning': '#3b82f6',
      nlp: '#6366f1',
      math: '#8b5cf6',
      quantum: '#ec4899',
      physics: '#f43f5e',
      systems: '#f59e0b',
      distributed: '#10b981',
      pkm: '#14b8a6',
      productivity: '#84cc16',
      engineering: '#a855f7',
      foundational: '#eab308',
    };

    // 1. Initialize registered notes as nodes
    notes.forEach((note) => {
      const lowerTitle = note.title.toLowerCase();
      titleToIdMap.set(lowerTitle, note.id);
      const tags = note.tags.length > 0 ? note.tags : extractTags(note.content);

      // Determine dominant tag color
      let dominantColor = '#8b5cf6';
      if (tags.length > 0) {
        const matchedTag = tags.find((t) => tagColors[t.toLowerCase()]);
        if (matchedTag) dominantColor = tagColors[matchedTag.toLowerCase()];
      }

      nodeMap.set(note.id, {
        id: note.id,
        title: note.title,
        degree: 0,
        tags,
        radius: 6,
        color: dominantColor,
        isGhost: false,
      });
    });

    // 2. Parse all outgoing links and connect graph edges
    notes.forEach((note) => {
      const outgoing = extractWikiLinks(note.content);

      outgoing.forEach((linkMatch) => {
        const lowerTarget = linkMatch.target.toLowerCase();
        let targetId = titleToIdMap.get(lowerTarget);

        // If target note doesn't exist yet, create ghost node!
        if (!targetId) {
          targetId = `ghost-${lowerTarget}`;
          if (!nodeMap.has(targetId)) {
            nodeMap.set(targetId, {
              id: targetId,
              title: linkMatch.target,
              degree: 0,
              tags: ['ghost'],
              radius: 4,
              color: '#64748b',
              isGhost: true,
            });
            titleToIdMap.set(lowerTarget, targetId);
          }
        }

        if (targetId && targetId !== note.id) {
          links.push({
            source: note.id,
            target: targetId,
            value: 1,
          });

          // Increment degrees
          const srcNode = nodeMap.get(note.id);
          const tgtNode = nodeMap.get(targetId);
          if (srcNode) srcNode.degree += 1;
          if (tgtNode) tgtNode.degree += 1;
        }
      });
    });

    // Compute dynamic radius based on connection density
    const nodes = Array.from(nodeMap.values()).map((node) => {
      const dynamicRadius = Math.min(18, Math.max(5, 5 + Math.sqrt(node.degree) * 3));
      return { ...node, radius: dynamicRadius };
    });

    return { graphNodes: nodes, graphLinks: links };
  }, [notes]);

  const createNote = useCallback((title = 'Untitled Note', content = ''): Note => {
    const nowIso = new Date().toISOString();
    let uniqueTitle = title;
    let counter = 1;
    while (notes.some((n) => n.title.toLowerCase() === uniqueTitle.toLowerCase())) {
      uniqueTitle = `${title} ${counter++}`;
    }

    const defaultContent = content || `# ${uniqueTitle}\n\nStart writing your thoughts, link with \`[[Other Note]]\`, or type equations with \`$E=mc^2$\`.\n`;
    const newNote: Note = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: uniqueTitle,
      content: defaultContent,
      tags: extractTags(defaultContent),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote;
  }, [notes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updatedContent = updates.content !== undefined ? updates.content : n.content;
          const updatedTags = updates.tags !== undefined ? updates.tags : extractTags(updatedContent);
          return {
            ...n,
            ...updates,
            content: updatedContent,
            tags: updatedTags,
            updatedAt: new Date().toISOString(),
          };
        }
        return n;
      })
    );
  }, []);

  const renameNote = useCallback((id: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    setNotes((prev) => {
      const targetNote = prev.find((n) => n.id === id);
      if (!targetNote || targetNote.title === trimmedTitle) return prev;

      const oldTitle = targetNote.title;
      // Refactor all incoming [[Old Title]] to [[New Title]] across vault
      const oldWikiRegex = new RegExp(`\\[\\[${oldTitle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(\\|[^\\]]+)?\\]\\]`, 'g');

      return prev.map((n) => {
        if (n.id === id) {
          // Update header in content if present
          let updatedContent = n.content;
          if (updatedContent.startsWith(`# ${oldTitle}`)) {
            updatedContent = updatedContent.replace(`# ${oldTitle}`, `# ${trimmedTitle}`);
          }
          return {
            ...n,
            title: trimmedTitle,
            content: updatedContent,
            updatedAt: new Date().toISOString(),
          };
        }

        // Refactor links inside other notes
        if (oldWikiRegex.test(n.content)) {
          const refactoredContent = n.content.replace(oldWikiRegex, (_match, aliasGroup) => {
            return aliasGroup ? `[[${trimmedTitle}${aliasGroup}]]` : `[[${trimmedTitle}]]`;
          });
          return {
            ...n,
            content: refactoredContent,
            updatedAt: new Date().toISOString(),
          };
        }

        return n;
      });
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      if (activeNoteId === id) {
        setActiveNoteId(filtered[0]?.id || null);
      }
      return filtered;
    });
  }, [activeNoteId]);

  const openNoteByTitle = useCallback((title: string) => {
    const matched = notes.find((n) => n.title.toLowerCase() === title.toLowerCase());
    if (matched) {
      setActiveNoteId(matched.id);
    } else {
      // Create ghost note into a real note
      const newNote = createNote(title);
      setActiveNoteId(newNote.id);
    }
  }, [notes, createNote]);

  const linkUnlinkedMention = useCallback((sourceNoteId: string, targetTitle: string) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === sourceNoteId) {
          const escaped = targetTitle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`(?<!\\[\\[)\\b(${escaped})\\b(?!\\]\\])`, 'i');
          const replacedContent = n.content.replace(regex, `[[$1]]`);
          return {
            ...n,
            content: replacedContent,
            updatedAt: new Date().toISOString(),
          };
        }
        return n;
      })
    );

    try {
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
    } catch {
      // ignore
    }
  }, []);

  const importNotes = useCallback((imported: Note[], mode: 'merge' | 'replace' = 'merge') => {
    setNotes((prev) => {
      if (mode === 'replace') return imported;
      const existingIds = new Set(prev.map((n) => n.id));
      const newItems = imported.filter((n) => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });

    if (imported.length > 0) {
      setActiveNoteId(imported[0].id);
    }
  }, []);

  const resetToStarterVault = useCallback(() => {
    setNotes(STARTER_VAULT);
    setActiveNoteId(STARTER_VAULT[0].id);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  }, []);

  return (
    <WikiContext.Provider
      value={{
        notes,
        activeNoteId,
        activeNote,
        setActiveNoteId,
        graphNodes,
        graphLinks,
        backlinks,
        unlinkedMentions,
        viewMode,
        setViewMode,
        physicsSettings,
        setPhysicsSettings,
        isSearchOpen,
        setIsSearchOpen,
        isExportOpen,
        setIsExportOpen,
        hoveredNodeId,
        setHoveredNodeId,
        createNote,
        updateNote,
        renameNote,
        deleteNote,
        openNoteByTitle,
        linkUnlinkedMention,
        importNotes,
        resetToStarterVault,
      }}
    >
      {children}
    </WikiContext.Provider>
  );
};

export const useWiki = () => {
  const context = useContext(WikiContext);
  if (!context) {
    throw new Error('useWiki must be used within a WikiProvider');
  }
  return context;
};
