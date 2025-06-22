function readEnv(key: string): string | undefined {
  try {
    return new Function(`return import.meta.env.${key}`)() as string | undefined
  } catch {
    return process.env[key]
  }
}

export const MEASUREMENT_ID =
  readEnv('VITE_MEASUREMENT_ID') ?? 'G-RVR9TSBQL7'
export const DISABLE_ANALYTICS = readEnv('VITE_DISABLE_ANALYTICS') === 'true'
