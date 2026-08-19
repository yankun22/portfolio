import type { CanvasElement } from '../types/canvas';
import { getConnectorEndpoints, generateConnectorPath, getSmoothStrokePath } from './geometry';

/**
 * Generates an SVG string representation of the entire diagram
 */
export function generateSvgString(elements: CanvasElement[], padding = 40): string {
  if (elements.length === 0) return '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"></svg>';

  // Compute bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const elementsMap = new Map(elements.map((e) => [e.id, e]));

  elements.forEach((elem) => {
    if (elem.type === 'connector') {
      const { start, end } = getConnectorEndpoints(elem, elementsMap);
      minX = Math.min(minX, start.x, end.x);
      minY = Math.min(minY, start.y, end.y);
      maxX = Math.max(maxX, start.x, end.x);
      maxY = Math.max(maxY, start.y, end.y);
    } else if (elem.type === 'freedraw' && elem.points && elem.points.length > 0) {
      elem.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });
    } else {
      minX = Math.min(minX, elem.x);
      minY = Math.min(minY, elem.y);
      maxX = Math.max(maxX, elem.x + elem.width);
      maxY = Math.max(maxY, elem.y + elem.height);
    }
  });

  const width = Math.max(maxX - minX + padding * 2, 200);
  const height = Math.max(maxY - minY + padding * 2, 200);
  const offsetX = minX - padding;
  const offsetY = minY - padding;

  let bodySvg = '';

  // Sort elements by zIndex
  const sorted = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  sorted.forEach((elem) => {
    const x = elem.x - offsetX;
    const y = elem.y - offsetY;

    if (elem.type === 'rectangle') {
      bodySvg += `<rect x="${x}" y="${y}" width="${elem.width}" height="${elem.height}" rx="8" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" />`;
      if (elem.text) {
        bodySvg += `<text x="${x + elem.width / 2}" y="${y + elem.height / 2 + 5}" fill="${elem.fontColor || '#ffffff'}" font-size="${elem.fontSize || 14}" font-family="Plus Jakarta Sans, sans-serif" text-anchor="middle">${escapeXml(elem.text)}</text>`;
      }
    } else if (elem.type === 'diamond') {
      const cx = x + elem.width / 2;
      const cy = y + elem.height / 2;
      const points = `${cx},${y} ${x + elem.width},${cy} ${cx},${y + elem.height} ${x},${cy}`;
      bodySvg += `<polygon points="${points}" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" />`;
      if (elem.text) {
        bodySvg += `<text x="${cx}" y="${cy + 5}" fill="${elem.fontColor || '#ffffff'}" font-size="${elem.fontSize || 13}" font-family="Plus Jakarta Sans, sans-serif" text-anchor="middle">${escapeXml(elem.text)}</text>`;
      }
    } else if (elem.type === 'circle') {
      const rx = elem.width / 2;
      const ry = elem.height / 2;
      bodySvg += `<ellipse cx="${x + rx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" />`;
      if (elem.text) {
        bodySvg += `<text x="${x + rx}" y="${y + ry + 5}" fill="${elem.fontColor || '#ffffff'}" font-size="${elem.fontSize || 13}" font-family="Plus Jakarta Sans, sans-serif" text-anchor="middle">${escapeXml(elem.text)}</text>`;
      }
    } else if (elem.type === 'sticky') {
      bodySvg += `<rect x="${x}" y="${y}" width="${elem.width}" height="${elem.height}" rx="4" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.3))" />`;
      if (elem.text) {
        bodySvg += `<text x="${x + 12}" y="${y + 24}" fill="${elem.fontColor || '#0f172a'}" font-size="${elem.fontSize || 12.5}" font-weight="600" font-family="Plus Jakarta Sans, sans-serif">${escapeXml(elem.text, x + 12)}</text>`;
      }
    } else if (elem.type === 'cylinder') {
      const h = elem.height;
      const w = elem.width;
      const ellipseH = 14;
      const pathD = `M ${x} ${y + ellipseH} L ${x} ${y + h - ellipseH} A ${w / 2} ${ellipseH} 0 0 0 ${x + w} ${y + h - ellipseH} L ${x + w} ${y + ellipseH} A ${w / 2} ${ellipseH} 0 0 0 ${x} ${y + ellipseH}`;
      bodySvg += `<path d="${pathD}" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" />`;
      bodySvg += `<ellipse cx="${x + w / 2}" cy="${y + ellipseH}" rx="${w / 2}" ry="${ellipseH}" fill="${elem.fill}" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" />`;
      if (elem.text) {
        bodySvg += `<text x="${x + w / 2}" y="${y + h / 2 + 6}" fill="${elem.fontColor || '#ffffff'}" font-size="${elem.fontSize || 13}" font-family="Plus Jakarta Sans, sans-serif" text-anchor="middle">${escapeXml(elem.text)}</text>`;
      }
    } else if (elem.type === 'text') {
      bodySvg += `<text x="${x}" y="${y + (elem.fontSize || 16)}" fill="${elem.fontColor || '#ffffff'}" font-size="${elem.fontSize || 16}" font-family="Plus Jakarta Sans, sans-serif">${escapeXml(elem.text || '')}</text>`;
    } else if (elem.type === 'connector') {
      const { start, end, startPort, endPort } = getConnectorEndpoints(elem, elementsMap);
      const startAdjX = start.x - offsetX;
      const startAdjY = start.y - offsetY;
      const endAdjX = end.x - offsetX;
      const endAdjY = end.y - offsetY;
      const d = generateConnectorPath(startAdjX, startAdjY, endAdjX, endAdjY, elem.connectorStyle, startPort, endPort);
      const dash = elem.strokeStyle === 'dashed' ? 'stroke-dasharray="6 6"' : elem.strokeStyle === 'dotted' ? 'stroke-dasharray="2 4"' : '';
      bodySvg += `<path d="${d}" fill="none" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" ${dash} />`;
      if (elem.arrowEnd) {
        bodySvg += `<circle cx="${endAdjX}" cy="${endAdjY}" r="4" fill="${elem.stroke}" />`;
      }
    } else if (elem.type === 'freedraw' && elem.points) {
      const shifted = elem.points.map((p) => ({ x: p.x - offsetX, y: p.y - offsetY }));
      const d = getSmoothStrokePath(shifted);
      const opacity = elem.isHighlighter ? 'opacity="0.35"' : '';
      bodySvg += `<path d="${d}" fill="none" stroke="${elem.stroke}" stroke-width="${elem.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${opacity} />`;
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background: #080b12;">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.4"/>
      </filter>
    </defs>
    ${bodySvg}
  </svg>`;
}

function escapeXml(unsafe: string, xCoord?: number): string {
  const xAttr = xCoord !== undefined ? `x="${xCoord}"` : '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\n/g, `<tspan dy="1.3em" ${xAttr}>`);
}

/**
 * Exports diagram as high-resolution PNG image
 */
export async function exportToPng(elements: CanvasElement[], scale = 2): Promise<void> {
  const svgString = generateSvgString(elements);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `canvasflow-diagram-${new Date().toISOString().split('T')[0]}.png`;
      a.click();
    }
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/**
 * Exports diagram as pure SVG vector file
 */
export function exportToSvg(elements: CanvasElement[]): void {
  const svgString = generateSvgString(elements);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `canvasflow-diagram-${new Date().toISOString().split('T')[0]}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports diagram as structured JSON file
 */
export function exportToJson(elements: CanvasElement[], title = 'canvasflow-diagram'): void {
  const data = {
    version: '1.0',
    app: 'CanvasFlow',
    exportedAt: new Date().toISOString(),
    elements,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
