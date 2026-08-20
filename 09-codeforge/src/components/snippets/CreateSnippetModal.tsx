import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { CodeSnippet, SnippetLanguage } from '../../types/snippet';
import { Plus } from 'lucide-react';

interface CreateSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSnippet: (snippet: CodeSnippet) => void;
}

export const CreateSnippetModal: React.FC<CreateSnippetModalProps> = ({
  isOpen,
  onClose,
  onSaveSnippet
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<SnippetLanguage>('javascript');
  const [code, setCode] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const now = new Date().toISOString().split('T')[0];

    const newSnippet: CodeSnippet = {
      id: `snip-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      language,
      code: code.trim(),
      tags: tags.length > 0 ? tags : ['code'],
      createdAt: now,
      updatedAt: now
    };

    onSaveSnippet(newSnippet);
    setTitle('');
    setDescription('');
    setCode('');
    setTagsStr('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Code Snippet to Vault" maxWidth="560px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Snippet Title</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Async Fetch with Retry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SnippetLanguage)}
            >
              <option value="javascript">JavaScript / TS</option>
              <option value="html">HTML5</option>
              <option value="css">CSS3</option>
              <option value="sql">SQL / SQLite</option>
              <option value="regex">Regular Expression</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Exponential backoff retry handler"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Code / Query / Pattern</label>
          <textarea
            className="form-textarea"
            rows={7}
            required
            placeholder="Paste snippet code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags (Comma-separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. async, network, utility"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Plus size={14} />
            <span>Save to Vault</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
