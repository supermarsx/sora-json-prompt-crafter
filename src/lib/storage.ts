export function safeGet<T = string>(
  key: string,
  defaultValue: T | null = null,
  opts: { json?: boolean } = {},
): T | string | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (opts.json) return JSON.parse(value) as T;
    return value;
  } catch (err) {
    console.warn('safeGet failed', key, err);
    return defaultValue;
  }
}

export function safeSet(
  key: string,
  value: unknown,
  opts: { json?: boolean } = {},
): boolean {
  if (!opts.json && typeof value !== 'string') {
    console.warn(
      `safeSet: value for key "${key}" must be a string when json is false`,
    );
    return false;
  }
  try {
    const data = opts.json ? JSON.stringify(value) : (value as string);
    localStorage.setItem(key, data);
    return true;
  } catch (e) {
    console.warn(`safeSet: failed for key "${key}"`, e);
    return false;
  }
}

export function safeRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`safeRemove: failed for key "${key}"`, e);
    return false;
  }
}
