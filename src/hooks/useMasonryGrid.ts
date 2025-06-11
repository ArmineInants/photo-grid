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
  const columnHeightsRef = useRef<number[]>([]);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // Debounce helpers for resize/scroll
  const resizeRaf = useRef<number | null>(null);
  const scrollRaf = useRef<number | null>(null);

  // Calculate number of columns based on container width
  const updateColumns = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const minColumnWidth = width < 600 ? 300 : 350;
    const newNumColumns = Math.max(1, Math.floor(width / minColumnWidth));

    if (newNumColumns !== numColumns) {
      setNumColumns(newNumColumns);
      columnHeightsRef.current = new Array(newNumColumns).fill(0);
    }
  }, [numColumns]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (resizeRaf.current !== null) {
        window.cancelAnimationFrame(resizeRaf.current);
      }
      resizeRaf.current = window.requestAnimationFrame(updateColumns);
    };

    updateColumns();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeRaf.current !== null) {
        window.cancelAnimationFrame(resizeRaf.current);
      }
    };
  }, [updateColumns]);

  // Calculate visible range for virtualization
  const calculateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight } = container;
    const overscan = 5;

    const columnHeights = columnHeightsRef.current;
    if (columnHeights.length === 0 || numColumns === 0) return;

    // Estimate average item height
    const itemsPerColumn = Math.max(1, Math.ceil(photos.length / numColumns));
    const minColHeight = Math.min(...columnHeights);
    const avgItemHeight = minColHeight > 0 ? minColHeight / itemsPerColumn : 300;

    // Estimate start/end indices
    const estStartIndex = Math.max(
      0,
      Math.floor(scrollTop / avgItemHeight) * numColumns - overscan * numColumns
    );
    const estEndIndex = Math.min(
      photos.length,
      Math.ceil((scrollTop + clientHeight) / avgItemHeight) * numColumns + overscan * numColumns + estStartIndex
    );

    setVisibleRange({ start: estStartIndex, end: estEndIndex });
  }, [photos.length, numColumns]);

  // Handle scroll for infinite loading and virtualization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollRaf.current !== null) {
        window.cancelAnimationFrame(scrollRaf.current);
      }

      scrollRaf.current = window.requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;

        if (isNearBottom && hasMore && !isLoadingMore) {
          onLoadMore?.();
        }

        calculateVisibleRange();
      });
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollRaf.current !== null) {
        window.cancelAnimationFrame(scrollRaf.current);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore, calculateVisibleRange]);

  // Distribute photos into columns (masonry layout)
  useEffect(() => {
    if (numColumns === 0) {
      setColumns([]);
      return;
    }

    // Remove duplicate photos by id
    const uniquePhotos = Array.from(
      new Map(photos.map(photo => [photo.id, photo])).values()
    );

    // Precompute column heights and columns
    const newColumns: Photo[][] = Array.from({ length: numColumns }, () => []);
    const newHeights: number[] = new Array(numColumns).fill(0);

    const containerWidth = containerRef.current?.offsetWidth || 1200;
    const availableWidth = containerWidth - 32;
    const columnWidth = (availableWidth - (numColumns - 1) * 16) / numColumns;

    for (let i = 0; i < uniquePhotos.length; ++i) {
      // Find the column with the smallest height
      let minIdx = 0;
      let minHeight = newHeights[0];
      for (let j = 1; j < numColumns; ++j) {
        if (newHeights[j] < minHeight) {
          minHeight = newHeights[j];
          minIdx = j;
        }
      }
      const photo = uniquePhotos[i];
      newColumns[minIdx].push(photo);
      const aspectRatio = photo.width / photo.height;
      const photoHeight = columnWidth / aspectRatio;
      newHeights[minIdx] += photoHeight + 16;
    }

    columnHeightsRef.current = newHeights;
    setColumns(newColumns);
  }, [photos, numColumns]);

  // Calculate total grid height
  const totalHeight = useMemo(() => {
    if (photos.length === 0) return 0;
    const maxColumnHeight = Math.max(...columnHeightsRef.current, 0);
    return Math.max(maxColumnHeight, containerRef.current?.clientHeight || 800);
  }, [photos, numColumns]);

  // Recalculate visible range when columns change
  useEffect(() => {
    calculateVisibleRange();
  }, [calculateVisibleRange, columns]);

  return {
    columns,
    numColumns,
    containerRef,
    totalHeight,
    visibleRange,
  };
};