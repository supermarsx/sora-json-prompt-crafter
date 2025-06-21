import React from 'react';

const Footer: React.FC = () => {

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

export default Footer;
