export type ElementType =
  | 'rectangle'
  | 'diamond'
  | 'circle'
  | 'sticky'
  | 'cylinder'
  | 'text'
  | 'freedraw'
  | 'connector';

export type AnchorPort = 'top' | 'right' | 'bottom' | 'left';

export type ConnectorStyle = 'bezier' | 'orthogonal' | 'straight';

export type ToolType =
  | 'select'
  | 'pan'
  | 'rectangle'
  | 'diamond'
  | 'circle'
  | 'sticky'
  | 'cylinder'
  | 'text'
  | 'connector'
  | 'pen'
  | 'highlighter'
  | 'eraser';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface ElementBinding {
  elementId: string;
  port: AnchorPort;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number; // degrees

  // Visual appearance
  fill: string; // Hex or rgba
  stroke: string; // Hex or rgba
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  opacity?: number;

  // Text content
  text?: string;
  fontSize?: number;
  fontColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;

  // Freehand path points
  points?: Point[];
  isHighlighter?: boolean;

  // Smart Connectors
  startBinding?: ElementBinding;
  endBinding?: ElementBinding;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  connectorStyle?: ConnectorStyle;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  connectorLabel?: string;

  // Metadata
  zIndex: number;
  locked?: boolean;
}

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number; // 0.1 to 5.0 (10% to 500%)
}

export interface DiagramTemplate {
  id: string;
  title: string;
  description: string;
  thumbnailColor: string;
  elements: CanvasElement[];
}
