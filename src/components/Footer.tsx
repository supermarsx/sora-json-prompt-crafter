import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  onShowDisclaimer: () => void;
}

/**
 * Application footer containing the link to the GitHub source, a button to
 * trigger the disclaimer dialog, and version information derived from the
 * current commit hash and date.
 *
 * @param onShowDisclaimer - Callback fired when the disclaimer button is
 * clicked.
 */
const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  const { t } = useTranslation();
  const commit = import.meta.env.VITE_COMMIT_HASH;
  const date = import.meta.env.VITE_COMMIT_DATE;
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 text-center text-sm text-muted-foreground">
      <p>
        {t('openSourceMadeWith', { year })}{' '}
        <a
          href="https://github.com/supermarsx/sora-json-prompt-crafter"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('githubSource')}
        </a>{' '}
        <button
          onClick={onShowDisclaimer}
          className="underline ml-2"
          title={t('disclaimer')}
        >
          {t('disclaimer')}
        </button>
      </p>
      <p className="mt-2 text-xs">{t('versionInfo', { commit, date })}</p>
      {/* Tracking scripts moved to index.html */}
    </footer>
  );
};

export default Footer;
