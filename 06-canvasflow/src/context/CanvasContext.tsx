import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type {
  CanvasElement,
  ToolType,
  Viewport,
  ConnectorStyle,
} from '../types/canvas';
import { STARTER_TEMPLATES } from '../data/templates';
import confetti from 'canvas-confetti';

interface CanvasContextType {
  elements: CanvasElement[];
  selectedElementIds: Set<string>;
  selectedElement: CanvasElement | null;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  viewport: Viewport;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  activeFill: string;
  setActiveFill: (fill: string) => void;
  activeStrokeWidth: number;
  setActiveStrokeWidth: (w: number) => void;
  activeStrokeStyle: 'solid' | 'dashed' | 'dotted';
  setActiveStrokeStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  activeConnectorStyle: ConnectorStyle;
  setActiveConnectorStyle: (style: ConnectorStyle) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isTemplateModalOpen: boolean;
  setIsTemplateModalOpen: (open: boolean) => void;
  isPropertiesOpen: boolean;
  setIsPropertiesOpen: (open: boolean) => void;

  // Actions
  selectElement: (id: string | null, multi?: boolean) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>, recordHistory?: boolean) => void;
  updateElementsBatch: (updates: Array<{ id: string; updates: Partial<CanvasElement> }>, recordHistory?: boolean) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  setZoom: (newZoom: number, anchorScreenX?: number, anchorScreenY?: number) => void;
  fitToContent: () => void;
  resetViewport: () => void;
  loadTemplate: (templateId: string) => void;
  clearCanvas: () => void;
  pushHistorySnapshot: (newElements: CanvasElement[]) => void;
}

