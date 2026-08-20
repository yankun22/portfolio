import type { ConsoleLogLevel } from '../types/sandbox';

export const CONSOLE_BRIDGE_INJECTION_SCRIPT = `
<script>
(function() {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    table: console.table
  };

  function serializeArg(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'function') return '[Function: ' + (arg.name || 'anonymous') + ']';
    if (typeof arg === 'symbol') return arg.toString();
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return '[Complex Object]';
      }
    }
    return String(arg);
  }

  function intercept(level) {
    return function(...args) {
      originalConsole[level].apply(console, args);
      try {
        const formatted = args.map(serializeArg).join(' ');
        window.parent.postMessage({
          type: 'CODEFORGE_CONSOLE_LOG',
          payload: {
            level: level,
            args: args.map(a => typeof a === 'object' ? JSON.parse(JSON.stringify(a)) : a),
            formattedText: formatted,
            timestamp: new Date().toLocaleTimeString()
          }
        }, '*');
      } catch (e) {}
    };
  }

  console.log = intercept('log');
  console.info = intercept('info');
  console.warn = intercept('warn');
  console.error = intercept('error');
  console.table = intercept('table');

  window.addEventListener('error', function(e) {
    window.parent.postMessage({
      type: 'CODEFORGE_CONSOLE_LOG',
      payload: {
        level: 'error',
        args: [e.message],
        formattedText: 'Uncaught Error: ' + e.message + ' (line ' + e.lineno + ')',
        timestamp: new Date().toLocaleTimeString()
      }
    }, '*');
  });
})();
</script>
`;

export function generateSandboxedHtml(
  html: string,
  css: string,
  js: string,
  cdns: string[] = []
): string {
  const cdnLinks = cdns
    .map((url) => {
      if (url.endsWith('.css') || url.includes('bootstrap') || url.includes('font-awesome')) {
        return `<link rel="stylesheet" href="${url}">`;
      }
      return `<script src="${url}"><` + `/script>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cdnLinks}
  <style>
    ${css}
  </style>
  ${CONSOLE_BRIDGE_INJECTION_SCRIPT}
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch(err) {
      console.error(err.message);
    }
  <` + `/script>
</body>
</html>`;
}

export function formatConsoleLevelColor(level: ConsoleLogLevel): string {
  switch (level) {
    case 'error':
      return '#f43f5e';
    case 'warn':
      return '#f59e0b';
    case 'info':
      return '#38bdf8';
    case 'table':
      return '#10b981';
    case 'log':
    default:
      return '#94a3b8';
  }
}
