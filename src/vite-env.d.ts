/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COMMIT_HASH: string;
  readonly VITE_COMMIT_DATE: string;
  readonly VITE_MEASUREMENT_ID?: string;
  readonly VITE_DISABLE_ANALYTICS?: string;
  readonly VITE_DISABLE_STATS?: string;
  readonly VITE_DISCLAIMER_URL?: string;
  readonly VITE_GTAG_DEBUG?: string;
}

interface Window {
  soraUserscriptReady?: (version?: string) => void;
}
