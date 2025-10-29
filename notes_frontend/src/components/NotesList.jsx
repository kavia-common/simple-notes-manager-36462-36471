import React from 'react';
import { useNotes } from '../store/NotesContext';

/**
 * PUBLIC_INTERFACE
 * NotesList renders the searchable note list with pin indicators and selection.
 */
export function NotesList() {
  const { filtered, selectedId, setSelectedId, togglePin, loading } = useNotes();

  if (loading) {
    return <div className="list"><div className="empty">Loading notes…</div></div>;
  }

  if (!filtered.length) {
    return <div className="list"><div className="empty">No notes found. Create your first note!</div></div>;
  }

  return (
    <div className="list">
      {filtered.map(n => (
        <article
          key={n.id}
          className={`note-item ${selectedId === n.id ? 'active' : ''}`}
          onClick={() => setSelectedId(n.id)}
        >
          <div className="title">
            {n.pinned && <span title="Pinned" aria-label="Pinned">📌 </span>}
            {n.title || 'Untitled'}
          </div>
          <div className="meta">
            <span>{new Date(n.updatedAt).toLocaleString()}</span>
            <button
              className="btn secondary"
              onClick={(e) => { e.stopPropagation(); togglePin(n.id); }}
            >
              {n.pinned ? 'Unpin' : 'Pin'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
