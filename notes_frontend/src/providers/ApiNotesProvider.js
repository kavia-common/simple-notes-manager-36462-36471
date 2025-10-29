export class ApiNotesProvider {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.kind = 'api';
  }

  async _req(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  // PUBLIC_INTERFACE
  async list() {
    // Placeholder path; to be updated when backend exists
    return this._req('/notes').catch(() => {
      // If API not available, surface empty for now
      return [];
    });
  }

  // PUBLIC_INTERFACE
  async create(note) {
    return this._req('/notes', { method: 'POST', body: JSON.stringify(note) });
  }

  // PUBLIC_INTERFACE
  async update(id, patch) {
    return this._req(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(patch) });
  }

  // PUBLIC_INTERFACE
  async remove(id) {
    await this._req(`/notes/${id}`, { method: 'DELETE' });
    return true;
  }
}
