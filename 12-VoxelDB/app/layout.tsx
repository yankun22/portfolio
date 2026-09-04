/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'VoxelDB — 3D Vector Space & HNSW Nearest-Neighbor Engine',
  description:
    'A high-performance WebGL 3D vector space visualizer with 1,500+ clustered embeddings, interactive HNSW nearest-neighbor search, dynamic metric switching (Cosine, Euclidean, Manhattan), and quantization memory savings HUD.',
  keywords: [
    'VoxelDB',
    'vector database',
    'HNSW',
    'nearest neighbors',
    'Three.js',
    'React Three Fiber',
    'Next.js 15',
    'Tailwind CSS',
    'embeddings',
    'quantization',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-zinc-100 antialiased selection:bg-neon-cyan selection:text-canvas overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
