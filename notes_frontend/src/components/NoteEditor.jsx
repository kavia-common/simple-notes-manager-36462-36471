import React, { useMemo } from 'react';
import { useNotes } from '../store/NotesContext';

/**
 * PUBLIC_INTERFACE
 * NoteEditor provides inputs for title and content with debounced autosave.
 */
export function NoteEditor() {
  const { selected, updateImmediate, remove, setSelectedId } = useNotes();

  const lastSaved = useMemo(() => {
    if (!selected) return '';
    try {
      return new Date(selected.updatedAt).toLocaleTimeString();
    } catch { return ''; }
  }, [selected]);

  if (!selected) {
    return <div className="empty">Select a note to start editing.</div>;
  }

  return (
    <>
      <div className="editor-toolbar">
        <div className="helper">Last saved: {lastSaved || '—'}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn danger"
            onClick={async () => {
              const id = selected.id;
              await remove(id);
              setSelectedId(null);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="editor-body">
        <input
          className="input"
          placeholder="Title"
          value={selected.title || ''}
          onChange={(e) => updateImmediate(selected.id, { title: e.target.value })}
        />
        <textarea
          className="textarea"
          placeholder="Write your note here..."
          value={selected.content || ''}
          onChange={(e) => updateImmediate(selected.id, { content: e.target.value })}
        />
        <div className="helper">Autosaving with debounce…</div>
      </div>
    </>
  );
}
