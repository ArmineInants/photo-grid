import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';
import { useMasonryGrid } from '../../hooks/useMasonryGrid';
import { LoadingState } from '../LoadingState/LoadingState';

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
  max-width: 1200px;
  position: relative;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const PhotoCard = styled.div<{ $aspectRatio: number }>`
  position: relative;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  padding-bottom: ${props => (1 / props.$aspectRatio) * 100}%;
  background: ${props => props.theme.colors.background};

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
  opacity: ${props => props.$isLoaded ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`;

const PhotoPlaceholder = styled.div`
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

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  photos,
  onPhotoClick,
  isLoadingMore,
  hasMore,
  onLoadMore,
}) => {
  const { columns, containerRef, totalHeight } = useMasonryGrid({
    photos,
    hasMore,
    isLoadingMore,
    onLoadMore,
  });

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = useCallback((photoId: number) => {
    setLoadedImages(prev => new Set([...prev, photoId]));
  }, []);

  return (
    <GridContainer ref={containerRef}>
      <GridContent height={totalHeight}>
        {columns.map((column, columnIndex) => (
          <Column key={columnIndex} style={{ flex: 1 }}>
            {column.map((photo) => (
              <PhotoCard 
                key={`${columnIndex}-${photo.id}`}
                onClick={() => onPhotoClick?.(photo)}
                $aspectRatio={photo.width / photo.height}
              >
                <PhotoPlaceholder />
                <PhotoImage 
                  src={photo.src.medium} 
                  alt={photo.alt || 'Photo'} 
                  loading="lazy"
                  $isLoaded={loadedImages.has(photo.id)}
                  onLoad={() => handleImageLoad(photo.id)}
                />
              </PhotoCard>
            ))}
            {isLoadingMore && <LoadingState />}
          </Column>
        ))}
      </GridContent>
    </GridContainer>
  );
};