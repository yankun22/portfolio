/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LatencyLens — Global Edge Network & Microsecond Waterfall Observability Deck',
  description:
    'Interactive Anycast routing simulator, microsecond-level network waterfall Gantt profiler, and Edge V8 Isolate vs Container performance benchmark.',
  keywords: [
    'Edge Computing',
    'Anycast BGP Routing',
    'V8 Isolates',
    'Network Waterfall',
    'TLS 1.3',
    'Cold Start Benchmark',
    'Next.js 15',
    'Observability',
  ],
  authors: [{ name: 'Alok Vishwakarma' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D1117',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-canvas text-[#F0F6FC] antialiased selection:bg-telemetry-teal/20 selection:text-telemetry-tealNeon">
        {children}
      </body>
    </html>
  );
}
