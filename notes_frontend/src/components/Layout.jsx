import React from 'react';
import { useNotes } from '../store/NotesContext';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';

/**
 * PUBLIC_INTERFACE
 * Layout composes the app shell with sidebar, header, and main content.
 */
export function Layout() {
  const { create, reload, setQuery, query, notes, providerType } = useNotes();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Sidebar Navigation">
        <div className="brand">
          <div className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">Ocean Notes</div>
            <div className="brand-sub">Modern, fast, minimal</div>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="btn" onClick={create} aria-label="Create new note">+ New Note</button>
          <button className="btn secondary" onClick={reload} aria-label="Reload notes">↻ Refresh</button>
        </div>

        <div className="sidebar-footer">
          Provider: <strong>{providerType}</strong>
          <br />
          Total notes: {notes.length}
        </div>
      </aside>

      <header className="header">
        <div className="searchbar" role="search">
          <span aria-hidden="true">🔎</span>
          <input
            type="search"
            placeholder="Search notes by title or content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search notes"
          />
        </div>
        <div className="header-actions">
          <div className="badge">Ocean Professional</div>
        </div>
      </header>

      <main className="main">
        <section className="panel" aria-label="Notes List">
          <div className="panel-header">
            <div className="panel-title">Notes</div>
          </div>
          <NotesList />
        </section>

        <section className="panel editor" aria-label="Note Editor">
          <NoteEditor />
        </section>
      </main>
    </div>
  );
}
