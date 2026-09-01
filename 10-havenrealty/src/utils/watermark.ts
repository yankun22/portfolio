/**
 * PROPRIETARY & CONFIDENTIAL
 * Copyright (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 *
 * This source code and architectural implementation are provided strictly for
 * portfolio demonstration, client evaluation, and technical review.
 * Unauthorized copying, public mirroring, scraping, or commercial use is prohibited.
 */

export function displayProvenanceWatermark(appName: string): void {
  if (typeof window === 'undefined') return;

  const win = window as unknown as { __PROVENANCE_WATERMARK_SHOWN__?: boolean };
  if (win.__PROVENANCE_WATERMARK_SHOWN__) return;
  win.__PROVENANCE_WATERMARK_SHOWN__ = true;

  const titleStyle =
    'color: #d4af37; font-size: 13px; font-weight: 800; font-family: monospace; letter-spacing: 1px;';
  const labelStyle =
    'color: #71717a; font-size: 11px; font-family: monospace;';
  const valStyle =
    'color: #e4e4e7; font-size: 11px; font-weight: 600; font-family: monospace;';
  const badgeStyle =
    'background: #18181b; color: #fbbf24; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-family: monospace; font-weight: 700; border: 1px solid #27272a;';
  const alertStyle =
    'color: #f87171; font-size: 10px; font-family: monospace; font-weight: 700;';

  console.log(
    `\n%c✦ ${appName.toUpperCase()}\n` +
      `%cPrincipal Architect : %cAlok Vishwakarma\n` +
      `%cPortfolio Hub       : %chttps://github.com/yankun22/portfolio\n` +
      `%cLicense             : %cProprietary Showcase Only (All Rights Reserved)\n` +
      `%cDirect Inquiry      : %ccontact@alokvishwastudio.in\n\n` +
      `%c🛡️ INTELLECTUAL PROPERTY NOTICE: This application is protected proprietary\n` +
      `architecture. Commercial deployment, reproduction, or scraping is prohibited.\n`,
    titleStyle,
    labelStyle,
    valStyle,
    labelStyle,
    valStyle,
    labelStyle,
    badgeStyle,
    labelStyle,
    valStyle,
    alertStyle
  );
}
