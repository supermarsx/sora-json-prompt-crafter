import React, { useState, useEffect } from 'react';
import { useTracking } from '@/hooks/use-tracking';
import { trackEvent } from '@/lib/analytics';

export const ProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [trackingEnabled] = useTracking();
  const [reported, setReported] = useState(false);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      if (!reported && progress >= 99) {
        if (trackingEnabled) {
          trackEvent(true, 'scroll_bottom');
        }
        setReported(true);
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [reported, trackingEnabled]);

  return (
    <div className="fixed bottom-0 left-0 w-full h-1 bg-muted z-50">
      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
