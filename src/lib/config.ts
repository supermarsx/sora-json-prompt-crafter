let measurementId: string | undefined
try {
  measurementId = new Function(
    'return import.meta.env.VITE_MEASUREMENT_ID'
  )() as string | undefined
} catch {
  if (typeof process !== 'undefined') {
    measurementId = process.env.VITE_MEASUREMENT_ID
  }
}
export const MEASUREMENT_ID = measurementId ?? 'G-RVR9TSBQL7'
