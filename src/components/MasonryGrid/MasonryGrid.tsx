import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { Photo } from '../../types/photo';

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

  // Calculate number of columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const newNumColumns = Math.max(1, Math.floor(width / 300)); // 300px minimum column width
        setNumColumns(newNumColumns);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute photos into columns
  useEffect(() => {
    const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);
    
    photos.forEach((photo) => {
      // Find the shortest column
      const shortestColumn = newColumns.reduce((shortest, current, index) => {
        const shortestHeight = shortest.height;
        const currentHeight = current.reduce((sum, p) => sum + (p.height / p.width), 0);
        return currentHeight < shortestHeight ? { index, height: currentHeight } : shortest;
      }, { index: 0, height: Infinity });

      newColumns[shortestColumn.index].push(photo);
    });

    setColumns(newColumns);
  }, [photos, numColumns]);

  return (
    <GridContainer ref={containerRef}>
      <div style={{ display: 'flex', gap: '16px' }}>
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