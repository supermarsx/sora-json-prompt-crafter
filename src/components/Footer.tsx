import React from 'react';

interface FooterProps {
  onShowDisclaimer: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  const commit = import.meta.env.VITE_COMMIT_HASH
  const date = import.meta.env.VITE_COMMIT_DATE
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        Open-Source Software made with ♥ @ 2025 –{' '}
        <a
          href="https://github.com/supermarsx/sora-json-prompt-crafter"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Source
        </a>{' '}
        <button onClick={onShowDisclaimer} className="underline ml-2">
          Disclaimer
        </button>
      </p>
      <p className="mt-2 text-xs">Version {commit} ({date})</p>
      {/* Tracking scripts moved to index.html */}
    </footer>
  );
};

export default Footer;
