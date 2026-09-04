/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#08090C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'AgentMesh — Autonomous Multi-Agent Consensus & Topology Simulator',
  description:
    'Ultra-premium Next.js 15 application visualizing dynamic agent topology, directional particle beams, deterministic Byzantine quorum consensus loops, and deep vector context inspection across 5 autonomous agent archetypes.',
  keywords: [
    'AgentMesh',
    'autonomous agents',
    'multi-agent consensus',
    'Byzantine fault tolerance',
    'Next.js 15',
    'Tailwind CSS',
    'Zustand',
    'Vector Context Buffer',
    'TypeScript',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-zinc-100 antialiased selection:bg-mint selection:text-canvas overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
