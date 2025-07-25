const cacheName = 'sora-prompt-cache-v2';
// Basic app shell files that are always cached
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

// `self.__WB_MANIFEST` will be replaced at build time by VitePWA with an array
// of precache entries containing the hashed asset filenames produced during the
// build. In dev this will be an empty array.
const buildAssets = (self.__WB_MANIFEST || []).map((entry) => entry.url);

self.addEventListener('install', (event) => {
  const assetsToCache = [...staticAssets, ...buildAssets];
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(assetsToCache)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((name) => name !== cacheName)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
