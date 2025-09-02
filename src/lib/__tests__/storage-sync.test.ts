import * as storage from '../storage';
import { CURRENT_JSON } from '../storage-keys';

describe('remote storage helpers', () => {
  beforeEach(() => {
    (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('syncConfigToUrl posts AppData', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });

    await storage.syncConfigToUrl('https://example.com');

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, opts] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('https://example.com');
    expect(opts?.method).toBe('POST');
    expect(opts?.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(() => JSON.parse(opts?.body as string)).not.toThrow();
  });

  test('syncConfigToUrl rejects on error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(
      storage.syncConfigToUrl('https://example.com'),
    ).rejects.toThrow('Failed to sync config');
  });

  test('loadConfigFromUrl fetches and imports AppData', async () => {
    const data = {
      currentJson: 'hi',
      jsonHistory: [],
      preferences: {},
      sectionPresets: {},
      presets: {},
      customValues: {},
    } as storage.AppData;
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(data),
    });

    await storage.loadConfigFromUrl('https://example.com');

    expect(fetch).toHaveBeenCalledWith('https://example.com');
    expect(localStorage.getItem(CURRENT_JSON)).toBe('hi');
  });

  test('loadConfigFromUrl rejects on non-ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500, statusText: 'err' });
    await expect(
      storage.loadConfigFromUrl('https://example.com'),
    ).rejects.toThrow('Failed to load config');
  });

  test('loadConfigFromUrl rejects on fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('fail'));
    await expect(
      storage.loadConfigFromUrl('https://example.com'),
    ).rejects.toThrow('Failed to load config');
  });
});
