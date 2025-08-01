import { purgeCache } from '../purgeCache';

describe('purgeCache', () => {
  beforeEach(() => {
    localStorage.clear();
    (globalThis as unknown as { caches: unknown }).caches = {
      keys: jest.fn(() => Promise.resolve(['a', 'b'])),
      delete: jest.fn(() => Promise.resolve(true)),
    } as unknown as CacheStorage;
    (globalThis.navigator as any).serviceWorker = {
      getRegistrations: jest.fn(() =>
        Promise.resolve([{ unregister: jest.fn(() => Promise.resolve(true)) } as ServiceWorkerRegistration]),
      ),
    };
    localStorage.setItem('currentJson', 'v');
    localStorage.setItem('jsonHistory', 'v');
    localStorage.setItem('githubStats', 'v');
    localStorage.setItem('githubStatsTimestamp', 'v');
    localStorage.setItem('trackingHistory', 'v');
  });

  afterEach(() => {
    // @ts-ignore
    delete (globalThis as any).caches;
    // @ts-ignore
    delete (globalThis.navigator as any).serviceWorker;
  });

  test('clears caches, storage, service workers, and reloads', async () => {
    await purgeCache();
    expect(caches.keys).toHaveBeenCalled();
    expect(caches.delete).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('currentJson')).toBeNull();
    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(caches.delete).toHaveBeenCalledTimes(2);
  });
});
