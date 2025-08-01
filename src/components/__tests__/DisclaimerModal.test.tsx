import { render, screen, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import DisclaimerModal from '../DisclaimerModal';

describe('DisclaimerModal', () => {
  const originalFetch = global.fetch;
  let warnSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.restoreAllMocks();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    warnSpy.mockRestore();
  });

  test('renders fetched text on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('loaded text'),
    } as Response);

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(await screen.findByText('loaded text')).toBeDefined();
  });

  test('renders fallback text on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('fail'));

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(await screen.findByText('Failed to load disclaimer.')).toBeDefined();
  });

  test('renders fallback text when response not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('loaded text'),
    } as Response);

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(await screen.findByText('Failed to load disclaimer.')).toBeDefined();
  });

  test('does not fetch when closed', () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('should not fetch'),
    } as Response);
    global.fetch = mockFetch;

    render(<DisclaimerModal open={false} onOpenChange={() => {}} />);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('shows loader while fetching', async () => {
    let resolveFetch: (value: Response) => void = () => {};
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise<Response>((res) => {
          resolveFetch = res;
        }),
    );

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(screen.getByTestId('disclaimer-loader')).toBeDefined();

    await act(async () => {
      resolveFetch({
        ok: true,
        text: () => Promise.resolve('loaded text'),
      } as Response);
    });

    expect(await screen.findByText('loaded text')).toBeDefined();
  });

  test('fetches only when opened', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('loaded text'),
    } as Response);
    global.fetch = mockFetch;

    const { rerender } = render(
      <DisclaimerModal open={false} onOpenChange={() => {}} />,
    );

    expect(mockFetch).not.toHaveBeenCalled();

    rerender(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('loaded text')).toBeDefined();
  });

  test('does not refetch on reopen', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('loaded text'),
    } as Response);
    global.fetch = mockFetch;

    const { rerender } = render(
      <DisclaimerModal open={true} onOpenChange={() => {}} />,
    );
    expect(await screen.findByText('loaded text')).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    rerender(<DisclaimerModal open={false} onOpenChange={() => {}} />);
    rerender(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test('uses cached disclaimer text on new mount', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('cached text'),
    } as Response);

    const { unmount } = render(
      <DisclaimerModal open={true} onOpenChange={() => {}} />,
    );
    expect(await screen.findByText('cached text')).toBeDefined();
    unmount();

    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(await screen.findByText('cached text')).toBeDefined();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('loads disclaimer from cache when offline', async () => {
    const matchMock = jest.fn().mockResolvedValue({
      text: () => Promise.resolve('cache text'),
    } as Response);
    (window as unknown as { caches: CacheStorage }).caches = {
      match: matchMock,
    } as unknown as CacheStorage;

    const fetchMock = jest
      .fn()
      .mockRejectedValue(new Error('network unavailable'));
    global.fetch = fetchMock;

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />);

    expect(await screen.findByText('cache text')).toBeDefined();
    expect(matchMock).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();

    delete (window as unknown as { caches?: CacheStorage }).caches;
  });

  test('no state update after unmount', async () => {
    let aborted = false;
    global.fetch = jest.fn().mockImplementation((_url, init) => {
      const signal = (init as RequestInit)?.signal;
      signal?.addEventListener('abort', () => {
        aborted = true;
      });
      return new Promise(() => {}) as unknown as Promise<Response>;
    }) as unknown as typeof fetch;

    const { unmount } = render(
      <DisclaimerModal open={true} onOpenChange={() => {}} />,
    );
    unmount();

    expect(aborted).toBe(true);
    await Promise.resolve();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
