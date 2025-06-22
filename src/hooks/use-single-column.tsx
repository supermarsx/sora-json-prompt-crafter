import * as React from 'react'

const BREAKPOINT = 1024

export function useIsSingleColumn() {
  const [isSingle, setIsSingle] = React.useState(false)

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setIsSingle(false)
      return
    }

    const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const handler = () => setIsSingle(window.innerWidth < BREAKPOINT)
    mq.addEventListener('change', handler)
    handler()
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isSingle
}
