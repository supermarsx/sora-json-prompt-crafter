import * as React from 'react'
import { SINGLE_COLUMN_BREAKPOINT } from '@/lib/breakpoints'

export function useIsSingleColumn() {
  const [isSingle, setIsSingle] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setIsSingle(false)
      return
    }

    const mq = window.matchMedia(`(max-width: ${SINGLE_COLUMN_BREAKPOINT - 1}px)`)
    const handler = () => setIsSingle(window.innerWidth < SINGLE_COLUMN_BREAKPOINT)
    mq.addEventListener('change', handler)
    handler()
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isSingle
}
