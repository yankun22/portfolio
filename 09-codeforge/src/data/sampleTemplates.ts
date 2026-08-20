import type { SandboxTemplate, CdnPackage } from '../types/sandbox';

export const CDN_PACKAGES: CdnPackage[] = [
  {
    id: 'tailwind',
    name: 'Tailwind CSS (Play CDN)',
    category: 'css',
    url: 'https://cdn.tailwindcss.com',
    description: 'Utility-first CSS framework for rapid UI styling.',
    popular: true
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap 5 CSS',
    category: 'css',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    description: 'Component-based CSS library with responsive flex grids.',
    popular: true
  },
  {
    id: 'fontawesome',
    name: 'Font Awesome 6',
    category: 'css',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    description: 'Icon font and CSS toolkit with thousands of vector glyphs.',
    popular: false
  },
  {
    id: 'canvas-confetti',
    name: 'Canvas Confetti',
    category: 'js',
    url: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js',
    description: 'Celebratory particle confetti blast for canvas interactions.',
    popular: true
  },
  {
    id: 'chartjs',
    name: 'Chart.js v4',
    category: 'js',
    url: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js',
    description: 'Flexible HTML5 Canvas data charting library.',
    popular: true
  },
  {
    id: 'threejs',
    name: 'Three.js (r128)',
    category: 'js',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    description: 'WebGL 3D graphics rendering engine.',
    popular: true
  },
  {
    id: 'lodash',
    name: 'Lodash 4',
    category: 'js',
    url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    description: 'Modern utility library delivering modularity and performance.',
    popular: false
  }
];

export const SANDBOX_TEMPLATES: SandboxTemplate[] = [
  {
    id: 'cyberpunk-button',
    title: 'Cyberpunk Neon Glow Button',
    description: 'Interactive button with holographic scanlines, neon hover glow, and audio feedback.',
    category: 'UI Components',
    html: `<div class="container">
  <button id="neonBtn" class="cyber-btn">
    <span class="glitch-text">INITIALIZE SYSTEM</span>
    <span class="tag">R-99</span>
  </button>
  <p id="status" class="status-msg">Awaiting user trigger...</p>
</div>`,
    css: `body {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #fff;
}
.container {
  text-align: center;
}
.cyber-btn {
  position: relative;
  padding: 16px 36px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.08);
  border: 2px solid #06b6d4;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2), inset 0 0 15px rgba(6, 182, 212, 0.1);
}
.cyber-btn:hover {
  background: #06b6d4;
  color: #000;
  box-shadow: 0 0 35px rgba(6, 182, 212, 0.7), inset 0 0 10px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px) scale(1.02);
}
.cyber-btn:active {
  transform: translateY(1px);
}
.tag {
  font-size: 0.65rem;
  position: absolute;
  top: -8px;
  right: 12px;
  background: #f43f5e;
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  font-weight: 700;
}
.status-msg {
  margin-top: 20px;
  font-size: 0.85rem;
  color: #64748b;
  font-family: monospace;
}`,
    js: `const btn = document.getElementById('neonBtn');
const status = document.getElementById('status');
let count = 0;

console.log('⚡ Cyberpunk Playground initialized successfully.');

btn.addEventListener('click', () => {
  count++;
  console.log(\`[EVENT] System triggered #\${count} at \${new Date().toLocaleTimeString()}\`, {
    status: 'ACTIVE',
    pulseRate: (Math.random() * 100).toFixed(2) + ' Hz'
  });
  status.textContent = \`SYSTEM ACTIVATED: Pulse #\${count} confirmed.\`;
  status.style.color = '#10b981';
});`
  },
  {
    id: 'canvas-matrix',
    title: 'Canvas 2D Particle Matrix',
    description: 'Dynamic HTML5 Canvas node network with mouse magnetic attraction and particle collisions.',
    category: 'Canvas 2D/3D',
    html: `<canvas id="canvas"></canvas>
<div class="overlay">
  <h1>Particle Mesh Network</h1>
  <p>Move your mouse across the canvas to interact</p>
</div>`,
    css: `body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0b0f19;
  font-family: sans-serif;
}
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.overlay {
  position: absolute;
  top: 24px;
  left: 24px;
  color: #fff;
  pointer-events: none;
}
.overlay h1 {
  margin: 0;
  font-size: 1.4rem;
  color: #38bdf8;
}
.overlay p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #64748b;
}`,
    js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

const particles = [];
const count = 65;

for (let i = 0; i < count; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    radius: Math.random() * 2 + 1.5
  });
}

let mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.fillStyle = 'rgba(11, 15, 25, 0.25)';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < count; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();

    // Connect neighbours
    for (let j = i + 1; j < count; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = \`rgba(56, 189, 248, \${1 - dist / 120})\`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

console.log(\`✨ Spawned \${count} interactive particles on 2D Canvas.\`);
animate();`
  },
  {
    id: 'interactive-counter',
    title: 'Reactive State Counter & History',
    description: 'Dynamic counter with increment/decrement, step multiplier, and live tabular audit history.',
    category: 'Logic',
    html: `<div class="card">
  <h2>State Counter</h2>
  <div class="display" id="numDisplay">0</div>
  <div class="btn-row">
    <button id="decBtn" class="btn btn-red">-1</button>
    <button id="resetBtn" class="btn btn-gray">Reset</button>
    <button id="incBtn" class="btn btn-green">+1</button>
  </div>
  <div class="log-title">Audit Trail:</div>
  <div id="logBox" class="log-box"></div>
</div>`,
    css: `body {
  margin: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  font-family: system-ui, sans-serif;
  color: #fff;
}
.card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  width: 320px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.display {
  font-size: 3.5rem;
  font-weight: 900;
  color: #38bdf8;
  margin: 10px 0;
  font-family: monospace;
}
.btn-row {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }
.btn-green { background: #10b981; color: #fff; }
.btn-red { background: #f43f5e; color: #fff; }
.btn-gray { background: #475569; color: #fff; }
.log-title {
  margin-top: 18px;
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: left;
}
.log-box {
  margin-top: 6px;
  max-height: 100px;
  overflow-y: auto;
  font-size: 0.75rem;
  font-family: monospace;
  background: #0f172a;
  padding: 8px;
  border-radius: 6px;
  text-align: left;
  color: #cbd5e1;
}`,
    js: `let val = 0;
const numDisplay = document.getElementById('numDisplay');
const logBox = document.getElementById('logBox');

function update(delta, action) {
  if (action === 'reset') val = 0;
  else val += delta;
  
  numDisplay.textContent = val;
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.textContent = \`[\${time}] \${action.toUpperCase()}: \${val}\`;
  logBox.prepend(entry);
  
  console.log(\`Counter state updated: \${val}\`, { action, delta, timestamp: time });
}

document.getElementById('incBtn').onclick = () => update(1, 'increment');
document.getElementById('decBtn').onclick = () => update(-1, 'decrement');
document.getElementById('resetBtn').onclick = () => update(0, 'reset');

console.log('📊 Reactive Counter ready for input.');`
  }
];
