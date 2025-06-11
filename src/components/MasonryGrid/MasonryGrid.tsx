import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';
import { useMasonryGrid } from '../../hooks/useMasonryGrid';
import { ErrorBoundary } from '../index';
import { PhotoCard } from '../PhotoCard/PhotoCard';

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
  height: calc(100vh - 68px);
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
    </ErrorBoundary>
  );
};