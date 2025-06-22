export function trackEvent(
  enabled: boolean,
  event: string,
  params?: Record<string, unknown>
) {
  if (!enabled) return

  try {
    const list = JSON.parse(
      localStorage.getItem('trackingHistory') || '[]'
    ) as { date: string; action: string }[]
    list.unshift({ date: new Date().toLocaleString(), action: event })
    if (list.length > 100) list.length = 100
    localStorage.setItem('trackingHistory', JSON.stringify(list))
    window.dispatchEvent(new Event('trackingHistoryUpdate'))
  } catch {
    /* ignore */
  }

  const gtag = (
    window as unknown as {
      gtag?: (
        action: string,
        eventName: string,
        params?: Record<string, unknown>
      ) => void
    }
  ).gtag
  if (typeof gtag === 'function') {
    gtag('event', event, params)
  }
}
