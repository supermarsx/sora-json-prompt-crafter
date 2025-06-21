import React, { useEffect } from 'react';

<<<<<<< HEAD
const Footer = () => (
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
  </footer>
);
=======
interface FooterProps {
  trackingEnabled: boolean;
}

const GA_ID = 'G-RVR9TSBQL7';

const Footer: React.FC<FooterProps> = ({ trackingEnabled }) => {
  useEffect(() => {
    const win = window as Window & Record<string, unknown>;
    if (!trackingEnabled) {
      win[`ga-disable-${GA_ID}`] = true;
      return;
    }
    win[`ga-disable-${GA_ID}`] = false;
    if (document.getElementById('ga-script')) return;
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.body.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`;
    document.body.appendChild(inline);
  }, [trackingEnabled]);

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
    </footer>
  );
};
>>>>>>> parent of b02863b (Remove Google Tag Manager script)

export default Footer;
