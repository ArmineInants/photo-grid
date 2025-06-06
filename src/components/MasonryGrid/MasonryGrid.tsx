import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';
import { useViewport } from '../../hooks/useViewport';

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

const GridContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  height: 100vh;
  overflow-y: auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PhotoCard = styled.div`
  position: relative;
  width: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  object-fit: cover;
`;

export const MasonryGrid: React.FC<MasonryGridProps> = ({ photos, onPhotoClick }) => {
  const [columns, setColumns] = useState<Photo[][]>([]);
  const [numColumns, setNumColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<number>();

  const getBufferSize = () => {
    const width = containerRef.current?.offsetWidth || 0;
    if (width < 600) {
      return 20; // Keep the larger buffer for small screens
    } else if (width < 768) {
      return 10;
    }
    return 5;
  };
  
  // Calculate estimated item height based on actual photo dimensions
  const getEstimatedItemHeight = useCallback(() => {
    if (photos.length === 0) return 300; // Default fallback
    
    const containerWidth = containerRef.current?.offsetWidth || 1200;
    const availableWidth = containerWidth - 32; // Account for padding
    const columnWidth = (availableWidth - (numColumns - 1) * 16) / numColumns;
    
    // Calculate average aspect ratio
    const totalAspectRatio = photos.reduce((sum, photo) => sum + (photo.height / photo.width), 0);
    const avgAspectRatio = totalAspectRatio / photos.length;
    
    return columnWidth * avgAspectRatio;
  }, [photos, numColumns, containerRef]);

  const { startIndex, endIndex } = useViewport(
    photos.length,
    getEstimatedItemHeight(), // Use the same height calculation
    containerRef,
    getBufferSize()
  );

  // Debounced column update
  const updateColumns = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const minColumnWidth = width < 600 ? 250 : 300;
      const newNumColumns = Math.max(1, Math.floor(width / minColumnWidth));
      setNumColumns(newNumColumns);
    }
  }, []);

  // Calculate number of columns based on container width with debounce
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        window.cancelAnimationFrame(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.requestAnimationFrame(updateColumns);
    };

    updateColumns();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        window.cancelAnimationFrame(resizeTimeoutRef.current);
      }
    };
  }, [updateColumns]);

  // Optimized photo distribution
  useEffect(() => {
    const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);
    const visiblePhotos = photos.slice(startIndex, endIndex + 1);
    
    // Pre-calculate column heights
    const columnHeights = new Array(numColumns).fill(0);
    
    visiblePhotos.forEach((photo) => {
      // Find the shortest column using pre-calculated heights
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      newColumns[shortestColumnIndex].push(photo);
      // Update column height
      columnHeights[shortestColumnIndex] += photo.height / photo.width;
    });

    setColumns(newColumns);
  }, [photos, numColumns, startIndex, endIndex]);

  // Calculate total height for virtual scrolling
  const totalHeight = useMemo(() => {
    if (photos.length === 0) return 0;
    
    const estimatedHeight = getEstimatedItemHeight();
    const safetyFactor = Math.min(1.5, 1 + (numColumns * 0.1));
    const minHeight = containerRef.current?.clientHeight || 800;
    const calculatedHeight = Math.ceil((photos.length / numColumns) * estimatedHeight * safetyFactor);
    
    return Math.max(calculatedHeight, minHeight);
  }, [photos, numColumns, containerRef, getEstimatedItemHeight]);

  return (
    <GridContainer ref={containerRef}>
      <div style={{ 
        display: 'flex', 
        gap: '16px',
        height: totalHeight,
        position: 'relative'
      }}>
        {columns.map((column, columnIndex) => (
          <Column key={columnIndex} style={{ flex: 1 }}>
            {column.map((photo) => (
              <PhotoCard 
                key={photo.id} 
                onClick={() => onPhotoClick?.(photo)}
              >
                <PhotoImage 
                  src={photo.src.medium} 
                  alt={photo.alt || 'Photo'} 
                  loading="lazy"
                />
              </PhotoCard>
            ))}
          </Column>
        ))}
      </div>
    </GridContainer>
  );
}; 