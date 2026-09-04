/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'EventPulse — Real-Time Event Stream & Schema Evolution Cockpit',
  description:
    'An enterprise-grade event stream cockpit with a 3-stage partitioned Kafka/Redpanda stream canvas, real-time schema evolution compatibility validator, chaos engineering controller, and dynamic DLQ reprocessor.',
  keywords: [
    'EventPulse',
    'Kafka',
    'Redpanda',
    'event streaming',
    'schema evolution',
    'Avro',
    'Next.js 15',
    'Tailwind CSS',
    'TypeScript',
    'Chaos Engineering',
    'Dead Letter Queue',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas text-zinc-100 antialiased selection:bg-ultra selection:text-white overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
