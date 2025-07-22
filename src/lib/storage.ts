export function safeGet<T = string>(
  key: string,
  defaultValue: T | null = null,
  parse = false,
): T | string | null {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    if (parse) return JSON.parse(value) as T;
    return value;
  } catch (err) {
    console.warn('safeGet failed', key, err);
    return defaultValue;
  }
}

export function safeSet(
  key: string,
  value: unknown,
  stringify = false,
): boolean {
  if (!stringify && typeof value !== 'string') {
    console.warn(
      `safeSet: value for key "${key}" must be a string when stringify is false`,
    );
    return false;
  }
  try {
    const data = stringify ? JSON.stringify(value) : (value as string);
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
