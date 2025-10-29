import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary catches rendering errors and displays a friendly message.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: '#6b7280' }}>{String(this.state.error)}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
