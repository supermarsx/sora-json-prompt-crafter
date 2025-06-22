const MEASUREMENT_ID = 'G-RVR9TSBQL7'

let trackingFailures = 0
let trackingDead = false

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
    console.error('Tracking History: There was an error.')
  }

  if (trackingDead) return

  const gtag = (
    window as unknown as {
      gtag?: (
        action: string,
        eventName: string,
        params?: Record<string, unknown>
      ) => void
    }
  ).gtag

  try {
    if (typeof gtag !== 'function') console.error('Tracking Analytics: gtag function missing.')
    gtag('event', 'page_action', {
      send_to: MEASUREMENT_ID,
      action: event,
      ...params,
    })
  } catch (e) {
    trackingFailures++
    if (trackingFailures <= 5) {
      console.error('Tracking Analytics: There was an error.')
    }
    if (trackingFailures >= 5 && !trackingDead) {
      trackingDead = true
      console.error(
        'Tracking Analytics: Too many errors, tracking permanently failed.'
      )
    }
  }
}
