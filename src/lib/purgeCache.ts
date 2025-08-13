export async function purgeCache(): Promise<void> {
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  } catch (err) {
    console.warn('Failed to clear caches', err);
  }

  const lsKeys = [
    'currentJson',
    'jsonHistory',
    'githubStats',
    'githubStatsTimestamp',
    'trackingHistory',
  ];

  for (const key of lsKeys) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('Failed to remove', key, err);
    }
  }

  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch (err) {
    console.warn('Failed to unregister service workers', err);
  }

  console.info('Caches cleared, reloading page');
  window.location.reload();
}
