import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';
import { useIsSingleColumn } from '../use-single-column';
import { MOBILE_BREAKPOINT, SINGLE_COLUMN_BREAKPOINT } from '@/lib/breakpoints';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  let add: jest.Mock;
  let remove: jest.Mock;

  beforeEach(() => {
    add = jest.fn();
    remove = jest.fn();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: add,
      removeEventListener: remove,
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test('updates state on change and cleans up', () => {
    window.innerWidth = MOBILE_BREAKPOINT - 100;
    const { result, unmount } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);

    window.innerWidth = MOBILE_BREAKPOINT + 32;
    act(() => {
      const handler = add.mock.calls[0][1];
      handler();
    });
    expect(result.current).toBe(false);

    const handler = add.mock.calls[0][1];
    unmount();
    expect(remove).toHaveBeenCalledWith('change', handler);
  });

  test('defaults to false when matchMedia is missing', () => {
    delete (window as unknown as { matchMedia?: typeof window.matchMedia })
      .matchMedia;
    window.innerWidth = MOBILE_BREAKPOINT - 100;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});

describe('useIsSingleColumn', () => {
  const originalMatchMedia = window.matchMedia;
  let add: jest.Mock;
  let remove: jest.Mock;

  beforeEach(() => {
    add = jest.fn();
    remove = jest.fn();
    window.matchMedia = jest.fn().mockReturnValue({
      addEventListener: add,
      removeEventListener: remove,
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test('updates state on change and cleans up', () => {
    window.innerWidth = SINGLE_COLUMN_BREAKPOINT - 100;
    const { result, unmount } = renderHook(() => useIsSingleColumn());
    expect(result.current).toBe(true);

    window.innerWidth = SINGLE_COLUMN_BREAKPOINT + 100;
    act(() => {
      const handler = add.mock.calls[0][1];
      handler();
    });
    expect(result.current).toBe(false);

    const handler = add.mock.calls[0][1];
    unmount();
    expect(remove).toHaveBeenCalledWith('change', handler);
  });

  test('defaults to false when matchMedia is missing', () => {
    delete (window as unknown as { matchMedia?: typeof window.matchMedia })
      .matchMedia;
    window.innerWidth = SINGLE_COLUMN_BREAKPOINT - 100;
    const { result } = renderHook(() => useIsSingleColumn());
    expect(result.current).toBe(false);
  });
});
