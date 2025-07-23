import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onShowDisclaimer: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  const { t } = useTranslation();
  const commit = import.meta.env.VITE_COMMIT_HASH;
  const date = import.meta.env.VITE_COMMIT_DATE;
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        {t('footerCredits', { year })}{' '}
        <a
          href="https://github.com/supermarsx/sora-json-prompt-crafter"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('githubSource')}
        </a>{' '}
        <button onClick={onShowDisclaimer} className="underline ml-2">
          {t('disclaimer')}
        </button>
      </p>
      <p className="mt-2 text-xs">
        {t('versionLabel')} {commit} ({date})
      </p>
      {/* Tracking scripts moved to index.html */}
    </footer>
  );
};

export default Footer;
