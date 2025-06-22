import { useEffect, useState } from 'react'
import { safeGet, safeSet } from '@/lib/storage'
import { DISABLE_ANALYTICS } from '@/lib/config'

export function useTracking() {
  const [enabled, setEnabled] = useState(() => {
    if (DISABLE_ANALYTICS) return false
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
