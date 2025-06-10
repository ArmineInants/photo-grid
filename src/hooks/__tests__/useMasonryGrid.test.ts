import { jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useMasonryGrid } from '../useMasonryGrid';
import type { Photo } from '../../types/photo';

describe('useMasonryGrid', () => {
  const mockPhotos: Photo[] = [
    {
      id: 1,
      width: 1000,
      height: 800,
      url: 'https://example.com/photo1',
      photographer: 'John Doe',
      photographer_url: 'https://example.com/photographer',
      photographer_id: 1,
      avg_color: '#000000',
      src: {
        original: 'https://example.com/photo1/original',
        large2x: 'https://example.com/photo1/large2x',
        large: 'https://example.com/photo1/large',
        medium: 'https://example.com/photo1/medium',
        small: 'https://example.com/photo1/small',
        portrait: 'https://example.com/photo1/portrait',
        landscape: 'https://example.com/photo1/landscape',
        tiny: 'https://example.com/photo1/tiny',
      },
      liked: false,
      alt: 'Test photo 1',
    },
  ];

  const defaultProps = {
    photos: mockPhotos,
    hasMore: true,
    isLoadingMore: false,
    onLoadMore: jest.fn(),
  };

  beforeEach(() => {
    // Mock window.requestAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useMasonryGrid(defaultProps));
    
    expect(result.current.columns).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.totalHeight).toBeDefined();
  });

  it('updates columns when photos change', () => {
    const { result, rerender } = renderHook(
      (props) => useMasonryGrid(props),
      { initialProps: defaultProps }
    );

    const newPhotos = [...mockPhotos, { ...mockPhotos[0], id: 2 }];
    rerender({ ...defaultProps, photos: newPhotos });

    expect(result.current.columns.flat().length).toBe(newPhotos.length);
  });

  it('handles window resize', () => {
    renderHook(() => useMasonryGrid(defaultProps));

    act(() => {
      // Simulate window resize
      window.dispatchEvent(new Event('resize'));
    });

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useMasonryGrid(defaultProps));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
}); 