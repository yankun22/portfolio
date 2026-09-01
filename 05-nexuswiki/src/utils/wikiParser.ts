import katex from 'katex';
import type { Note, BacklinkItem } from '../types/wiki';

export interface WikiLinkMatch {
  raw: string;
  target: string;
  alias: string;
  isHeading?: boolean;
  heading?: string;
}

/**
 * Extracts all [[WikiLink]] occurrences from markdown text
 */
export function extractWikiLinks(markdown: string): WikiLinkMatch[] {
  const wikiLinkRegex = /\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
  const matches: WikiLinkMatch[] = [];
  let match: RegExpExecArray | null;

  while ((match = wikiLinkRegex.exec(markdown)) !== null) {
    const raw = match[0];
    const target = match[1].trim();
    const heading = match[2]?.trim();
    const alias = match[3]?.trim() || target;

    matches.push({
      raw,
      target,
      alias,
      isHeading: Boolean(heading),
      heading,
    });
  }

  return matches;
}

/**
 * Extracts tags from frontmatter and inline #hashtags
 */
export function extractTags(markdown: string): string[] {
  const tagSet = new Set<string>();

  // 1. Frontmatter tags
  const fmMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fmContent = fmMatch[1];
    const tagsLine = fmContent.match(/tags:\s*\[?(.*?)\]?(?:\r?\n|$)/i);
    if (tagsLine && tagsLine[1]) {
      tagsLine[1]
        .split(',')
        .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
        .forEach((t) => tagSet.add(t.toLowerCase()));
    }
  }

  // 2. Inline hashtags (#tag-name) - excluding markdown headers like # Header
  const inlineTagRegex = /(?:^|\s)#([a-zA-Z0-9_\-/]+)(?=\s|$)/g;
  let inlineMatch: RegExpExecArray | null;
  while ((inlineMatch = inlineTagRegex.exec(markdown)) !== null) {
    const tag = inlineMatch[1].trim().toLowerCase();
    if (tag && !tag.match(/^\d+$/)) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet);
}

/**
 * Parses YAML frontmatter into a key-value object
 */
export function extractFrontmatter(markdown: string): { frontmatter: Record<string, string>; body: string } {
  const fmMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    return { frontmatter: {}, body: markdown };
  }

  const fmContent = fmMatch[1];
  const body = markdown.slice(fmMatch[0].length).trim();
  const frontmatter: Record<string, string> = {};

  fmContent.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) frontmatter[key] = val;
    }
  });

  return { frontmatter, body };
}

/**
 * Finds explicit backlinks targeting the specified note title
 */
export function findBacklinks(targetTitle: string, allNotes: Note[]): BacklinkItem[] {
  const backlinks: BacklinkItem[] = [];
  const normalizedTarget = targetTitle.toLowerCase();

  allNotes.forEach((sourceNote) => {
    if (sourceNote.title.toLowerCase() === normalizedTarget) return;

    const links = extractWikiLinks(sourceNote.content);
    const hasLink = links.some((l) => l.target.toLowerCase() === normalizedTarget);

    if (hasLink) {
      // Find the snippet line where the link occurs
      const lines = sourceNote.content.split('\n');
      const matchedLineIdx = lines.findIndex((line) =>
        line.toLowerCase().includes(`[[${normalizedTarget}`)
      );
      const snippet = matchedLineIdx >= 0 ? lines[matchedLineIdx].trim() : sourceNote.content.slice(0, 140);

      backlinks.push({
        sourceNoteId: sourceNote.id,
        sourceNoteTitle: sourceNote.title,
        matchedSnippet: snippet,
        isExplicit: true,
        lineIndex: matchedLineIdx >= 0 ? matchedLineIdx : undefined,
      });
    }
  });

  return backlinks;
}

/**
 * Finds plain-text unlinked mentions of a note's title across all other notes
 */
