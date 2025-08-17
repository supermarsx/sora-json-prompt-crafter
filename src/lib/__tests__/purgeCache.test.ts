import { purgeCache } from '../purgeCache';
import {
  CURRENT_JSON,
  JSON_HISTORY,
  GITHUB_STATS,
  GITHUB_STATS_TIMESTAMP,
  TRACKING_HISTORY,
} from '../storage-keys';

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
    localStorage.setItem(CURRENT_JSON, 'v');
    localStorage.setItem(JSON_HISTORY, 'v');
    localStorage.setItem(GITHUB_STATS, 'v');
    localStorage.setItem(GITHUB_STATS_TIMESTAMP, 'v');
    localStorage.setItem(TRACKING_HISTORY, 'v');
  });

  afterEach(() => {
    delete (globalThis as { caches?: unknown }).caches;
    delete (globalThis.navigator as { serviceWorker?: unknown }).serviceWorker;
  });

  test('clears caches, storage, service workers, and reloads', async () => {
    await purgeCache();
    expect(caches.keys).toHaveBeenCalled();
    expect(caches.delete).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(CURRENT_JSON)).toBeNull();
    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(caches.delete).toHaveBeenCalledTimes(2);
  });
});
