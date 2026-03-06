import React from 'react';

interface ThreeErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ThreeErrorBoundaryState {
  hasError: boolean;
}

class ThreeErrorBoundary extends React.Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  state: ThreeErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow WebGL renderer failures and let fallback UI render.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ThreeErrorBoundary;