const STORAGE_KEY = 'canvasflow_diagram_v1';

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Elements State
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e: CanvasElement) => {
            if (e.type === 'sticky') {
              return {
                ...e,
                width: Math.max(e.width || 170, 200),
                height: Math.max(e.height || 120, 125),
                fontColor: e.fontColor === '#422006' ? '#0f172a' : (e.fontColor || '#0f172a'),
              };
            }
            return e;
          });
        }
      }
    } catch {
      // ignore
    }
    return STARTER_TEMPLATES[0].elements;
  });

  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [viewport, setViewport] = useState<Viewport>({ panX: 80, panY: 60, zoom: 1.0 });

  // Style Defaults
  const [activeColor, setActiveColor] = useState<string>('#38bdf8');
  const [activeFill, setActiveFill] = useState<string>('rgba(56, 189, 248, 0.12)');
  const [activeStrokeWidth, setActiveStrokeWidth] = useState<number>(2);
  const [activeStrokeStyle, setActiveStrokeStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [activeConnectorStyle, setActiveConnectorStyle] = useState<ConnectorStyle>('bezier');

  // Modals & Panels
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState<boolean>(true);

  // Undo / Redo History Stacks
  const [historyPast, setHistoryPast] = useState<CanvasElement[][]>([]);
  const [historyFuture, setHistoryFuture] = useState<CanvasElement[][]>([]);
  const isUndoRedoRef = useRef<boolean>(false);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
    } catch {
      // ignore
    }
  }, [elements]);

  const pushHistorySnapshot = useCallback((_newElements: CanvasElement[]) => {
    if (isUndoRedoRef.current) return;
    setHistoryPast((prev) => [...prev.slice(-30), elements]);
    setHistoryFuture([]);
  }, [elements]);

  const undo = useCallback(() => {
    if (historyPast.length === 0) return;
    isUndoRedoRef.current = true;
    const previous = historyPast[historyPast.length - 1];
    setHistoryPast((prev) => prev.slice(0, prev.length - 1));
    setHistoryFuture((prev) => [elements, ...prev]);
    setElements(previous);
    setSelectedElementIds(new Set());
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 10);
  }, [historyPast, elements]);

  const redo = useCallback(() => {
    if (historyFuture.length === 0) return;
    isUndoRedoRef.current = true;
    const next = historyFuture[0];
    setHistoryFuture((prev) => prev.slice(1));
    setHistoryPast((prev) => [...prev, elements]);
    setElements(next);
    setSelectedElementIds(new Set());
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 10);
  }, [historyFuture, elements]);

  // Global Keyboard Shortcuts (Cmd+Z, Cmd+Shift+Z, Delete, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside textarea/input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.size > 0) {
          e.preventDefault();
          pushHistorySnapshot(elements);
          setElements((prev) => prev.filter((elem) => !selectedElementIds.has(elem.id)));
          setSelectedElementIds(new Set());
        }
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('pan');
      } else if (e.key === 'r' || e.key === 'R') {
        setActiveTool('rectangle');
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveTool('circle');
      } else if (e.key === 'd' || e.key === 'D') {
        setActiveTool('diamond');
      } else if (e.key === 'p' || e.key === 'P') {
        setActiveTool('pen');
      } else if (e.key === 't' || e.key === 'T') {
        setActiveTool('text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedElementIds, elements, pushHistorySnapshot]);

  const selectedElement = useMemo(() => {
    if (selectedElementIds.size === 1) {
      const id = Array.from(selectedElementIds)[0];
      return elements.find((e) => e.id === id) || null;
    }
    return null;
  }, [elements, selectedElementIds]);

  const selectElement = useCallback((id: string | null, multi = false) => {
    if (!id) {
      setSelectedElementIds(new Set());
      return;
    }
    setSelectedElementIds((prev) => {
      if (multi) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }
      return new Set([id]);
    });
  }, []);

  const addElement = useCallback((element: CanvasElement) => {
    pushHistorySnapshot(elements);
    setElements((prev) => [...prev, element]);
    setSelectedElementIds(new Set([element.id]));
  }, [elements, pushHistorySnapshot]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>, recordHistory = false) => {
    if (recordHistory) pushHistorySnapshot(elements);
    setElements((prev) =>
      prev.map((elem) => (elem.id === id ? { ...elem, ...updates } : elem))
    );
  }, [elements, pushHistorySnapshot]);

  const updateElementsBatch = useCallback((batch: Array<{ id: string; updates: Partial<CanvasElement> }>, recordHistory = false) => {
    if (recordHistory) pushHistorySnapshot(elements);
    const updatesMap = new Map(batch.map((b) => [b.id, b.updates]));
    setElements((prev) =>
      prev.map((elem) => {
        const u = updatesMap.get(elem.id);
        return u ? { ...elem, ...u } : elem;
      })
    );
  }, [elements, pushHistorySnapshot]);

  const deleteSelected = useCallback(() => {
    if (selectedElementIds.size === 0) return;
    pushHistorySnapshot(elements);
    setElements((prev) => prev.filter((e) => !selectedElementIds.has(e.id)));
    setSelectedElementIds(new Set());
  }, [elements, selectedElementIds, pushHistorySnapshot]);

  const duplicateSelected = useCallback(() => {
    if (selectedElementIds.size === 0) return;
    pushHistorySnapshot(elements);
    const newItems: CanvasElement[] = [];
    const newSelected = new Set<string>();

    elements.forEach((elem) => {
      if (selectedElementIds.has(elem.id)) {
        const cloned: CanvasElement = {
          ...elem,
          id: 'elem-' + Math.random().toString(36).substring(2, 9),
          x: elem.x + 30,
          y: elem.y + 30,
        };
        newItems.push(cloned);
        newSelected.add(cloned.id);
      }
    });

    setElements((prev) => [...prev, ...newItems]);
    setSelectedElementIds(newSelected);
  }, [elements, selectedElementIds, pushHistorySnapshot]);

  const bringToFront = useCallback(() => {
    if (selectedElementIds.size === 0) return;
    pushHistorySnapshot(elements);
    const maxZ = Math.max(...elements.map((e) => e.zIndex || 0), 0) + 1;
    setElements((prev) =>
      prev.map((e) => (selectedElementIds.has(e.id) ? { ...e, zIndex: maxZ } : e))
    );
  }, [elements, selectedElementIds, pushHistorySnapshot]);

  const sendToBack = useCallback(() => {
    if (selectedElementIds.size === 0) return;
    pushHistorySnapshot(elements);
    const minZ = Math.min(...elements.map((e) => e.zIndex || 0), 0) - 1;
    setElements((prev) =>
      prev.map((e) => (selectedElementIds.has(e.id) ? { ...e, zIndex: minZ } : e))
    );
  }, [elements, selectedElementIds, pushHistorySnapshot]);

  const setZoom = useCallback((newZoom: number, anchorScreenX?: number, anchorScreenY?: number) => {
    const clampedZoom = Math.min(5.0, Math.max(0.1, Number(newZoom.toFixed(2))));

    setViewport((prev) => {
      if (anchorScreenX !== undefined && anchorScreenY !== undefined) {
        // Zoom centered around mouse coordinate
        const canvasX = (anchorScreenX - prev.panX) / prev.zoom;
        const canvasY = (anchorScreenY - prev.panY) / prev.zoom;
        return {
          panX: anchorScreenX - canvasX * clampedZoom,
          panY: anchorScreenY - canvasY * clampedZoom,
          zoom: clampedZoom,
        };
      }
      return { ...prev, zoom: clampedZoom };
    });
  }, []);

  const resetViewport = useCallback(() => {
    setViewport({ panX: 80, panY: 60, zoom: 1.0 });
  }, []);

  const fitToContent = useCallback(() => {
    if (elements.length === 0) {
      resetViewport();
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    elements.forEach((e) => {
      minX = Math.min(minX, e.x);
      minY = Math.min(minY, e.y);
      maxX = Math.max(maxX, e.x + (e.width || 100));
      maxY = Math.max(maxY, e.y + (e.height || 100));
    });

    const padding = 100;
    const contentW = maxX - minX + padding * 2;
    const contentH = maxY - minY + padding * 2;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const scaleX = screenW / contentW;
    const scaleY = screenH / contentH;
    const fitZoom = Math.min(2.0, Math.max(0.2, Math.min(scaleX, scaleY) * 0.85));

    const panX = (screenW - contentW * fitZoom) / 2 - (minX - padding) * fitZoom;
    const panY = (screenH - contentH * fitZoom) / 2 - (minY - padding) * fitZoom;

    setViewport({ panX, panY, zoom: fitZoom });
  }, [elements, resetViewport]);

  const loadTemplate = useCallback((templateId: string) => {
    const tmpl = STARTER_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      pushHistorySnapshot(elements);
      setElements(tmpl.elements);
      setSelectedElementIds(new Set());
      fitToContent();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // ignore
      }
    }
  }, [elements, pushHistorySnapshot, fitToContent]);

  const clearCanvas = useCallback(() => {
    if (confirm('Clear entire diagram canvas?')) {
      pushHistorySnapshot(elements);
      setElements([]);
      setSelectedElementIds(new Set());
    }
  }, [elements, pushHistorySnapshot]);

  return (
    <CanvasContext.Provider
      value={{
        elements,
        selectedElementIds,
        selectedElement,
        activeTool,
        setActiveTool,
        viewport,
        setViewport,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
        undo,
        redo,
        activeColor,
        setActiveColor,
        activeFill,
        setActiveFill,
        activeStrokeWidth,
        setActiveStrokeWidth,
        activeStrokeStyle,
        setActiveStrokeStyle,
        activeConnectorStyle,
        setActiveConnectorStyle,
        isExportModalOpen,
        setIsExportModalOpen,
        isTemplateModalOpen,
        setIsTemplateModalOpen,
        isPropertiesOpen,
        setIsPropertiesOpen,
        selectElement,
        addElement,
        updateElement,
        updateElementsBatch,
        deleteSelected,
        duplicateSelected,
        bringToFront,
        sendToBack,
        setZoom,
        fitToContent,
        resetViewport,
        loadTemplate,
        clearCanvas,
        pushHistorySnapshot,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
