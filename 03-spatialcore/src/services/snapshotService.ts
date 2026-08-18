import type { ProductConfig } from '../types/product';
import { MATERIAL_TIERS } from './materialLibrary';
import { calculateConfigPrice } from './pricingEngine';

export async function captureStudioSnapshot(
  canvas: HTMLCanvasElement,
  config: ProductConfig,
  productName: string = 'SpatialPulse Apex-01'
): Promise<string> {
  const outputCanvas = document.createElement('canvas');
  const targetWidth = 1920;
  const targetHeight = 1080;
  outputCanvas.width = targetWidth;
  outputCanvas.height = targetHeight;
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  // 1. Dark Studio Gradient Background
  const bgGrad = ctx.createRadialGradient(
    targetWidth / 2,
    targetHeight / 2,
    100,
    targetWidth / 2,
    targetHeight / 2,
    targetWidth / 1.2
  );
  bgGrad.addColorStop(0, '#101624');
  bgGrad.addColorStop(0.6, '#090d15');
  bgGrad.addColorStop(1, '#05070a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 2. Draw 3D Model Viewport centered
  ctx.drawImage(canvas, 160, 60, targetWidth - 320, targetHeight - 200);

  // 3. Top Studio Header Branding
  ctx.fillStyle = '#00f0ff';
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SPATIALCORE', 60, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`• ${productName.toUpperCase()} — CUSTOM SPECIFICATION`, 270, 80);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 16px "JetBrains Mono", monospace';
  ctx.fillText(`STUDIO RENDER 4K • ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 60, 112);

  // 4. Bottom Specs Card
  const priceInfo = calculateConfigPrice(config);

  // Card background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(60, targetHeight - 160, targetWidth - 120, 100, 12);
  ctx.fill();
  ctx.stroke();

  // Price & Tag
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 32px "JetBrains Mono", monospace';
  ctx.fillText(`$${priceInfo.unitPrice.toFixed(2)} USD`, 90, targetHeight - 105);

  ctx.fillStyle = '#10b981';
  ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('BUILD CONFIGURATION CONFIRMED', 90, targetHeight - 80);

  // Material Spec Pills
  let startX = 420;
  (Object.keys(config) as (keyof ProductConfig)[]).forEach((partId) => {
    const part = config[partId];
    const tier = MATERIAL_TIERS[part.material];

    // Swatch dot
    ctx.fillStyle = part.color;
    ctx.beginPath();
    ctx.arc(startX, targetHeight - 110, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(partId.toUpperCase(), startX + 16, targetHeight - 116);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillText(tier.name.split(' ')[0], startX + 16, targetHeight - 100);

    startX += 230;
  });

  return outputCanvas.toDataURL('image/png');
}

export function downloadSnapshotImage(dataUrl: string, filename: string = 'spatialpulse_custom_render.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
