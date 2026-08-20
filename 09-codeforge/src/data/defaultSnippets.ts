import type { CodeSnippet } from '../types/snippet';

export const DEFAULT_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-debounce',
    title: 'TypeScript Generic Debounce Utility',
    description: 'Zero-dependency type-safe debounce wrapper with trailing and leading edge triggers.',
    language: 'javascript',
    code: `export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timerId !== null) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, delayMs);
  };
}`,
    tags: ['utility', 'typescript', 'performance'],
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
    favorite: true
  },
  {
    id: 'snip-sql-window',
    title: 'SQLite Window Function: Running Total & Rank',
    description: 'Demonstrates SUM() OVER() window partition and DENSE_RANK() ordering in SQLite.',
    language: 'sql',
    code: `SELECT 
  order_date,
  total_amount,
  SUM(total_amount) OVER (
    ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_revenue,
  DENSE_RANK() OVER (
    ORDER BY total_amount DESC
  ) AS revenue_rank
FROM orders;`,
    tags: ['sqlite', 'window-functions', 'analytics'],
    createdAt: '2026-03-12',
    updatedAt: '2026-03-12',
    favorite: true
  },
  {
    id: 'snip-regex-jwt',
    title: 'JWT (JSON Web Token) Regex Matcher',
    description: 'Extracts the three Base64URL-encoded parts of a JWT: Header, Payload, and Signature.',
    language: 'regex',
    code: `^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$`,
    tags: ['security', 'jwt', 'auth'],
    createdAt: '2026-03-14',
    updatedAt: '2026-03-14'
  }
];
