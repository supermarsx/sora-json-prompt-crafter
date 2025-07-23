import { jest } from '@jest/globals';

const staticAssets = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.png',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/disclaimer.txt',
  '/disclaimers/disclaimer.en-US.txt',
  '/disclaimers/disclaimer.es-ES.txt',
  '/disclaimers/disclaimer.pt-PT.txt',
  '/disclaimers/disclaimer.ru-RU.txt',
  '/disclaimers/disclaimer.pt-BR.txt',
  '/disclaimers/disclaimer.fr-FR.txt',
  '/disclaimers/disclaimer.de-DE.txt',
  '/disclaimers/disclaimer.zh-CN.txt',
  '/disclaimers/disclaimer.it-IT.txt',
  '/disclaimers/disclaimer.es-MX.txt',
  '/disclaimers/disclaimer.en-GB.txt',
  '/disclaimers/disclaimer.bn-IN.txt',
  '/disclaimers/disclaimer.ja-JP.txt',
  '/disclaimers/disclaimer.en-PR.txt',
  '/disclaimers/disclaimer.ko-KR.txt',
  '/disclaimers/disclaimer.ro-RO.txt',
  '/disclaimers/disclaimer.sv-SE.txt',
  '/disclaimers/disclaimer.uk-UA.txt',
  '/disclaimers/disclaimer.ne-NP.txt',
  '/disclaimers/disclaimer.da-DK.txt',
  '/disclaimers/disclaimer.et-EE.txt',
  '/disclaimers/disclaimer.fi-FI.txt',
  '/disclaimers/disclaimer.el-GR.txt',
  '/disclaimers/disclaimer.th-TH.txt',
  '/disclaimers/disclaimer.de-AT.txt',
  '/disclaimers/disclaimer.fr-BE.txt',
  '/disclaimers/disclaimer.es-AR.txt',
  '/placeholder.svg',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/site.webmanifest',
  '/robots.txt',
  '/sora-userscript.user.js',
];

describe('service worker', () => {
  let listeners: Record<string, (event: unknown) => unknown>;
  let cacheAddAll: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    listeners = {};
    cacheAddAll = jest.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).caches = {
      open: jest.fn().mockResolvedValue({ addAll: cacheAddAll }),
      match: jest.fn(),
      keys: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).self = {
      addEventListener: (name: string, cb: (event: unknown) => unknown) => {
        listeners[name] = cb;
      },
      skipWaiting: jest.fn(),
      clients: { claim: jest.fn() },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).clients = (global as any).self.clients;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).self;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).caches;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).clients;
  });

  test('caches static and build assets on install', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).self.__WB_MANIFEST = [
      { url: '/assets/app.js' },
      { url: '/assets/style.css' },
    ];
    await import('../sw.js');
    const installEvent: {
      waitUntil: (p: Promise<unknown>) => Promise<unknown>;
    } = {
      waitUntil: (p: Promise<unknown>) => p,
    };
    await listeners.install(installEvent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).caches.open).toHaveBeenCalledWith(
      'sora-prompt-cache-v2',
    );
    expect(cacheAddAll).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...staticAssets,
        '/assets/app.js',
        '/assets/style.css',
      ]),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).self.skipWaiting).toHaveBeenCalled();
  });

  test('serves cached response for fetch', async () => {
    await import('../sw.js');
    const cachedResponse = { body: 'cached' } as unknown as Response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).caches.match.mockResolvedValueOnce(cachedResponse);
    let responded: Promise<Response> | undefined;
    const event = {
      request: { url: '/index.html' } as unknown as Request,
      respondWith: (p: Promise<Response>) => {
        responded = p;
      },
    };
    listeners.fetch(event);
    const result = await responded;
    expect(result).toBe(cachedResponse);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).fetch).not.toHaveBeenCalled();
  });

  test('falls back to network when not cached', async () => {
    await import('../sw.js');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).caches.match.mockResolvedValueOnce(undefined);
    const networkResponse = { body: 'network' } as unknown as Response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch.mockResolvedValue(networkResponse);
    let responded: Promise<Response> | undefined;
    const event = {
      request: { url: '/index.html' } as unknown as Request,
      respondWith: (p: Promise<Response>) => {
        responded = p;
      },
    };
    listeners.fetch(event);
    const result = await responded;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).fetch).toHaveBeenCalledWith(event.request);
    expect(result).toBe(networkResponse);
  });

  test('claims clients on activate', async () => {
    await import('../sw.js');
    const activationPromise = Promise.resolve();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).self.clients.claim.mockReturnValueOnce(activationPromise);
    const waitUntil = jest.fn();
    const activateEvent = { waitUntil };
    await listeners.activate(activateEvent);
    await waitUntil.mock.calls[0][0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).self.clients.claim).toHaveBeenCalled();
    expect(waitUntil).toHaveBeenCalledWith(activationPromise);
  });

  test('deletes outdated caches on activate', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).caches.keys.mockResolvedValue([
      'old-cache',
      'sora-prompt-cache-v2',
    ]);
    await import('../sw.js');
    const waitUntil = jest.fn();
    const activateEvent = { waitUntil };
    await listeners.activate(activateEvent);
    await waitUntil.mock.calls[0][0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((global as any).caches.delete).toHaveBeenCalledWith('old-cache');
  });
});
