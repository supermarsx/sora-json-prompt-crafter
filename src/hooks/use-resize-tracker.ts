import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export function useResizeTracker(
  ref: React.RefObject<HTMLElement>,
  trackingEnabled: boolean,
  event: string
) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let prevWidth = el.offsetWidth
    let prevHeight = el.offsetHeight
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width !== prevWidth || height !== prevHeight) {
          prevWidth = width
          prevHeight = height
          trackEvent(trackingEnabled, event)
        }
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, trackingEnabled, event])
}
