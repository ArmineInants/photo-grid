import React, { Component, type ErrorInfo } from 'react';
import styled from 'styled-components';

const ErrorBoundaryContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.error}1A;
  border: 1px solid ${props => props.theme.colors.error}2A;
  border-radius: ${props => props.theme.radius.md};
  color: ${props => props.theme.colors.error};
`;

const RetryButton = styled.button`
  margin-top: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorBoundaryContainer>
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <RetryButton onClick={this.handleReset}>
            Try Again
          </RetryButton>
        </ErrorBoundaryContainer>
      );
    }

    return this.props.children;
  }
}