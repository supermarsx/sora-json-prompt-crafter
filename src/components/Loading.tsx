import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Displays a centered spinning loader.
 *
 * The container uses `role="status"` and includes visually hidden text so
 * screen readers announce the loading state.
 */
const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center transition-opacity duration-50"
      role="status"
    >
      <div className="flex items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" />
        <span className="text-lg font-medium">{t('loading')}</span>
      </div>
      <div
        className="mt-4 h-1 w-48 overflow-hidden rounded bg-muted"
        role="progressbar"
        aria-label="loading progress"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full w-1/3 animate-loading-bar bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>
    </div>
  );
};

export default Loading;
