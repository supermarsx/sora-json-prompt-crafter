import { useEffect, useState } from 'react'
import { safeGet, safeSet } from '@/lib/storage'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = safeGet('darkMode')
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
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    safeSet('darkMode', JSON.stringify(isDark))
  }, [isDark])

  return [isDark, setIsDark] as const
}
