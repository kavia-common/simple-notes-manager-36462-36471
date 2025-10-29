import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LocalNotesProvider } from '../providers/LocalNotesProvider';
import { ApiNotesProvider } from '../providers/ApiNotesProvider';
import { useDebouncedCallback } from '../utils/useDebouncedCallback';

const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useNotes exposes the notes store (state + actions) to components.
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}

// Detect backend availability from env
function getApiBase() {
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  return (base || '').trim();
}

/**
 * PUBLIC_INTERFACE
 * NotesProvider auto-selects an API provider if available; otherwise falls back to localStorage.
 * It exposes CRUD operations, selection handling, and search filtering.
 */
export function NotesProvider({ children }) {
  const apiBase = getApiBase();
  const provider = useMemo(() => {
    if (apiBase) {
      return new ApiNotesProvider(apiBase);
    }
    return new LocalNotesProvider('notes_v1');
  }, [apiBase]);

  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await provider.list();
      setNotes(all);
      if (all.length && !selectedId) setSelectedId(all[0].id);
      setError(null);
    } catch (e) {
      setError(e?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [provider, selectedId]);

  useEffect(() => { load(); }, [load]);

  const debouncedSave = useDebouncedCallback(async (note) => {
    try {
      const updated = await provider.update(note.id, note);
      setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
    } catch (e) {
      setError(e?.message || 'Failed to save note');
    }
  }, 500);

  const create = useCallback(async () => {
    const payload = {
      title: 'Untitled',
      content: '',
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const created = await provider.create(payload);
    setNotes(prev => [created, ...prev]);
    setSelectedId(created.id);
    return created;
  }, [provider]);

  const remove = useCallback(async (id) => {
    await provider.remove(id);
    setNotes(prev => prev.filter(n => n.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  }, [provider]);

  const updateImmediate = useCallback(async (id, patch, debounce = true) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)));
    const note = { ...(notes.find(n => n.id === id) || {}), ...patch, id };
    if (debounce) debouncedSave(note);
    else {
      try {
        const saved = await provider.update(id, note);
        setNotes(prev => prev.map(n => (n.id === id ? saved : n)));
      } catch (e) {
        setError(e?.message || 'Failed to update note');
      }
    }
  }, [notes, debouncedSave, provider]);

  const togglePin = useCallback((id) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    updateImmediate(id, { pinned: !note.pinned });
  }, [notes, updateImmediate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    if (!q) return sorted;
    return sorted.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    );
  }, [notes, query]);

  const selected = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const value = {
    // state
    notes,
    filtered,
    selected,
    selectedId,
    loading,
    error,
    query,
    // actions
    setQuery,
    setSelectedId,
    create,
    remove,
    updateImmediate,
    togglePin,
    reload: load,
    // meta
    providerType: provider.kind,
    apiBase,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
