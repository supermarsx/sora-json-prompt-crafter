import { useState, useEffect } from 'react'

export function useTracking() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem('trackingEnabled')
      return stored ? JSON.parse(stored) : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('trackingEnabled', JSON.stringify(enabled))
    } catch {
      /* ignore */
    }
  }, [enabled])

  return [enabled, setEnabled] as const
}
