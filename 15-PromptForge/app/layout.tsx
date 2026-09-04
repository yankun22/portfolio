/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptForge — Enterprise Prompt Arena & LLM Eval IDE',
  description:
    'Split-pane prompt template engineering arena, 5-case automated guardrail evaluation test suite, and semantic token diff & prompt cache cost arbitrage calculator.',
  keywords: [
    'Prompt Engineering',
    'LLM Evaluation',
    'Guardrails',
    'Prompt Caching',
    'Token Arbitrage',
    'Semantic Diff',
    'Next.js 15',
  ],
  authors: [{ name: 'Alok Vishwakarma' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-canvas text-[#F8FAFC] antialiased selection:bg-violet-500/20 selection:text-violet-300">
        {children}
      </body>
    </html>
  );
}
