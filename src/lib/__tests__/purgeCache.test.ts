import { purgeCache } from '../purgeCache';

describe('purgeCache', () => {
  beforeEach(() => {
    localStorage.clear();
    (globalThis as { caches: CacheStorage }).caches = {
      keys: jest.fn(() => Promise.resolve(['a', 'b'])),
      delete: jest.fn(() => Promise.resolve(true)),
    } as CacheStorage;
    (
      globalThis.navigator as { serviceWorker: ServiceWorkerContainer }
    ).serviceWorker = {
      getRegistrations: jest.fn(() =>
        Promise.resolve([
          {
            unregister: jest.fn(() => Promise.resolve(true)),
          } as ServiceWorkerRegistration,
        ]),
      ),
    };
    localStorage.setItem('currentJson', 'v');
    localStorage.setItem('jsonHistory', 'v');
    localStorage.setItem('githubStats', 'v');
    localStorage.setItem('githubStatsTimestamp', 'v');
    localStorage.setItem('trackingHistory', 'v');
  });

  afterEach(() => {
    delete (globalThis as { caches?: unknown }).caches;
    delete (globalThis.navigator as { serviceWorker?: unknown }).serviceWorker;
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
