import type {
  RegexMatchResult,
  CaptureGroupMatch,
  RegexTokenExplanation,
  RailroadNode
} from '../types/regex';

export const GROUP_COLORS = [
  '#06b6d4', // Cyan (Group 1)
  '#10b981', // Emerald (Group 2)
  '#f59e0b', // Amber (Group 3)
  '#8b5cf6', // Purple (Group 4)
  '#ec4899', // Pink (Group 5)
  '#3b82f6', // Blue (Group 6)
  '#14b8a6', // Teal (Group 7)
  '#f97316'  // Orange (Group 8)
];

export function executeRegex(
  pattern: string,
  flags: string,
  testText: string
): { matches: RegexMatchResult[]; error: string | null } {
  if (!pattern) return { matches: [], error: null };

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatchResult[] = [];

    if (!flags.includes('g')) {
      const match = regex.exec(testText);
      if (match && match.index !== undefined) {
        const groups: CaptureGroupMatch[] = [];
        for (let i = 1; i < match.length; i++) {
          const val = match[i];
          if (val !== undefined) {
            // Find start offset of this group inside full match
            const offset = match[0].indexOf(val);
            const start = match.index + (offset >= 0 ? offset : 0);
            groups.push({
              groupIndex: i,
              value: val,
              start,
              end: start + val.length,
              color: GROUP_COLORS[(i - 1) % GROUP_COLORS.length]
            });
          }
        }

        matches.push({
          fullMatch: match[0],
          index: match.index,
          length: match[0].length,
          groups
        });
      }
    } else {
      let match: RegExpExecArray | null;
      let lastIdx = -1;
      let loopCount = 0;

      while ((match = regex.exec(testText)) !== null && loopCount < 500) {
        loopCount++;
        if (regex.lastIndex === lastIdx) {
          regex.lastIndex++; // Avoid infinite zero-width match loop
        }
        lastIdx = regex.lastIndex;

        const groups: CaptureGroupMatch[] = [];
        for (let i = 1; i < match.length; i++) {
          const val = match[i];
          if (val !== undefined) {
            const offset = match[0].indexOf(val);
            const start = match.index + (offset >= 0 ? offset : 0);
            groups.push({
              groupIndex: i,
              value: val,
              start,
              end: start + val.length,
              color: GROUP_COLORS[(i - 1) % GROUP_COLORS.length]
            });
          }
        }

        matches.push({
          fullMatch: match[0],
          index: match.index,
          length: match[0].length,
          groups
        });

        if (!regex.global) break;
      }
    }

    return { matches, error: null };
  } catch (err: unknown) {
    return { matches: [], error: (err as Error).message || 'Invalid regular expression.' };
  }
}

/**
 * Generates an AST representation of the regular expression for SVG Railroad diagramming
 */
export function buildRailroadAST(pattern: string): RailroadNode {
  if (!pattern) {
    return { type: 'root', label: 'Empty Pattern', children: [] };
  }

  const nodes: RailroadNode[] = [];
  let i = 0;
  let groupCounter = 1;

  while (i < pattern.length) {
    const char = pattern[i];

    if (char === '^') {
      nodes.push({ type: 'anchor', label: 'Start of line (^)' });
      i++;
    } else if (char === '$') {
      nodes.push({ type: 'anchor', label: 'End of line ($)' });
      i++;
    } else if (char === '\\') {
      // Escaped character or special class
      i++;
      const nextChar = pattern[i] || '';
      let label = `\\${nextChar}`;
      let subLabel = 'Literal';

      if (nextChar === 'd') { label = 'Digit [0-9]'; subLabel = '\\d'; }
      else if (nextChar === 'D') { label = 'Non-digit [^0-9]'; subLabel = '\\D'; }
      else if (nextChar === 'w') { label = 'Word char [a-zA-Z0-9_]'; subLabel = '\\w'; }
      else if (nextChar === 'W') { label = 'Non-word char'; subLabel = '\\W'; }
      else if (nextChar === 's') { label = 'Whitespace [ \\t\\r\\n]'; subLabel = '\\s'; }
      else if (nextChar === 'S') { label = 'Non-whitespace'; subLabel = '\\S'; }
      else if (nextChar === 'b') { label = 'Word boundary'; subLabel = '\\b'; }

      i++;
      const quant = parseQuantifier(pattern, i);
      i = quant.nextIndex;

      nodes.push({
        type: 'literal',
        label,
        subLabel,
        quantifier: quant.quantifier
      });
    } else if (char === '[') {
      // Character Set
      const closeIdx = findClosingBracket(pattern, i, '[', ']');
      const setContent = pattern.slice(i + 1, closeIdx);
      const isNegated = setContent.startsWith('^');
      const cleanContent = isNegated ? setContent.slice(1) : setContent;

      i = closeIdx + 1;
      const quant = parseQuantifier(pattern, i);
      i = quant.nextIndex;

      nodes.push({
        type: 'range',
        label: isNegated ? `None of: [^${cleanContent}]` : `One of: [${cleanContent}]`,
        subLabel: cleanContent,
        quantifier: quant.quantifier
      });
    } else if (char === '(') {
      // Group
      const closeIdx = findClosingParen(pattern, i);
      const groupContent = pattern.slice(i + 1, closeIdx);
      const isNonCapturing = groupContent.startsWith('?:');
      const innerPattern = isNonCapturing ? groupContent.slice(2) : groupContent;
      const currentGroupNum = isNonCapturing ? undefined : groupCounter++;

      const childAst = buildRailroadAST(innerPattern);

      i = closeIdx + 1;
      const quant = parseQuantifier(pattern, i);
      i = quant.nextIndex;

      nodes.push({
        type: 'group',
        label: isNonCapturing ? 'Non-capturing Group' : `Group #${currentGroupNum}`,
        groupNumber: currentGroupNum,
        isCapturing: !isNonCapturing,
        children: childAst.children || [childAst],
        quantifier: quant.quantifier
      });
    } else if (char === '.') {
      i++;
      const quant = parseQuantifier(pattern, i);
      i = quant.nextIndex;

      nodes.push({
        type: 'literal',
        label: 'Any character (.)',
        subLabel: 'except newline',
        quantifier: quant.quantifier
      });
    } else {
      // Literal character(s)
      let literalStr = char;
      i++;
      while (
        i < pattern.length &&
        !['^', '$', '\\', '[', ']', '(', ')', '{', '}', '+', '*', '?', '|', '.'].includes(pattern[i])
      ) {
        literalStr += pattern[i];
        i++;
      }

      const quant = parseQuantifier(pattern, i);
      i = quant.nextIndex;

      nodes.push({
        type: 'literal',
        label: `"${literalStr}"`,
        subLabel: 'Literal text',
        quantifier: quant.quantifier
      });
    }
  }

  return {
    type: 'root',
    label: 'Expression',
    children: nodes
  };
}

