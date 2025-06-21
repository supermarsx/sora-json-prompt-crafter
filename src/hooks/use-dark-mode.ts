import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('darkMode')
      return stored ? JSON.parse(stored) : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('darkMode', JSON.stringify(isDark))
    } catch {
      /* ignore */
    }
  }, [isDark])

  return [isDark, setIsDark] as const
}