export function findUnlinkedMentions(targetTitle: string, allNotes: Note[]): BacklinkItem[] {
  const mentions: BacklinkItem[] = [];
  if (!targetTitle || targetTitle.trim().length < 3) return mentions;

  const normalizedTarget = targetTitle.toLowerCase();
  // Safe escaped regex for word boundary title
  const escapedTitle = targetTitle.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const titleRegex = new RegExp(`(?<!\\[\\[)\\b${escapedTitle}\\b(?!\\]\\])`, 'gi');

  allNotes.forEach((sourceNote) => {
    if (sourceNote.title.toLowerCase() === normalizedTarget) return;

    const lines = sourceNote.content.split('\n');
    lines.forEach((line, idx) => {
      // Avoid matching frontmatter or lines already having [[Title]]
      if (line.includes(`[[${targetTitle}`) || line.includes('---')) return;

      if (titleRegex.test(line)) {
        mentions.push({
          sourceNoteId: sourceNote.id,
          sourceNoteTitle: sourceNote.title,
          matchedSnippet: line.trim(),
          isExplicit: false,
          lineIndex: idx,
        });
      }
    });
  });

  return mentions;
}

/**
 * Renders full markdown with KaTeX math and interactive [[WikiLinks]] to safe HTML
 */
export function renderMarkdown(markdown: string, existingNoteTitles: Set<string>): string {
  // Strip frontmatter for rendering
  const { body } = extractFrontmatter(markdown);
  let html = body;

  // 1. Math Block: $$...$$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    try {
      return `<div class="katex-display">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch {
      return `<div class="katex-error">$$${math}$$</div>`;
    }
  });

  // 2. Math Inline: $...$
  html = html.replace(/\$([^$\n]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
    } catch {
      return `$${math}$`;
    }
  });

  // 3. Code Blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]+)?\r?\n([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<div class="code-block-container"><div class="code-header"><span class="code-lang">${lang || 'code'}</span><button class="code-copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(code)}'))">Copy</button></div><pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre></div>`;
  });

  // 4. Inline Code: `...`
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // 5. WikiLinks: [[Target|Alias]] and [[Target]]
  html = html.replace(/\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g, (_, targetRaw, heading, aliasRaw) => {
    const target = targetRaw.trim();
    const alias = aliasRaw?.trim() || target;
    const isExisting = Array.from(existingNoteTitles).some((t) => t.toLowerCase() === target.toLowerCase());

    const headingAttr = heading ? ` data-heading="${encodeURIComponent(heading.trim())}"` : '';
    const ghostClass = isExisting ? 'wikilink' : 'wikilink wikilink-ghost';
    const titleAttr = isExisting ? `Open [[${target}]]` : `Create [[${target}]] (ghost note)`;

    return `<span class="${ghostClass}" data-target="${encodeURIComponent(target)}"${headingAttr} title="${titleAttr}"><span class="wikilink-icon">${isExisting ? '📄' : '✨'}</span>${alias}</span>`;
  });

  // 6. Checkboxes: - [ ] and - [x]
  html = html.replace(/^-\s+\[ \]\s+(.*)$/gm, '<div class="task-item"><input type="checkbox" disabled /> <span>$1</span></div>');
  html = html.replace(/^-\s+\[x\]\s+(.*)$/gim, '<div class="task-item task-completed"><input type="checkbox" checked disabled /> <span>$1</span></div>');

  // 7. Headers (#, ##, ###, ####)
  html = html.replace(/^#### (.*$)/gm, '<h4 class="md-h4">$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="md-h1">$1</h1>');

  // 8. Blockquotes: > ...
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote class="md-quote">$1</blockquote>');

  // 9. Hashtags: #tag-name
  html = html.replace(/(^|\s)#([a-zA-Z0-9_\-/]+)(?=\s|$)/g, '$1<span class="tag-pill" data-tag="$2">#$2</span>');

  // 10. Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // 11. Bullet Lists & Numbered Lists
  html = html.replace(/^-\s+(.*)$/gm, '<li class="md-bullet">$1</li>');
  html = html.replace(/^\d+\.\s+(.*)$/gm, '<li class="md-num">$1</li>');

  // 12. Paragraphs & Line Breaks
  const paragraphs = html
    .split(/\n\n+/)
    .map((p) => {
      const trimmed = p.trim();
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<div') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed;
      }
      return `<p class="md-p">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');

  return paragraphs;
}
