import React from 'react';
import { useTracking } from '@/hooks/use-tracking';

const Footer = () => {
  const [trackingEnabled] = useTracking();

  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        I ♥ Open-Source software @ 2025 –{' '}
        <a
          href="https://github.com/supermarsx/sora-json-prompt-crafter"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Source
        </a>
      </p>
      {trackingEnabled && (
        <>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-RVR9TSBQL7"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-RVR9TSBQL7');`,
            }}
          />
        </>
      )}
    </footer>
  );
};

export default Footer;
