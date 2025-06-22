export function safeGet<T = string>(key: string, defaultValue: T | null = null, parse = false): T | string | null {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return defaultValue
    if (parse) return JSON.parse(value) as T
    return value
  } catch {
    return defaultValue
  }
}

export function safeSet(key: string, value: unknown, stringify = false): boolean {
  try {
    const data = stringify ? JSON.stringify(value) : (value as string)
    localStorage.setItem(key, data)
    return true
  } catch {
    return false
  }
}

export function safeRemove(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
