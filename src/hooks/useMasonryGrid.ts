import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Photo } from '../types/photo';

interface UseMasonryGridProps {
  photos: Photo[];
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export const useMasonryGrid = ({
  photos,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: UseMasonryGridProps) => {
  const [columns, setColumns] = useState<Photo[][]>([]);
  const [numColumns, setNumColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<number | undefined>();
  const columnHeightsRef = useRef<number[]>([]);

  const updateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const minColumnWidth = width < 600 ? 250 : 300;
    const newNumColumns = Math.max(1, Math.floor(width / minColumnWidth));
    
    if (newNumColumns !== numColumns) {
      setNumColumns(newNumColumns);
      // Reset column heights when number of columns changes
      columnHeightsRef.current = new Array(newNumColumns).fill(0);
    }
  }, [numColumns]);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!hasMore || isLoadingMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;

      if (isNearBottom) {
        onLoadMore?.();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    // Initialize columns array
    const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);
    
    // Initialize column heights if needed
    if (columnHeightsRef.current.length !== numColumns) {
      columnHeightsRef.current = new Array(numColumns).fill(0);
    }

    // Get unique photos
    const uniquePhotos = Array.from(
      new Map(photos.map(photo => [photo.id, photo])).values()
    );

    // Calculate column width for height calculations
    const containerWidth = containerRef.current?.offsetWidth || 1200;
    const availableWidth = containerWidth - 32; // Account for padding
    const columnWidth = (availableWidth - (numColumns - 1) * 16) / numColumns;
    
    // Distribute photos to columns
    uniquePhotos.forEach((photo) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeightsRef.current.indexOf(
        Math.min(...columnHeightsRef.current)
      );

      // Safety check for valid column index
      if (shortestColumnIndex >= 0 && shortestColumnIndex < numColumns) {
        newColumns[shortestColumnIndex].push(photo);
        // Calculate height based on aspect ratio and column width
        const aspectRatio = photo.width / photo.height;
        const photoHeight = columnWidth / aspectRatio;
        columnHeightsRef.current[shortestColumnIndex] += photoHeight;
      }
    });

    setColumns(newColumns);
  }, [photos, numColumns]);

  const totalHeight = useMemo(() => {
    if (photos.length === 0) return 0;
    
    // Calculate total height based on the tallest column
    const maxColumnHeight = Math.max(...columnHeightsRef.current);
    return Math.max(maxColumnHeight, containerRef.current?.clientHeight || 800);
  }, [photos, numColumns, containerRef]);

  return {
    columns,
    numColumns,
    containerRef,
    totalHeight,
  };
};