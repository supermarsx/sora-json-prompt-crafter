import { useEffect, useState } from 'react'
import { safeGet } from '@/lib/storage'

export interface ActionEntry {
  date: string
  action: string
}

export function useActionHistory() {
  const [history, setHistory] = useState<ActionEntry[]>(() => {
    return safeGet<ActionEntry[]>('trackingHistory', [], true)
  })

  useEffect(() => {
    const handler = () => {
      setHistory(safeGet<ActionEntry[]>('trackingHistory', [], true))
    }
    window.addEventListener('trackingHistoryUpdate', handler)
    return () => window.removeEventListener('trackingHistoryUpdate', handler)
  }, [])

  return history
}