function parseQuantifier(
  pattern: string,
  startIndex: number
): { quantifier?: { min: number; max?: number; greedy: boolean; text: string }; nextIndex: number } {
  if (startIndex >= pattern.length) return { nextIndex: startIndex };

  const char = pattern[startIndex];
  let quantText = '';
  let min = 1;
  let max: number | undefined = 1;
  let len = 0;

  if (char === '+') {
    quantText = '1 or more times (+)';
    min = 1;
    max = undefined;
    len = 1;
  } else if (char === '*') {
    quantText = '0 or more times (*)';
    min = 0;
    max = undefined;
    len = 1;
  } else if (char === '?') {
    quantText = 'Optional (0 or 1 time) (?)';
    min = 0;
    max = 1;
    len = 1;
  } else if (char === '{') {
    const end = pattern.indexOf('}', startIndex);
    if (end > startIndex) {
      const range = pattern.slice(startIndex + 1, end);
      quantText = `{${range}} times`;
      const parts = range.split(',').map((p) => p.trim());
      min = parseInt(parts[0], 10) || 0;
      max = parts.length > 1 ? (parts[1] ? parseInt(parts[1], 10) : undefined) : min;
      len = end - startIndex + 1;
    }
  }

  if (len > 0) {
    const nextChar = pattern[startIndex + len];
    const isLazy = nextChar === '?';
    return {
      quantifier: {
        min,
        max,
        greedy: !isLazy,
        text: isLazy ? `${quantText} (lazy)` : quantText
      },
      nextIndex: startIndex + len + (isLazy ? 1 : 0)
    };
  }

  return { nextIndex: startIndex };
}

function findClosingBracket(str: string, openPos: number, openChar: string, closeChar: string): number {
  let depth = 1;
  for (let i = openPos + 1; i < str.length; i++) {
    if (str[i] === '\\') {
      i++;
      continue;
    }
    if (str[i] === openChar) depth++;
    else if (str[i] === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return str.length - 1;
}

function findClosingParen(str: string, openPos: number): number {
  return findClosingBracket(str, openPos, '(', ')');
}

/**
 * Generates human-readable breakdown of regex tokens
 */
export function explainRegex(pattern: string): RegexTokenExplanation[] {
  const explanations: RegexTokenExplanation[] = [];
  if (!pattern) return explanations;

  const ast = buildRailroadAST(pattern);

  function walk(node: RailroadNode) {
    if (node.type !== 'root') {
      let desc = node.label;
      if (node.subLabel && node.subLabel !== 'Literal text') {
        desc += ` (${node.subLabel})`;
      }
      if (node.quantifier) {
        desc += ` — Quantifier: ${node.quantifier.text}`;
      }

      explanations.push({
        token: node.label,
        description: desc,
        category:
          node.type === 'range'
            ? 'character_class'
            : node.type === 'group'
            ? 'group'
            : node.type === 'anchor'
            ? 'anchor'
            : 'literal'
      });
    }

    if (node.children) {
      node.children.forEach(walk);
    }
  }

  walk(ast);
  return explanations;
}
