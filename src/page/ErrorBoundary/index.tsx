import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    localStorage.setItem('error', JSON.stringify({ error: error.toString(), errorInfo }));
    // send error to server
  }

  render() {
    if (this.state.hasError) {
      window.location.pathname = '/error';
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
