import React, { useState, useCallback, memo, useMemo } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';
import { useMasonryGrid } from '../../hooks/useMasonryGrid';
import { LoadingState, ErrorBoundary } from '../index';

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const GridContainer = styled.div`
  position: relative;
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  height: 100vh;
  overflow-y: auto;
`;

const GridContent = styled.div<{ height: number }>`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  height: ${props => props.height};
  max-width: ${props => props.theme.container.maxWidth};
  position: relative;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const PhotoCardWrapper = styled.div<{ $aspectRatio: number }>`
  position: relative;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding-bottom: ${props => (1 / props.$aspectRatio) * 100}%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
  }
`;

const PhotoImage = styled.img<{ $isLoaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${props => props.theme.radius.md};
  opacity: ${props => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const PhotoPlaceholder = styled.div<{ $aspectRatio: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.background} 25%, 
    ${props => props.theme.colors.gray} 50%, 
    ${props => props.theme.colors.background} 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: ${props => props.theme.radius.md};
  aspect-ratio: ${props => props.$aspectRatio};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface PhotoCardProps {
  photo: Photo;
  onPhotoClick?: (photo: Photo) => void;
  onImageLoad: (photoId: number) => void;
  isLoaded: boolean;
  showPlaceholder: boolean;
}

const PhotoCard = memo<PhotoCardProps>(
  ({ photo, onPhotoClick, onImageLoad, isLoaded, showPlaceholder }) => (
    <PhotoCardWrapper
      onClick={() => onPhotoClick?.(photo)}
      $aspectRatio={photo.width / photo.height}
    >
      <PhotoPlaceholder $aspectRatio={photo.width / photo.height} />
      {!showPlaceholder && (
        <PhotoImage
          src={photo.src.medium}
          alt={photo.alt || 'Photo'}
          loading="lazy"
          $isLoaded={isLoaded}
          onLoad={() => onImageLoad(photo.id)}
        />
      )}
    </PhotoCardWrapper>
  )
);

PhotoCard.displayName = 'PhotoCard';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos,
  onPhotoClick,
  isLoadingMore,
  hasMore,
  onLoadMore,
}) => {
  const { columns, containerRef, totalHeight, visibleRange } = useMasonryGrid({
    photos,
    hasMore,
    isLoadingMore,
    onLoadMore,
  });

  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set());

  const handleImageLoad = useCallback((photoId: number) => {
    setLoadedImages(prev => {
      if (prev.has(photoId)) return prev;
      const next = new Set(prev);
      next.add(photoId);
      return next;
    });
  }, []);

  // Precompute photo indices for fast lookup
  const photoIdToIndex = useMemo(() => {
    const map = new Map<number, number>();
    photos.forEach((photo, idx) => map.set(photo.id, idx));
    return map;
  }, [photos]);

  return (
    <ErrorBoundary fallback={<ErrorFallback error={new Error()} resetErrorBoundary={() => {}} />}>
      <GridContainer ref={containerRef}>
        <GridContent height={totalHeight}>
          {columns.map((column, columnIndex) => (
            <Column key={columnIndex} style={{ flex: 1 }}>
              {column.map((photo) => {
                const photoIdx = photoIdToIndex.get(photo.id) ?? -1;
                const isVisible =
                  visibleRange.start <= photoIdx && photoIdx < visibleRange.end;

                return (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onPhotoClick={onPhotoClick}
                    onImageLoad={handleImageLoad}
                    isLoaded={loadedImages.has(photo.id)}
                    showPlaceholder={!isVisible}
                  />
                );
              })}
            </Column>
          ))}
        </GridContent>
      </GridContainer>
      {isLoadingMore && <LoadingState />}
    </ErrorBoundary>
  );
};