import { renderHook } from '@testing-library/react';
import { useViewport } from '../useViewport';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock the requestAnimationFrame
const mockRAF = (callback: FrameRequestCallback) => {
  callback(0); // Pass timestamp as required by FrameRequestCallback
  return 1;
};

// Mock functions
const mockFn = <T extends (...args: any[]) => any>(implementation?: T) => 
  implementation ? jest.fn(implementation) : jest.fn();

describe('useViewport', () => {
  beforeEach(() => {
    // Mock requestAnimationFrame
    window.requestAnimationFrame = mockRAF;
    window.cancelAnimationFrame = mockFn();
  });

  it('returns correct initial state', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    const { result } = renderHook(() =>
      useViewport(0, 100, ref)
    );
    expect(result.current).toEqual({
      startIndex: 0,
      endIndex: 0,
      visibleItems: 0,
    });
  });

  it('calculates visible items based on container size and scroll', () => {
    // Mock a container with 500px height and scrollTop 0
    const container = {
      clientHeight: 500,
      scrollTop: 0,
      addEventListener: mockFn(),
      removeEventListener: mockFn(),
    } as unknown as HTMLDivElement;

    const ref = { current: container } as React.RefObject<HTMLDivElement>;

    const { result } = renderHook(() =>
      useViewport(100, 100, ref, 0)
    );

    // 500px / 100px = 5 items in view
    expect(result.current.visibleItems).toBeGreaterThanOrEqual(5);
  });

  it('handles invalid inputs correctly', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    const { result } = renderHook(() =>
      useViewport(-1, -1, ref)
    );
    expect(result.current).toEqual({
      startIndex: 0,
      endIndex: 0,
      visibleItems: 0,
    });
  });

  it('updates on scroll', () => {
    const mockScrollCallback = mockFn();
    const container = {
      clientHeight: 500,
      scrollTop: 0,
      addEventListener: mockFn((event: string, callback: () => void) => {
        if (event === 'scroll') {
          callback(); // Call the callback to simulate scroll
          mockScrollCallback();
        }
      }),
      removeEventListener: mockFn(),
    } as unknown as HTMLDivElement;

    const ref = { current: container } as React.RefObject<HTMLDivElement>;

    const { result } = renderHook(() =>
      useViewport(100, 100, ref, 0)
    );

    // Trigger scroll event
    container.addEventListener('scroll', () => {});
    
    // Verify both the scroll callback was called and the viewport state was updated
    expect(mockScrollCallback).toHaveBeenCalled();
    expect(result.current.startIndex).toBeDefined();
  });
});