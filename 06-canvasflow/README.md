# CanvasFlow 🎨📐
### Hardware-Accelerated Infinite Diagramming & Vector Flow Studio

**CanvasFlow** is an infinite diagramming and visual collaboration application built with **React 19**, **TypeScript**, **HTML5/SVG Rendering**, **Smart Magnetic Connectors**, and **Pure Vanilla CSS**.

---

## ✨ Key Features

1. **Infinite Pan & Zoom Engine**:
   - Hardware-accelerated viewport matrix transformations (`0.1x` to `5.0x` zoom bounds).
   - Smooth mouse wheel anchor zooming and middle-click / spacebar panning.
   - Interactive Mini-map Radar Viewport in bottom-right corner with draggable viewfinder.

2. **Smart Shapes & Magnetic Connectors**:
   - Shape Library: Rectangles, Diamonds (decisions), Circles, Sticky Notes, Database Cylinders, Text Blocks.
   - 4 Magnetic Anchor Ports (Top, Right, Bottom, Left) on every shape.
   - Dynamic Bézier, Orthogonal, and Straight connector arrows that maintain persistent binding and recalculate during live shape dragging!

3. **Freehand Pen & Highlighter**:
   - Catmull-Rom spline smoothed curve freehand drawing with customizable brush thickness, colors, and pressure multiplier.
   - Semi-transparent highlighter mode.

4. **History Stack & State Engine**:
   - Snapshot-based Undo / Redo engine (`Cmd+Z` / `Ctrl+Z`, `Cmd+Shift+Z` / `Ctrl+Y`).
   - Duplicate (`Ctrl+D`), Delete, Bring to Front, Send to Back, and 8-handle resizing.

5. **Vector & Raster Export Suite**:
   - High-DPI PNG rasterization (1x, 2x, 3x scale).
   - Pure standalone SVG vector export.
   - Full structured JSON diagram backup and restore.

---

## 🚀 Running Locally

```bash
cd 06-canvasflow
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to launch the infinite diagramming studio.
