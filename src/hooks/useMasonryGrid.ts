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
  const resizeTimeoutRef = useRef<number>();
  const columnHeightsRef = useRef<number[]>([]);

  const updateColumns = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const minColumnWidth = width < 600 ? 250 : 300;
    const newNumColumns = Math.max(1, Math.floor(width / minColumnWidth));
    setNumColumns(newNumColumns);
  }, []);

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
    const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);
    const uniquePhotos = Array.from(
      new Map(photos.map(photo => [photo.id, photo])).values()
    );
    
    if (columnHeightsRef.current.length === 0) {
      columnHeightsRef.current = new Array(numColumns).fill(0);
    }
    
    uniquePhotos.forEach((photo) => {
      const shortestColumnIndex = columnHeightsRef.current.indexOf(
        Math.min(...columnHeightsRef.current)
      );
      newColumns[shortestColumnIndex].push(photo);
      columnHeightsRef.current[shortestColumnIndex] += photo.height / photo.width;
    });

    setColumns(newColumns);
  }, [photos, numColumns]);

  const totalHeight = useMemo(() => {
    if (photos.length === 0) return 0;
    
    const containerWidth = containerRef.current?.offsetWidth || 1200;
    const availableWidth = containerWidth - 32;
    const columnWidth = (availableWidth - (numColumns - 1) * 16) / numColumns;
    
    const maxColumnHeight = Math.max(...columnHeightsRef.current) * columnWidth;
    return Math.max(maxColumnHeight, containerRef.current?.clientHeight || 800);
  }, [photos, numColumns, containerRef]);

  const updateHeights = useCallback(() => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.offsetWidth;
    const minColumnWidth = width < 600 ? 250 : 300;
    const newNumColumns = Math.max(1, Math.floor(width / minColumnWidth));
    
    if (newNumColumns !== numColumns) {
      columnHeightsRef.current = new Array(newNumColumns).fill(0);
      setNumColumns(newNumColumns);
    }
  }, [numColumns]);

  return {
    columns,
    numColumns,
    containerRef,
    totalHeight,
  };
};