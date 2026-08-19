# NexusWiki 🧠🕸️
### Interconnected Bi-Directional Note-Taking & D3.js Force-Directed Knowledge Graph

**NexusWiki** is a personal knowledge management (PKM) application inspired by Obsidian and Roam Research. It features bi-directional `[[WikiLinks]]`, inline LaTeX math rendering, interactive force-directed graph clustering, contextual backlinks, unlinked mention resolution, full-text fuzzy search, and lossless ZIP/JSON vault portability.

---

## ✨ Core Features

1. **Bi-Directional `[[WikiLink]]` Parser & Live Markdown Editor**:
   - `[[Note Title]]` and `[[Note Title|Custom Alias]]` live autocomplete dropdown.
   - Inline and block LaTeX math rendering via KaTeX (`$E=mc^2$`, `$$\int e^x dx$$`).
   - Interactive task checklists (`- [ ]`, `- [x]`) that sync with raw markdown.
   - Code block syntax highlighting with copy action.

2. **Interactive D3.js Force-Directed Knowledge Graph**:
   - Physics simulation (`d3-force`) modeling Coulomb repulsion, Hooke spring attraction, collision padding, and gravitational centering.
   - 2D and 3D spatial perspective view modes.
   - Dynamic node scaling by connection degree (hub notes).
   - Hover highlighting: 1st and 2nd degree connected cluster isolation with dimmed background.
   - Click node to navigate to note.

3. **Backlinks & Unlinked Mentions Panel**:
   - **Linked Mentions**: Chronological list of notes referencing the active note with excerpt context.
   - **Unlinked Mentions**: Auto-detects plain text instances of the active note title with a 1-click **"Link to Note"** button.
   - Outgoing references list indicating ghost notes (uncreated targets).

4. **Full-Text Fuzzy Search Modal (`Ctrl+P` / `Cmd+K`)**:
   - Global indexing of note titles, body content, YAML tags, and headers.
   - Keyboard navigation (`↑`/`↓`/`Enter`/`Esc`).

5. **Zero-Lockin Vault Portability**:
   - Export entire vault as a `.zip` archive containing individual `.md` markdown files.
   - Export structured JSON backup preserving graph state and timestamps.
   - Import `.zip` / `.json` archives.

---

## 🚀 Running Locally

```bash
cd 05-nexuswiki
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) to explore your personal knowledge graph.
