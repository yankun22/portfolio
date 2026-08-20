import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useCanvas } from '../context/CanvasContext';
import type { CanvasElement, AnchorPort, Point } from '../types/canvas';
import {
  getAnchorPortCoordinate,
  getConnectorEndpoints,
  generateConnectorPath,
  getSmoothStrokePath,
  findClosestAnchorPort,
} from '../utils/geometry';

export const InfiniteCanvas: React.FC = () => {
  const {
    elements,
    selectedElementIds,
    selectElement,
    addElement,
    updateElement,
    updateElementsBatch,
    activeTool,
    setActiveTool,
    viewport,
    setViewport,
    setZoom,
    activeColor,
    activeFill,
    activeStrokeWidth,
    activeStrokeStyle,
    activeConnectorStyle,
    pushHistorySnapshot,
  } = useCanvas();

  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction State
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });

  const [isDraggingElements, setIsDraggingElements] = useState<boolean>(false);
  const [dragStartMouse, setDragStartMouse] = useState<Point>({ x: 0, y: 0 });
  const [initialElemPositions, setInitialElemPositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  const [isDrawingShape, setIsDrawingShape] = useState<boolean>(false);
  const [shapeStart, setShapeStart] = useState<Point>({ x: 0, y: 0 });
  const [tempShape, setTempShape] = useState<CanvasElement | null>(null);

  const [isDrawingPen, setIsDrawingPen] = useState<boolean>(false);
  const [penPoints, setPenPoints] = useState<Point[]>([]);

  const [isDrawingConnector, setIsDrawingConnector] = useState<boolean>(false);
  const [connectorStartPort, setConnectorStartPort] = useState<{ element: CanvasElement; port: AnchorPort; point: Point } | null>(null);
  const [connectorCurrentPos, setConnectorCurrentPos] = useState<Point>({ x: 0, y: 0 });
  const [hoveredAnchor, setHoveredAnchor] = useState<{ element: CanvasElement; port: AnchorPort; point: Point } | null>(null);

  // Resize interaction
  const [isResizing, setIsResizing] = useState<string | null>(null); // 'se', 'nw', etc.
  const [resizeStartElem, setResizeStartElem] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Inline text edit
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingTextVal, setEditingTextVal] = useState<string>('');

  const elementsMap = useMemo(() => new Map(elements.map((e) => [e.id, e])), [elements]);

  // Coordinate Conversion Helpers
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      return {
        x: (screenX - viewport.panX) / viewport.zoom,
        y: (screenY - viewport.panY) / viewport.zoom,
      };
    },
    [viewport]
  );

  // Mouse Wheel: Smooth Zoom centered at cursor, or Space/Shift pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom with wheel
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      setZoom(viewport.zoom * zoomFactor, e.clientX, e.clientY);
    } else {
      // Pan with wheel
      setViewport((prev) => ({
        ...prev,
        panX: prev.panX - e.deltaX * 1.2,
        panY: prev.panY - e.deltaY * 1.2,
      }));
    }
  };

  // Pointer Down Handler
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Ignore clicks on HUD buttons or textareas
    if ((e.target as HTMLElement).closest('.hud-glass') || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    const { clientX, clientY } = e;
    const canvasPt = screenToCanvas(clientX, clientY);

    // 1. Pan Tool / Middle Click
    if (activeTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: clientX - viewport.panX, y: clientY - viewport.panY });
      return;
    }

    // 2. Eraser Tool
    if (activeTool === 'eraser') {
      const hit = elements.find((elem) => {
        return (
          canvasPt.x >= elem.x &&
          canvasPt.x <= elem.x + elem.width &&
          canvasPt.y >= elem.y &&
          canvasPt.y <= elem.y + elem.height
        );
      });
      if (hit) {
        pushHistorySnapshot(elements);
        updateElement(hit.id, { opacity: 0 }); // Mark for deletion
      }
      return;
    }

    // 3. Freehand Pen / Highlighter
    if (activeTool === 'pen' || activeTool === 'highlighter') {
      setIsDrawingPen(true);
      setPenPoints([canvasPt]);
      return;
    }

    // 4. Connector Tool
    if (activeTool === 'connector') {
      const anchor = findClosestAnchorPort(canvasPt.x, canvasPt.y, elements);
      setIsDrawingConnector(true);
      setConnectorStartPort(anchor);
      setConnectorCurrentPos(canvasPt);
      return;
    }

    // 5. Shape Creation Tools
    if (['rectangle', 'diamond', 'circle', 'sticky', 'cylinder', 'text'].includes(activeTool)) {
      setIsDrawingShape(true);
      setShapeStart(canvasPt);

      const defaultW = activeTool === 'sticky' ? 140 : activeTool === 'text' ? 140 : 160;
      const defaultH = activeTool === 'sticky' ? 110 : activeTool === 'text' ? 40 : 80;

      const newElem: CanvasElement = {
        id: 'elem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: activeTool as any,
        x: canvasPt.x,
        y: canvasPt.y,
        width: defaultW,
        height: defaultH,
        fill: activeTool === 'sticky' ? '#fef08a' : activeFill,
        stroke: activeTool === 'sticky' ? '#eab308' : activeColor,
        strokeWidth: activeStrokeWidth,
        strokeStyle: activeStrokeStyle,
        text: activeTool === 'text' ? 'Double click to edit text' : activeTool === 'sticky' ? '📝 Sticky note...' : '',
        fontSize: 14,
        fontColor: activeTool === 'sticky' ? '#422006' : '#f8fafc',
        textAlign: 'center',
        zIndex: elements.length + 1,
      };

      setTempShape(newElem);
      return;
    }

    // 6. Select Mode
    if (activeTool === 'select') {
      // Check if clicking resize handle on selected element
      if ((e.target as HTMLElement).classList.contains('resize-handle')) {
        const handleType = (e.target as HTMLElement).dataset.handle;
        if (handleType && selectedElementIds.size === 1) {
          const selected = elements.find((elem) => selectedElementIds.has(elem.id));
          if (selected) {
            setIsResizing(handleType);
            setResizeStartElem({ x: selected.x, y: selected.y, width: selected.width, height: selected.height });
            setDragStartMouse(canvasPt);
            return;
          }
        }
      }

      // Check if hit element
      const hit = [...elements].reverse().find((elem) => {
        if (elem.type === 'connector' || elem.type === 'freedraw') return false;
        return (
          canvasPt.x >= elem.x &&
          canvasPt.x <= elem.x + elem.width &&
          canvasPt.y >= elem.y &&
          canvasPt.y <= elem.y + elem.height
        );
      });

      if (hit) {
        if (!selectedElementIds.has(hit.id)) {
          selectElement(hit.id, e.shiftKey);
        }
        setIsDraggingElements(true);
        setDragStartMouse(canvasPt);

        const initialMap = new Map<string, { x: number; y: number }>();
        elements.forEach((elem) => {
          if (selectedElementIds.has(elem.id) || elem.id === hit.id) {
            initialMap.set(elem.id, { x: elem.x, y: elem.y });
          }
        });
        setInitialElemPositions(initialMap);
      } else {
        selectElement(null);
        setEditingTextId(null);
      }
    }
  };

  // Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const canvasPt = screenToCanvas(clientX, clientY);

    // 1. Panning
    if (isPanning) {
      setViewport((prev) => ({
        ...prev,
        panX: clientX - panStart.x,
        panY: clientY - panStart.y,
      }));
      return;
    }

    // 2. Drawing Pen
    if (isDrawingPen) {
      setPenPoints((prev) => [...prev, canvasPt]);
      return;
    }

    // 3. Drawing Shape (Drag resize preview)
    if (isDrawingShape && tempShape) {
      const minX = Math.min(shapeStart.x, canvasPt.x);
      const minY = Math.min(shapeStart.y, canvasPt.y);
      const w = Math.max(Math.abs(canvasPt.x - shapeStart.x), 40);
      const h = Math.max(Math.abs(canvasPt.y - shapeStart.y), 30);
      setTempShape({ ...tempShape, x: minX, y: minY, width: w, height: h });
      return;
    }

    // 4. Drawing Connector
    if (isDrawingConnector) {
      setConnectorCurrentPos(canvasPt);
      const anchor = findClosestAnchorPort(canvasPt.x, canvasPt.y, elements, connectorStartPort?.element.id);
      setHoveredAnchor(anchor);
      return;
    }

    // 5. Resizing Element
    if (isResizing && resizeStartElem && selectedElementIds.size === 1) {
      const selectedId = Array.from(selectedElementIds)[0];
      const dx = canvasPt.x - dragStartMouse.x;
      const dy = canvasPt.y - dragStartMouse.y;

      let newW = resizeStartElem.width;
      let newH = resizeStartElem.height;
      let newX = resizeStartElem.x;
      let newY = resizeStartElem.y;

      if (isResizing.includes('e')) newW = Math.max(40, resizeStartElem.width + dx);
      if (isResizing.includes('s')) newH = Math.max(30, resizeStartElem.height + dy);
      if (isResizing.includes('w')) {
        newW = Math.max(40, resizeStartElem.width - dx);
        newX = resizeStartElem.x + dx;
      }
      if (isResizing.includes('n')) {
        newH = Math.max(30, resizeStartElem.height - dy);
        newY = resizeStartElem.y + dy;
      }

      updateElement(selectedId, { x: newX, y: newY, width: newW, height: newH });
      return;
    }

    // 6. Dragging Elements (with Real-Time Bound Connector Updates)
    if (isDraggingElements) {
      const dx = canvasPt.x - dragStartMouse.x;
      const dy = canvasPt.y - dragStartMouse.y;

      const batch: Array<{ id: string; updates: Partial<CanvasElement> }> = [];
      initialElemPositions.forEach((pos, elemId) => {
        batch.push({
          id: elemId,
          updates: {
            x: Math.round(pos.x + dx),
            y: Math.round(pos.y + dy),
          },
        });
      });

      if (batch.length > 0) {
        updateElementsBatch(batch);
      }
      return;
    }

    // Anchor port proximity detection in select/connector mode
    if (activeTool === 'connector' || activeTool === 'select') {
      const anchor = findClosestAnchorPort(canvasPt.x, canvasPt.y, elements);
      setHoveredAnchor(anchor);
    }
  };

  // Pointer Up Handler
  const handlePointerUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isDraggingElements) {
      setIsDraggingElements(false);
      pushHistorySnapshot(elements);
    }

    if (isResizing) {
      setIsResizing(null);
      setResizeStartElem(null);
      pushHistorySnapshot(elements);
    }

    // Finish Freehand Pen Drawing
    if (isDrawingPen && penPoints.length > 0) {
      setIsDrawingPen(false);
      const isHighlighter = activeTool === 'highlighter';
      const newPenElem: CanvasElement = {
        id: 'pen-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        type: 'freedraw',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: activeColor,
        strokeWidth: isHighlighter ? activeStrokeWidth * 3.5 : activeStrokeWidth,
        strokeStyle: 'solid',
        points: penPoints,
        isHighlighter,
        zIndex: elements.length + 1,
      };
      addElement(newPenElem);
      setPenPoints([]);
    }

    // Finish Shape Creation
    if (isDrawingShape && tempShape) {
      setIsDrawingShape(false);
      addElement(tempShape);
      setTempShape(null);
      setActiveTool('select');
    }

    // Finish Connector Creation
    if (isDrawingConnector) {
      setIsDrawingConnector(false);
      const targetAnchor = hoveredAnchor;

      if (connectorStartPort || targetAnchor) {
        const newConn: CanvasElement = {
          id: 'conn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          type: 'connector',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: activeStrokeWidth,
          strokeStyle: activeStrokeStyle,
          connectorStyle: activeConnectorStyle,
          arrowEnd: true,
          startBinding: connectorStartPort ? { elementId: connectorStartPort.element.id, port: connectorStartPort.port } : undefined,
          endBinding: targetAnchor ? { elementId: targetAnchor.element.id, port: targetAnchor.port } : undefined,
          startX: connectorStartPort ? connectorStartPort.point.x : shapeStart.x,
          startY: connectorStartPort ? connectorStartPort.point.y : shapeStart.y,
          endX: targetAnchor ? targetAnchor.point.x : connectorCurrentPos.x,
          endY: targetAnchor ? targetAnchor.point.y : connectorCurrentPos.y,
          zIndex: elements.length + 1,
        };
        addElement(newConn);
      }
      setConnectorStartPort(null);
      setHoveredAnchor(null);
      setActiveTool('select');
    }
  };

  // Double click shape to edit text inline
  const handleDoubleClickShape = (elem: CanvasElement) => {
    setEditingTextId(elem.id);
    setEditingTextVal(elem.text || '');
  };

  const handleSaveText = () => {
    if (editingTextId) {
      updateElement(editingTextId, { text: editingTextVal }, true);
      setEditingTextId(null);
    }
  };

  const renderShapeElement = (elem: CanvasElement) => {
    const isSelected = selectedElementIds.has(elem.id);

    return (
      <g
        key={elem.id}
        transform={`translate(${elem.x}, ${elem.y})`}
        onDoubleClick={() => handleDoubleClickShape(elem)}
        style={{ cursor: activeTool === 'select' ? 'move' : 'default' }}
      >
        {/* Rectangle / Rounded Box */}
        {elem.type === 'rectangle' && (
          <rect
            width={elem.width}
            height={elem.height}
            rx={8}
            fill={elem.fill}
            stroke={isSelected ? '#38bdf8' : elem.stroke}
            strokeWidth={elem.strokeWidth}
            strokeDasharray={elem.strokeStyle === 'dashed' ? '6 6' : elem.strokeStyle === 'dotted' ? '2 4' : 'none'}
            filter={isSelected ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'}
          />
        )}

        {/* Diamond / Decision Shape */}
        {elem.type === 'diamond' && (
          <polygon
            points={`${elem.width / 2},0 ${elem.width},${elem.height / 2} ${elem.width / 2},${elem.height} 0,${elem.height / 2}`}
            fill={elem.fill}
            stroke={isSelected ? '#38bdf8' : elem.stroke}
            strokeWidth={elem.strokeWidth}
            strokeDasharray={elem.strokeStyle === 'dashed' ? '6 6' : elem.strokeStyle === 'dotted' ? '2 4' : 'none'}
            filter={isSelected ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'}
          />
        )}

        {/* Circle / Ellipse */}
        {elem.type === 'circle' && (
          <ellipse
            cx={elem.width / 2}
            cy={elem.height / 2}
            rx={elem.width / 2}
            ry={elem.height / 2}
            fill={elem.fill}
            stroke={isSelected ? '#38bdf8' : elem.stroke}
            strokeWidth={elem.strokeWidth}
            strokeDasharray={elem.strokeStyle === 'dashed' ? '6 6' : elem.strokeStyle === 'dotted' ? '2 4' : 'none'}
            filter={isSelected ? 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'}
          />
        )}

        {/* Sticky Note */}
        {elem.type === 'sticky' && (
          <g filter="drop-shadow(0 8px 20px rgba(0,0,0,0.4))">
            <rect
              width={elem.width}
              height={elem.height}
              rx={4}
              fill={elem.fill || '#fef08a'}
              stroke={isSelected ? '#38bdf8' : elem.stroke || '#eab308'}
              strokeWidth={elem.strokeWidth}
            />
            {/* Top sticky pin strip */}
            <rect
              width={elem.width}
              height={10}
              fill="rgba(0,0,0,0.06)"
              rx={2}
            />
          </g>
        )}

        {/* Database Cylinder */}
        {elem.type === 'cylinder' && (
          <g>
            <path
              d={`M 0 14 L 0 ${elem.height - 14} A ${elem.width / 2} 14 0 0 0 ${elem.width} ${elem.height - 14} L ${elem.width} 14 A ${elem.width / 2} 14 0 0 0 0 14`}
              fill={elem.fill}
              stroke={isSelected ? '#38bdf8' : elem.stroke}
              strokeWidth={elem.strokeWidth}
            />
            <ellipse
              cx={elem.width / 2}
              cy={14}
              rx={elem.width / 2}
              ry={14}
              fill={elem.fill}
              stroke={isSelected ? '#38bdf8' : elem.stroke}
              strokeWidth={elem.strokeWidth}
            />
          </g>
        )}

        {/* Text Block */}
        {elem.type === 'text' && (
          <rect
            width={elem.width}
            height={elem.height}
            fill="transparent"
            stroke={isSelected ? 'rgba(56, 189, 248, 0.5)' : 'transparent'}
            strokeDasharray="3 3"
          />
        )}

        {/* Shape Text Content */}
        {editingTextId === elem.id ? (
          <foreignObject
            x={elem.type === 'sticky' ? 10 : 8}
            y={elem.type === 'sticky' ? 14 : elem.type === 'cylinder' ? 20 : 8}
            width={Math.max(elem.width - (elem.type === 'sticky' ? 20 : 16), 30)}
            height={Math.max(elem.height - (elem.type === 'sticky' ? 20 : elem.type === 'cylinder' ? 28 : 16), 20)}
          >
            <textarea
              autoFocus
              value={editingTextVal}
              onChange={(e) => setEditingTextVal(e.target.value)}
              onBlur={handleSaveText}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveText();
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.65)',
                border: '1.5px solid #38bdf8',
                borderRadius: '4px',
                color: elem.type === 'sticky' ? '#0f172a' : (elem.fontColor || '#ffffff'),
                fontSize: `${elem.fontSize || 13}px`,
                outline: 'none',
                resize: 'none',
                textAlign: elem.textAlign || (elem.type === 'sticky' ? 'left' : 'center'),
                fontFamily: 'var(--font-sans)',
                lineHeight: 1.35,
                padding: '4px',
              }}
            />
          </foreignObject>
        ) : (
          elem.text && (
            <foreignObject
              x={elem.type === 'sticky' ? 10 : 8}
              y={elem.type === 'sticky' ? 14 : elem.type === 'cylinder' ? 20 : 8}
              width={Math.max(elem.width - (elem.type === 'sticky' ? 20 : 16), 30)}
              height={Math.max(elem.height - (elem.type === 'sticky' ? 20 : elem.type === 'cylinder' ? 28 : 16), 20)}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: elem.type === 'sticky' ? 'flex-start' : 'center',
                  justifyContent: elem.type === 'sticky' || elem.textAlign === 'left' ? 'flex-start' : elem.textAlign === 'right' ? 'flex-end' : 'center',
                  textAlign: elem.textAlign || (elem.type === 'sticky' ? 'left' : 'center'),
                  color: elem.type === 'sticky' ? (elem.fontColor || '#0f172a') : (elem.fontColor || '#f8fafc'),
                  fontSize: `${elem.fontSize || 13}px`,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1.35,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  userSelect: 'none',
                  textShadow: elem.type === 'sticky'
                    ? '0 0 1px rgba(0,0,0,0.6), 0 0 0.5px rgba(0,0,0,0.4)'
                    : '0 1px 3px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                  padding: '2px',
                }}
              >
                {elem.text}
              </div>
            </foreignObject>
          )
        )}

        {/* 8 Resize Handles (When Selected) */}
        {isSelected && (
          <g>
            <rect className="resize-handle" data-handle="nw" x={-4} y={-4} width={8} height={8} fill="#38bdf8" />
            <rect className="resize-handle" data-handle="ne" x={elem.width - 4} y={-4} width={8} height={8} fill="#38bdf8" />
            <rect className="resize-handle" data-handle="se" x={elem.width - 4} y={elem.height - 4} width={8} height={8} fill="#38bdf8" />
            <rect className="resize-handle" data-handle="sw" x={-4} y={elem.height - 4} width={8} height={8} fill="#38bdf8" />
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: '100vw',
        height: '100vh',
        background: '#090e17',
        position: 'relative',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : activeTool === 'connector' ? 'crosshair' : 'default',
        touchAction: 'none', // Prevent page scroll while drawing/panning on touch devices
      }}
    >
      {/* Infinite Scaled Dot Matrix Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1.2px, transparent 1.2px)',
          backgroundSize: `${32 * viewport.zoom}px ${32 * viewport.zoom}px`,
          backgroundPosition: `${viewport.panX}px ${viewport.panY}px`,
          pointerEvents: 'none',
        }}
      />

      {/* Scaled Infinite Canvas World */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          transform: `matrix(${viewport.zoom}, 0, 0, ${viewport.zoom}, ${viewport.panX}, ${viewport.panY})`,
          transformOrigin: '0 0',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="glow-connector" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Render Connectors Layer */}
        {elements
          .filter((e) => e.type === 'connector')
          .map((conn) => {
            const { start, end, startPort, endPort } = getConnectorEndpoints(conn, elementsMap);
            const pathD = generateConnectorPath(start.x, start.y, end.x, end.y, conn.connectorStyle, startPort, endPort);
            const isSelected = selectedElementIds.has(conn.id);

            return (
              <g
                key={conn.id}
                onClick={() => selectElement(conn.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Thick invisible hover stroke */}
                <path d={pathD} fill="none" stroke="transparent" strokeWidth={16} />
                {/* Visible stroke */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#38bdf8' : conn.stroke}
                  strokeWidth={isSelected ? conn.strokeWidth + 1.5 : conn.strokeWidth}
                  strokeDasharray={conn.strokeStyle === 'dashed' ? '6 6' : conn.strokeStyle === 'dotted' ? '2 4' : 'none'}
                />
                {/* End Arrow Marker */}
                {conn.arrowEnd && (
                  <circle
                    cx={end.x}
                    cy={end.y}
                    r={4}
                    fill={isSelected ? '#38bdf8' : conn.stroke}
                    stroke="#080b12"
                    strokeWidth={1.5}
                  />
                )}
              </g>
            );
          })}

        {/* 2. Render Freehand Pen Strokes */}
        {elements
          .filter((e) => e.type === 'freedraw' && e.points)
          .map((penElem) => {
            const pathD = getSmoothStrokePath(penElem.points || []);
            return (
              <path
                key={penElem.id}
                d={pathD}
                fill="none"
                stroke={penElem.stroke}
                strokeWidth={penElem.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={penElem.isHighlighter ? 0.35 : 1}
              />
            );
          })}

        {/* 3. Active Freehand Pen In-Progress */}
        {isDrawingPen && penPoints.length > 0 && (
          <path
            d={getSmoothStrokePath(penPoints)}
            fill="none"
            stroke={activeColor}
            strokeWidth={activeTool === 'highlighter' ? activeStrokeWidth * 3.5 : activeStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={activeTool === 'highlighter' ? 0.35 : 1}
          />
        )}

        {/* 4. Active Connector In-Progress */}
        {isDrawingConnector && (
          <g>
            <path
              d={generateConnectorPath(
                connectorStartPort ? connectorStartPort.point.x : shapeStart.x,
                connectorStartPort ? connectorStartPort.point.y : shapeStart.y,
                hoveredAnchor ? hoveredAnchor.point.x : connectorCurrentPos.x,
                hoveredAnchor ? hoveredAnchor.point.y : connectorCurrentPos.y,
                activeConnectorStyle,
                connectorStartPort?.port,
                hoveredAnchor?.port
              )}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2.5}
              strokeDasharray="6 6"
              filter="url(#glow-connector)"
            />
            <circle
              cx={hoveredAnchor ? hoveredAnchor.point.x : connectorCurrentPos.x}
              cy={hoveredAnchor ? hoveredAnchor.point.y : connectorCurrentPos.y}
              r={5}
              fill="#38bdf8"
            />
          </g>
        )}

        {/* 5. Render Shapes */}
        {elements.filter((e) => e.type !== 'connector' && e.type !== 'freedraw').map(renderShapeElement)}

        {/* 6. Active Shape Drag-Creation Preview */}
        {isDrawingShape && tempShape && renderShapeElement(tempShape)}

        {/* 7. Magnetic Anchor Port Circles (When in Connector / Select Mode) */}
        {(activeTool === 'connector' || hoveredAnchor) &&
          elements
            .filter((e) => e.type !== 'connector' && e.type !== 'freedraw')
            .map((elem) => {
              const ports: AnchorPort[] = ['top', 'right', 'bottom', 'left'];
              return (
                <g key={`anchors-${elem.id}`}>
                  {ports.map((p) => {
                    const pt = getAnchorPortCoordinate(elem, p);
                    const isHovered = hoveredAnchor?.element.id === elem.id && hoveredAnchor.port === p;
                    return (
                      <circle
                        key={p}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? '#38bdf8' : '#0284c7'}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        filter={isHovered ? 'url(#glow-connector)' : 'none'}
                      />
                    );
                  })}
                </g>
              );
            })}
      </svg>
    </div>
  );
};
