import { useEffect, useState } from 'react'

export interface ActionEntry {
  date: string
  action: string
}

export function useActionHistory() {
  const [history, setHistory] = useState<ActionEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('trackingHistory') || '[]') as ActionEntry[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    const handler = () => {
      try {
        setHistory(JSON.parse(localStorage.getItem('trackingHistory') || '[]'))
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('trackingHistoryUpdate', handler)
    return () => window.removeEventListener('trackingHistoryUpdate', handler)
  }, [])

  return history
}
