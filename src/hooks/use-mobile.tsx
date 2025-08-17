import * as React from 'react';
import { MOBILE_BREAKPOINT } from '@/lib/breakpoints';

/**
 * Determines if the viewport should be treated as mobile.
 *
 * A mobile viewport is defined as one with a width below
 * `MOBILE_BREAKPOINT` (768px).
 *
 * @returns {boolean} `true` if the viewport width is less than
 * `MOBILE_BREAKPOINT`, otherwise `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setIsMobile(false);
      return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
