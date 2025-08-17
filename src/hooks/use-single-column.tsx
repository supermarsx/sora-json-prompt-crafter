import * as React from 'react';
import { SINGLE_COLUMN_BREAKPOINT } from '@/lib/breakpoints';

/**
 * Tracks whether the viewport width is below the single-column breakpoint.
 *
 * The single-column layout is activated when the viewport is narrower than
 * `SINGLE_COLUMN_BREAKPOINT` (1024px).
 *
 * @returns {boolean} `true` if the viewport width is less than
 * `SINGLE_COLUMN_BREAKPOINT`, otherwise `false`.
 */
export function useIsSingleColumn() {
  const [isSingle, setIsSingle] = React.useState(false);

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setIsSingle(false);
      return;
    }

    const mq = window.matchMedia(
      `(max-width: ${SINGLE_COLUMN_BREAKPOINT - 1}px)`,
    );
    const handler = () =>
      setIsSingle(window.innerWidth < SINGLE_COLUMN_BREAKPOINT);
    mq.addEventListener('change', handler);
    handler();
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isSingle;
}
