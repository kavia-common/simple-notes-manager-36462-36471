function uid() {
  // simple unique id
  return 'n_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
}

/**
 * LocalNotesProvider persists notes to localStorage.
 */
export class LocalNotesProvider {
  constructor(storageKey = 'notes_v1') {
    this.storageKey = storageKey;
    this.kind = 'local';
    // seed if absent
    if (!this._readRaw()) {
      const seed = [
        {
          id: uid(),
          title: 'Welcome to Notes',
          content: 'This is your Ocean Professional themed notes app. Start typing!',
          pinned: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this._writeRaw(seed);
    }
  }

  _readRaw() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  _writeRaw(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async list() {
    return this._readRaw() || [];
  }

  async create(note) {
    const all = this._readRaw() || [];
    const item = { ...note, id: uid() };
    all.unshift(item);
    this._writeRaw(all);
    return item;
  }

  async update(id, patch) {
    const all = this._readRaw() || [];
    const idx = all.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Note not found');
    const updated = { ...all[idx], ...patch, id, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    this._writeRaw(all);
    return updated;
  }

  async remove(id) {
    const all = this._readRaw() || [];
    const next = all.filter(n => n.id !== id);
    this._writeRaw(next);
    return true;
  }
}
