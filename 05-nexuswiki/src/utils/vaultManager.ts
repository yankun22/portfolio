import JSZip from 'jszip';
import type { Note } from '../types/wiki';

/**
 * Exports all notes in the vault into a ZIP archive containing individual .md files
 */
export async function exportVaultAsZip(notes: Note[], vaultName = 'nexus-vault'): Promise<void> {
  const zip = new JSZip();

  notes.forEach((note) => {
    // Clean filename from title
    const filename = `${note.title.replace(/[\\/:*?"<>|]/g, '_')}.md`;
    zip.file(filename, note.content);
  });

  // Also include a manifest index
  const manifest = {
    vaultName,
    exportedAt: new Date().toISOString(),
    totalNotes: notes.length,
    notes: notes.map((n) => ({ id: n.id, title: n.title, tags: n.tags, updatedAt: n.updatedAt })),
  };
  zip.file('nexus-manifest.json', JSON.stringify(manifest, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${vaultName}-${new Date().toISOString().split('T')[0]}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports vault as a single structured JSON file
 */
export function exportVaultAsJson(notes: Note[], vaultName = 'nexus-vault'): void {
  const data = {
    version: '1.0',
    vaultName,
    exportedAt: new Date().toISOString(),
    notes,
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${vaultName}-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports a ZIP file containing .md files and returns parsed Note objects
 */
export async function importVaultFromZip(file: File): Promise<Note[]> {
  const zip = await JSZip.loadAsync(file);
  const importedNotes: Note[] = [];
  const nowIso = new Date().toISOString();

  for (const relativePath of Object.keys(zip.files)) {
    const zipEntry = zip.files[relativePath];
    if (zipEntry.dir || !relativePath.endsWith('.md')) continue;

    const content = await zipEntry.async('string');
    const baseName = relativePath.split('/').pop()?.replace(/\.md$/i, '') || 'Untitled';

    // Extract title from first markdown header if available, else basename
    const headerMatch = content.match(/^#\s+(.*)$/m);
    const title = headerMatch ? headerMatch[1].trim() : baseName;

    // Extract tags
    const tagMatch = content.match(/tags:\s*\[?(.*?)\]?(?:\r?\n|$)/i);
    const tags = tagMatch && tagMatch[1]
      ? tagMatch[1].split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
      : [];

    importedNotes.push({
      id: 'note-' + Math.random().toString(36).substring(2, 9),
      title,
      content,
      tags,
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }

  return importedNotes;
}

/**
 * Imports notes from a JSON vault backup file
 */
export async function importVaultFromJson(file: File): Promise<Note[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (Array.isArray(data)) {
    return data;
  }
  if (data.notes && Array.isArray(data.notes)) {
    return data.notes;
  }
  throw new Error('Invalid NexusVault JSON format.');
}
