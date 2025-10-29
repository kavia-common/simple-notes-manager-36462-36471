import React from 'react';
import './App.css';
import { NotesProvider } from './store/NotesContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';

/**
 * PUBLIC_INTERFACE
 * App is the root component that sets up the NotesProvider (store/context),
 * error boundary, and application layout.
 */
function App() {
  return (
    <ErrorBoundary>
      <NotesProvider>
        <Layout />
      </NotesProvider>
    </ErrorBoundary>
  );
}

export default App;
