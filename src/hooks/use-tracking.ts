import { useEffect, useState } from 'react'
import { safeGet, safeSet } from '@/lib/storage'

export function useTracking() {
  const [enabled, setEnabled] = useState(() => {
    const stored = safeGet('trackingEnabled')
    if (stored !== null) {
      try {
        return JSON.parse(stored)
      } catch {
        return true
      }
    }
    return true
  })

  useEffect(() => {
    safeSet('trackingEnabled', JSON.stringify(enabled))
  }, [enabled])

  return [enabled, setEnabled] as const
}
