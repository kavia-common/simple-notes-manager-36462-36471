Notes Frontend Data Provider

- The app auto-detects a backend via REACT_APP_API_BASE or REACT_APP_BACKEND_URL.
- If neither is set, it uses LocalNotesProvider with localStorage key "notes_v1".
- Providers implement: list(), create(note), update(id, patch), remove(id).

Environment variables respected (read-only in client):
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_NEXT_TELEMETRY_DISABLED
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED
