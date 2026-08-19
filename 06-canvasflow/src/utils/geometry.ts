import type { CanvasElement, AnchorPort, Point, ConnectorStyle } from '../types/canvas';

/**
 * Returns the exact canvas coordinate of an anchor port on a shape
 */
export function getAnchorPortCoordinate(element: CanvasElement, port: AnchorPort): Point {
  const { x, y, width, height } = element;

  switch (port) {
    case 'top':
      return { x: x + width / 2, y };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
  }
}

/**
 * Calculates start and end coordinates of a connector, resolving bindings dynamically
 */
export function getConnectorEndpoints(
  connector: CanvasElement,
  elementsMap: Map<string, CanvasElement>
): { start: Point; end: Point; startPort?: AnchorPort; endPort?: AnchorPort } {
  let start: Point = { x: connector.startX ?? connector.x, y: connector.startY ?? connector.y };
  let end: Point = { x: connector.endX ?? connector.x + connector.width, y: connector.endY ?? connector.y + connector.height };
  let startPort: AnchorPort | undefined = connector.startBinding?.port;
  let endPort: AnchorPort | undefined = connector.endBinding?.port;

  if (connector.startBinding) {
    const srcElem = elementsMap.get(connector.startBinding.elementId);
    if (srcElem) {
      start = getAnchorPortCoordinate(srcElem, connector.startBinding.port);
    }
  }

  if (connector.endBinding) {
    const tgtElem = elementsMap.get(connector.endBinding.elementId);
    if (tgtElem) {
      end = getAnchorPortCoordinate(tgtElem, connector.endBinding.port);
    }
  }

  return { start, end, startPort, endPort };
}

/**
 * Generates SVG path string for a connector based on style and port normals
 */
export function generateConnectorPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  style: ConnectorStyle = 'bezier',
  startPort?: AnchorPort,
  endPort?: AnchorPort
): string {
  if (style === 'straight') {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  if (style === 'orthogonal') {
    // Orthogonal right-angle stepped routing
    const dx = endX - startX;
    const dy = endY - startY;

    if (startPort === 'left' || startPort === 'right' || (!startPort && Math.abs(dx) >= Math.abs(dy))) {
      const midX = startX + dx / 2;
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    } else {
      const midY = startY + dy / 2;
      return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    }
  }

  // Smooth Cubic Bézier Curve
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.min(Math.max(dist * 0.4, 30), 160);

  let cpx1 = startX;
  let cpy1 = startY;
  let cpx2 = endX;
  let cpy2 = endY;

  if (startPort === 'right') cpx1 += curvature;
  else if (startPort === 'left') cpx1 -= curvature;
  else if (startPort === 'bottom') cpy1 += curvature;
  else if (startPort === 'top') cpy1 -= curvature;
  else cpx1 += dx * 0.45;

  if (endPort === 'left') cpx2 -= curvature;
  else if (endPort === 'right') cpx2 += curvature;
  else if (endPort === 'top') cpy2 -= curvature;
  else if (endPort === 'bottom') cpy2 += curvature;
  else cpx2 -= dx * 0.45;

  return `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`;
}

/**
 * Converts array of freehand points into a smooth Catmull-Rom / quadratic SVG path
 */
export function getSmoothStrokePath(points: Point[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

/**
 * Finds the closest shape anchor port near coordinate (px, py) within threshold
 */
export function findClosestAnchorPort(
  px: number,
  py: number,
  elements: CanvasElement[],
  excludeElementId?: string,
  threshold = 28
): { element: CanvasElement; port: AnchorPort; point: Point } | null {
  const ports: AnchorPort[] = ['top', 'right', 'bottom', 'left'];
  let closest: { element: CanvasElement; port: AnchorPort; point: Point } | null = null;
  let minDistance = threshold;

  elements.forEach((elem) => {
    if (elem.id === excludeElementId || elem.type === 'connector' || elem.type === 'freedraw') return;

    ports.forEach((port) => {
      const coord = getAnchorPortCoordinate(elem, port);
      const dist = Math.hypot(coord.x - px, coord.y - py);
      if (dist < minDistance) {
        minDistance = dist;
        closest = { element: elem, port, point: coord };
      }
    });
  });

  return closest;
}
