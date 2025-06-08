import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.lg};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.radius.md};
  margin: ${(props) => props.theme.spacing.md};
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(
    90deg,
    ${(props) => props.theme.colors.background} 25%,
    ${(props) => props.theme.colors.gray} 50%,
    ${(props) => props.theme.colors.background} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: ${(props) => props.theme.radius.md};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingContainer key={index}>
          <SkeletonImage />
        </LoadingContainer>
      ))}
    </>
  );
};