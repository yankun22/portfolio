/**
 * © 2024-2026 Alok Vishwakarma. All rights reserved.
 * Source code provided for portfolio review and client evaluation.
 */

export function displayProvenanceWatermark(appName: string): void {
  if (typeof window === 'undefined') return;

  const win = window as unknown as { __CONSOLE_GREETING_SHOWN__?: boolean };
  if (win.__CONSOLE_GREETING_SHOWN__) return;
  win.__CONSOLE_GREETING_SHOWN__ = true;

  console.log(
    '%cHey there, curious developer! 👀\n' +
      '%cYou are looking at %c' + appName + '%c, built by %cAlok Vishwakarma%c.\n\n' +
      '%c• Portfolio: %chttps://github.com/yankun22/portfolio\n' +
      '%c• Contact:   %ccontact@alokvishwastudio.in\n\n' +
      '%cNote: This project is part of my personal engineering portfolio. All rights reserved — please do not mirror, re-host, or resell without permission.',
    'color: #14B8A6; font-size: 13px; font-weight: bold; font-family: monospace;',
    'color: #a1a1aa; font-family: monospace; font-size: 11px;',
    'color: #f4f4f5; font-weight: bold; font-family: monospace; font-size: 11px;',
    'color: #a1a1aa; font-family: monospace; font-size: 11px;',
    'color: #14B8A6; font-weight: bold; font-family: monospace; font-size: 11px;',
    'color: #a1a1aa; font-family: monospace; font-size: 11px;',
    'color: #71717a; font-family: monospace; font-size: 11px;',
    'color: #e4e4e7; font-family: monospace; font-size: 11px;',
    'color: #71717a; font-family: monospace; font-size: 11px;',
    'color: #e4e4e7; font-family: monospace; font-size: 11px;',
    'color: #71717a; font-family: monospace; font-size: 10px; font-style: italic;'
  );
}
