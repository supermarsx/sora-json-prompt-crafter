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
      className="flex h-screen w-screen items-center justify-center transition-opacity duration-50"
      role="status"
    >
      <Loader2 className="h-10 w-10 animate-spin bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" />
      <span className="ml-3 text-lg font-medium">{t('loading')}</span>
    </div>
  );
};

export default Loading;
