import { useState, useEffect, useCallback, useRef } from 'react';

interface ViewportState {
  startIndex: number;
  endIndex: number;
  visibleItems: number;
}

export const useViewport = (
  itemCount: number,
  itemHeight: number,
  containerRef: React.RefObject<HTMLElement>,
  bufferItems: number = 5
): ViewportState => {
  const [viewportState, setViewportState] = useState<ViewportState>({
    startIndex: 0,
    endIndex: 0,
    visibleItems: 0
  });

  const timeoutRef = useRef<number>();
  const lastScrollTime = useRef<number>(0);
  const isInitialized = useRef(false);

  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current || itemCount <= 0 || itemHeight <= 0) {
      setViewportState({
        startIndex: 0,
        endIndex: 0,
        visibleItems: 0
      });
      return;
    }

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Calculate how many items can fit in the viewport
    const itemsInView = Math.ceil(containerHeight / itemHeight);
    
    // For initial load, show more items
    const initialBuffer = isInitialized.current ? bufferItems : itemsInView;
    
    // Calculate start and end indices with buffer
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - initialBuffer);
    const endIndex = Math.min(
      itemCount - 1,
      startIndex + itemsInView + 2 * initialBuffer
    );

    setViewportState({
      startIndex,
      endIndex,
      visibleItems: endIndex - startIndex + 1
    });

    if (!isInitialized.current) {
      isInitialized.current = true;
    }
  }, [itemCount, itemHeight, bufferItems, containerRef]);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      window.cancelAnimationFrame(timeoutRef.current);
    }

    // Add throttling for scroll events
    const now = Date.now();
    if (lastScrollTime.current && now - lastScrollTime.current < 16) { // ~60fps
      return;
    }
    lastScrollTime.current = now;

    timeoutRef.current = window.requestAnimationFrame(calculateVisibleItems);
  }, [calculateVisibleItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial calculation
    calculateVisibleItems();

    // Add event listeners
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        window.cancelAnimationFrame(timeoutRef.current);
      }
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [calculateVisibleItems, handleScroll, containerRef]);

  return viewportState;
};