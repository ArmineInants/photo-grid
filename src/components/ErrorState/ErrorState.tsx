import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.error}1A;
  border: 1px solid ${props => props.theme.colors.error}2A;
  border-radius: ${props => props.theme.radius.md};
  color: ${props => props.theme.colors.error};
  text-align: center;
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

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <ErrorContainer>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};
