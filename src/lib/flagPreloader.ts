let hasPreloaded = false;

/**
 * Preload all flag SVGs into memory to avoid layout shifts or network delays
 * when switching locales. Uses Vite's glob import to eagerly resolve flag
 * asset URLs and loads each into an Image object. No-op in non-browser
 * environments or when already executed this session.
 */
export function preloadFlags(): void {
  if (hasPreloaded || typeof window === 'undefined') {
    return;
  }

  hasPreloaded = true;

  // Access `import.meta.glob` via dynamic evaluation so tests running in a
  // CommonJS environment do not error when parsing this file.
  const glob = (() => {
    try {
      return new Function('return import.meta')().glob as
        | ((pattern: string, opts: unknown) => Record<string, string>)
        | undefined;
    } catch {
      return undefined;
    }
  })();

  if (!glob) {
    return;
  }

  const modules = glob('/flags/*.svg', { as: 'url', eager: true });

  Object.values(modules).forEach((src) => {
    const img = new Image();
    img.src = src as unknown as string;
  });
}
