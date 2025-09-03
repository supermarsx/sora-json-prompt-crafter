import React, { useEffect, useState, useCallback } from 'react';
import {
  Sun,
  Moon,
  Heart,
  Github,
  Star,
  GitFork,
  Bug,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner-toast';
import { ControlPanel } from './ControlPanel';
import { ShareModal } from './ShareModal';
import { ProgressBar } from './ProgressBar';
import { ActionBar } from './ActionBar';
import HistoryPanel, { HistoryEntry } from './HistoryPanel';
import ImportModal from './ImportModal';
import Footer from './Footer';
import DisclaimerModal from './DisclaimerModal';
import GeneratedJson from './GeneratedJson';
import { useIsSingleColumn } from '@/hooks/use-single-column';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useDarkModeToggleVisibility } from '@/hooks/use-dark-mode-toggle-visibility';
import { useTracking } from '@/hooks/use-tracking';
import { useSoraTools } from '@/hooks/use-sora-tools';
import { useHeaderVisibility } from '@/hooks/use-header-visibility';
import { useHeaderButtons } from '@/hooks/use-header-buttons';
import { useLogo } from '@/hooks/use-logo';
import { useActionLabels } from '@/hooks/use-action-labels';
import { useCoreActionLabels } from '@/hooks/use-core-action-labels';
import { useFloatingJson } from '@/hooks/use-floating-json';
import { useSoraUserscript } from '@/hooks/use-sora-userscript';
import { useActionHistory } from '@/hooks/use-action-history';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useKeyboardShortcutsEnabled } from '@/hooks/use-keyboard-shortcuts-enabled';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { trackShare } from '@/lib/share-counter';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { generateJson } from '@/lib/generateJson';
import type { SoraOptions } from '@/lib/soraOptions';
import { loadOptionsFromJson } from '@/lib/loadOptionsFromJson';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { OPTION_FLAG_MAP } from '@/lib/optionFlagMap';
import { isValidOptions } from '@/lib/validateOptions';
import { safeGet, safeSet } from '@/lib/storage';
import { getOptionsFromUrl } from '@/lib/urlOptions';
import { USERSCRIPT_VERSION } from '@/version';
import { useGithubStats } from '@/hooks/use-github-stats';
import { useClipboard } from '@/hooks/use-clipboard';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale';
import {
  CURRENT_JSON,
  JSON_HISTORY,
  JSON_COPY_COUNT,
  JSON_COPY_MILESTONES,
  UNDO_COUNT,
  UNDO_MILESTONES,
  REDO_COUNT,
  REDO_MILESTONES,
} from '@/lib/storage-keys';
import { useOnlineStatus } from '@/hooks/use-online-status';

const COPY_MILESTONES: [number, AnalyticsEvent][] = [
  [10, AnalyticsEvent.CopyJson10],
  [25, AnalyticsEvent.CopyJson25],
  [50, AnalyticsEvent.CopyJson50],
  [100, AnalyticsEvent.CopyJson100],
  [200, AnalyticsEvent.CopyJson200],
  [500, AnalyticsEvent.CopyJson500],
  [1000, AnalyticsEvent.CopyJson1000],
  [2000, AnalyticsEvent.CopyJson2000],
  [5000, AnalyticsEvent.CopyJson5000],
  [10000, AnalyticsEvent.CopyJson10000],
];

const getTitleFromJson = (json: string): string => {
  try {
    const obj = JSON.parse(json) as { prompt?: string };
    if (obj && typeof obj.prompt === 'string') {
      return obj.prompt.split(/\s+/).slice(0, 5).join(' ');
    }
  } catch {
    /* ignore */
  }
  return 'Untitled';
};

const UNDO_MILESTONE_EVENTS: [number, AnalyticsEvent][] = [
  [100, AnalyticsEvent.Undo100],
  [500, AnalyticsEvent.Undo500],
  [1000, AnalyticsEvent.Undo1000],
  [10000, AnalyticsEvent.Undo10000],
];

const REDO_MILESTONE_EVENTS: [number, AnalyticsEvent][] = [
  [100, AnalyticsEvent.Redo100],
  [500, AnalyticsEvent.Redo500],
  [1000, AnalyticsEvent.Redo1000],
  [10000, AnalyticsEvent.Redo10000],
];

/**
 * Main dashboard view orchestrating option state, JSON generation and UI panels.
 * Initializes options, reacts to user interactions, and renders the prompt
 * crafting interface along with history, sharing and auxiliary controls.
 */
const Dashboard = () => {
  const { t } = useTranslation();
  useLocale();
  const isOnline = useOnlineStatus();
  const [offlineDismissed, setOfflineDismissed] = useState(false);
  /**
   * Initialize Sora options from the URL or local storage.
   * Falls back to default options if no saved state is found or parsing fails.
   *
   * @returns {SoraOptions} Resolved starting options for the app.
   */
  const initializeOptions = () => {
    try {
      const fromUrl = getOptionsFromUrl();
      if (fromUrl) return fromUrl;
      const stored = safeGet(CURRENT_JSON);
      if (stored) {
        const parsed = loadOptionsFromJson(stored);
        if (parsed) return parsed;
      }
      return DEFAULT_OPTIONS;
    } catch (error) {
      console.error('Error initializing options:', error);
      return DEFAULT_OPTIONS;
    }
  };

  const initialOptions = initializeOptions();

  const {
    state: options,
    setState: setOptions,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useUndoRedo<SoraOptions>(() => initialOptions);

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState(() =>
    generateJson(initialOptions),
  );

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    (safeGet<HistoryEntry[]>(JSON_HISTORY, [], true) ?? []).map((e) => ({
      favorite: false,
      title: e.title ?? getTitleFromJson(e.json),
      ...e,
    })),
  );
  const isSingleColumn = useIsSingleColumn();
  const [darkMode, setDarkMode] = useDarkMode();
  const [trackingEnabled, setTrackingEnabled] = useTracking();
  const [soraToolsEnabled, setSoraToolsEnabled] = useSoraTools();
  const [headerVisible, setHeaderVisible] = useHeaderVisibility();
  const [headerButtonsEnabled, setHeaderButtonsEnabled] = useHeaderButtons();
  const [logoEnabled, setLogoEnabled] = useLogo();
  const [darkModeToggleVisible, setDarkModeToggleVisible] =
    useDarkModeToggleVisibility();
  const [floatingJsonEnabled, setFloatingJsonEnabled] = useFloatingJson();
  const [actionLabelsEnabled, setActionLabelsEnabled] = useActionLabels();
  const [coreActionLabelsOnly, setCoreActionLabelsOnly] = useCoreActionLabels();
  const [userscriptInstalled, userscriptVersion] = useSoraUserscript();
  const actionHistory = useActionHistory();
  const githubStats = useGithubStats();
  const { copy } = useClipboard();

  const [shortcutsEnabled, setShortcutsEnabled] =
    useKeyboardShortcutsEnabled();

  useEffect(() => {
    const timer = setTimeout(
      () => trackEvent(trackingEnabled, AnalyticsEvent.Stay3Min),
      3 * 60 * 1000,
    );
    return () => {
      clearTimeout(timer);
    };
  }, [trackingEnabled]);

  useEffect(() => {
    safeSet(JSON_HISTORY, history, true);
  }, [history]);

  useEffect(() => {
    safeSet(CURRENT_JSON, jsonString);
  }, [jsonString, trackingEnabled]);

  const firstLoadRef = React.useRef(true);
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      const stored = safeGet(CURRENT_JSON);
      if (stored) return;
    }
    try {
      const json = generateJson(options);
      setJsonString(json);
      safeSet(CURRENT_JSON, json);
    } catch (error) {
      console.error('Error generating JSON:', error);
      setJsonString('{}');
    }
  }, [options]);

  /**
   * Copy the generated JSON string to the clipboard and persist it in history.
   *
   * Side effects: updates `copied` and `history` state and logs analytics.
   */
  const copyToClipboard = async () => {
    const success = await copy(jsonString, t('jsonCopied'));
    if (success) {
      setCopied(true);
      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        json: jsonString,
        favorite: false,
        title: getTitleFromJson(jsonString),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 100));
      const opts = options as unknown as Record<string, unknown>;
      const sections = Object.keys(options).filter(
        (key) => key.startsWith('use_') && opts[key],
      );
      trackEvent(trackingEnabled, AnalyticsEvent.CopyJson, {
        sections: sections.join(','),
      });
      try {
        const count =
          (safeGet<number>(JSON_COPY_COUNT, 0, true) as number) ?? 0;
        const newCount = count + 1;
        safeSet(JSON_COPY_COUNT, newCount, true);
        const milestones =
          (safeGet<number[]>(JSON_COPY_MILESTONES, [], true) as number[]) ?? [];
        for (const [threshold, event] of COPY_MILESTONES) {
          if (newCount >= threshold && !milestones.includes(threshold)) {
            trackEvent(trackingEnabled, event);
            toast.success(t('milestoneReached', { threshold }));
            milestones.push(threshold);
          }
        }
        safeSet(JSON_COPY_MILESTONES, milestones, true);
      } catch {
        console.error('Copy counter: There was an error.');
      }
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * Clear the current JSON output and notify the user.
   *
   * Side effects: resets `jsonString`, shows a toast, and tracks analytics.
   */
  const clearJson = () => {
    setJsonString('{}');
    toast.success(t('jsonCleared'));
    trackEvent(trackingEnabled, AnalyticsEvent.ClearJson);
  };

  /**
   * Open the share modal for the current JSON content.
   *
   * Side effects: toggles modal state and logs analytics.
   */
  const shareJson = () => {
    setShowShareModal(true);
    trackShare(trackingEnabled, AnalyticsEvent.ShareButton);
  };

  /**
   * Open the Sora site in a new window and repeatedly post the JSON payload
   * until an acknowledgement is received.
   *
   * Side effects: opens a window, sets timers/listeners, and logs analytics.
   */
  const sendToSora = () => {
    const win = window.open('https://sora.chatgpt.com', '_blank', 'noopener');
    if (!win) return;
    const nonce = crypto.randomUUID();
    const payload = {
      type: 'INSERT_SORA_JSON',
      json: JSON.parse(jsonString),
      nonce,
    } as const;
    const start = () => {
      const intervalId = setInterval(() => {
        win.postMessage(payload, 'https://sora.chatgpt.com');
      }, 250);
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        window.removeEventListener('message', ackHandler);
      }, 10000);
      const ackHandler = (event: MessageEvent) => {
        if (
          event.source === win &&
          event.origin === 'https://sora.chatgpt.com' &&
          event.data?.type === 'INSERT_SORA_JSON_ACK' &&
          event.data?.nonce === nonce
        ) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          window.removeEventListener('message', ackHandler);
        }
      };
      window.addEventListener('message', ackHandler);
    };
    setTimeout(start, 500);
    trackEvent(trackingEnabled, AnalyticsEvent.SendToSora);
  };

  /**
   * Import options from a JSON string and merge them into the current state.
   *
   * @param {string} json - Stringified options to import.
   * Side effects: updates options, closes modal, shows toast, and tracks analytics.
   */
  const importJson = (json: string) => {
    try {
      const obj = JSON.parse(json);
      if (!isValidOptions(obj)) throw new Error('invalid');
      setOptions((prev) => ({ ...prev, ...obj }));
      setShowImportModal(false);
      toast.success(t('jsonImported'));
      trackEvent(trackingEnabled, AnalyticsEvent.ImportButton);
    } catch {
      toast.error(t('invalidJson'));
    }
  };

  /**
   * Reset options to their default values.
   *
   * Side effects: resets state, shows toast, and logs analytics.
   */
  const resetJson = () => {
    // Reset to default options
    reset(DEFAULT_OPTIONS);
    toast.success(t('settingsReset'));
    trackEvent(trackingEnabled, AnalyticsEvent.ResetButton);
  };

  /**
   * Generate a new random seed to refresh the JSON output.
   *
   * Side effects: updates `seed`, shows toast, and tracks analytics.
   */
  const regenerateJson = () => {
    setOptions((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 10000),
    }));
    toast.success(t('jsonRegenerated'));
    trackEvent(trackingEnabled, AnalyticsEvent.RegenerateButton);
  };

  /**
   * Apply a random assortment of option values for experimentation.
   *
   * Side effects: mutates option state with random values, shows toast, and logs analytics.
   */
  const randomizeJson = () => {
    const randomOptions: Partial<SoraOptions> = {
      seed: Math.floor(Math.random() * 10000),
      steps: Math.floor(Math.random() * 31) + 20,
      guidance_scale: Math.random() * 12 + 3,
      quality: ['defective', 'poor', 'moderate', 'high', 'excellent'][
        Math.floor(Math.random() * 5)
      ] as SoraOptions['quality'],
      temperature: Math.random() * 0.5 + 0.8,
      motion_strength: Math.random(),
    };

    setOptions((prev) => ({ ...prev, ...randomOptions }));
    toast.success(t('optionsRandomized'));
    trackEvent(trackingEnabled, AnalyticsEvent.RandomizeButton);
  };

  const handleUndoAction = useCallback(() => {
    undo();
    trackEvent(trackingEnabled, AnalyticsEvent.UndoButton);
    try {
      const count = (safeGet<number>(UNDO_COUNT, 0, true) as number) ?? 0;
      const newCount = count + 1;
      safeSet(UNDO_COUNT, newCount, true);
      const milestones =
        (safeGet<number[]>(UNDO_MILESTONES, [], true) as number[]) ?? [];
      for (const [threshold, event] of UNDO_MILESTONE_EVENTS) {
        if (newCount >= threshold && !milestones.includes(threshold)) {
          trackEvent(trackingEnabled, event);
          toast.success(t('milestoneReached', { threshold }));
          milestones.push(threshold);
        }
      }
      safeSet(UNDO_MILESTONES, milestones, true);
    } catch {
      console.error('Undo counter: There was an error.');
    }
  }, [undo, trackingEnabled, t]);

  const handleRedoAction = useCallback(() => {
    redo();
    trackEvent(trackingEnabled, AnalyticsEvent.RedoButton);
    try {
      const count = (safeGet<number>(REDO_COUNT, 0, true) as number) ?? 0;
      const newCount = count + 1;
      safeSet(REDO_COUNT, newCount, true);
      const milestones =
        (safeGet<number[]>(REDO_MILESTONES, [], true) as number[]) ?? [];
      for (const [threshold, event] of REDO_MILESTONE_EVENTS) {
        if (newCount >= threshold && !milestones.includes(threshold)) {
          trackEvent(trackingEnabled, event);
          toast.success(t('milestoneReached', { threshold }));
          milestones.push(threshold);
        }
      }
      safeSet(REDO_MILESTONES, milestones, true);
    } catch {
      console.error('Redo counter: There was an error.');
    }
  }, [redo, trackingEnabled, t]);

  /**
   * Shallow merge updates into the options state and track changed keys.
   *
   * @param {Partial<SoraOptions>} updates - Option fields to update.
   * Side effects: updates options state and logs analytics for changes.
   */
  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions((prev) => {
      const changedKeys = Object.keys(updates).filter((key) => {
        const newValue = updates[key as keyof SoraOptions];
        return newValue !== prev[key as keyof SoraOptions];
      });

      const next = { ...prev, ...updates };

      if (changedKeys.length > 0) {
        trackEvent(trackingEnabled, AnalyticsEvent.OptionsChange, {
          keys: changedKeys.join(','),
        });
      }

      return next;
    });
  };

  /**
   * Update a nested option value using a dot-separated path.
   *
   * @param {string} path - Dot notation path to the option.
   * @param {unknown} value - New value to assign.
   * Side effects: updates options state and logs input change.
   */
  const updateNestedOptions = (path: string, value: unknown) => {
    setOptions((prev) => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = newOptions;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key === '__proto__' || key === 'constructor') {
          console.warn(`Blocked unsafe property name: ${key}`);
          return prev; // Return previous state to avoid unsafe modification
        }
        const val = current[key];
        current[key] = typeof val === 'object' && val ? { ...val } : {};
        current = current[key] as Record<string, unknown>;
      }

      const lastKey = keys[keys.length - 1];
      if (lastKey === '__proto__' || lastKey === 'constructor') {
        console.warn(`Blocked unsafe property name: ${lastKey}`);
        return prev; // Return previous state to avoid unsafe modification
      }
      current[lastKey] = value;
      trackEvent(trackingEnabled, AnalyticsEvent.InputChange);
      return newOptions;
    });
  };

  /**
   * Remove a history entry.
   *
   * @param {number} id - Identifier of the entry to remove.
   * Side effects: updates history state.
   */
  const deleteHistoryEntry = (id: number) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  /**
   * Clear all stored history entries.
   *
   * Side effects: resets history state.
   */
  const clearHistory = () => setHistory([]);

  /**
   * Copy a JSON history entry to the clipboard.
   *
   * @param {string} json - JSON string to copy.
   * Side effects: logs analytics when successful.
   */
  const copyHistoryEntry = async (json: string) => {
    const success = await copy(json, t('jsonCopied'));
    if (success) {
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryCopy);
    }
  };

  /**
   * Load a history JSON entry into the editor, enabling relevant sections.
   *
   * @param {string} json - JSON string representing options to load.
   * Side effects: updates options, scrolls view, and logs analytics.
   */
  const editHistoryEntry = (json: string) => {
    try {
      const obj = JSON.parse(json);
      if (!isValidOptions(obj)) throw new Error('invalid');
      const enableMap = OPTION_FLAG_MAP;

      const allFlags = Object.keys(DEFAULT_OPTIONS).filter((k) =>
        k.startsWith('use_'),
      );
      const clearFlags: Partial<SoraOptions> = {};
      allFlags.forEach((k) => {
        clearFlags[k as keyof SoraOptions] = false;
      });

      const flagUpdates: Partial<SoraOptions> = {};
      Object.keys(obj).forEach((key) => {
        const flag = enableMap[key as keyof typeof enableMap];
        if (flag) flagUpdates[flag as keyof SoraOptions] = true;
        if (key.startsWith('dnd_')) flagUpdates.use_dnd_section = true;
        if (key === 'width' || key === 'height')
          flagUpdates.use_dimensions = true;
      });
      setJsonString('{}');
      setOptions((prev) => ({
        ...prev,
        ...clearFlags,
        ...obj,
        ...flagUpdates,
      }));
      document
        .getElementById('generated-json')
        ?.scrollIntoView({ behavior: 'smooth' });
      trackEvent(trackingEnabled, AnalyticsEvent.SelectedJsonPrompt);
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryEdit);
    } catch {
      toast.error(t('invalidJson'));
    }
  };

  /**
   * Import multiple history entries into the history list.
   *
   * @param entries - Array of objects containing JSON and optional title.
   * Side effects: updates history state and logs analytics.
   */
  const importHistoryEntries = (entries: { json: string; title?: string }[]) => {
    const mapped = entries.map(({ json, title }) => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleString(),
      json,
      favorite: false,
      title: title ?? getTitleFromJson(json),
    }));
    setHistory((prev) => [...mapped, ...prev].slice(0, 100));
    trackEvent(trackingEnabled, AnalyticsEvent.HistoryImport, { type: 'bulk' });
  };

  /**
   * Toggle favorite state for a history entry by id.
   *
   * @param {number} id - Entry identifier.
   */
  const toggleFavorite = (id: number) => {
    setHistory((prev) =>
      prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)),
    );
  };

  /**
   * Rename a history entry by id.
   */
  const renameHistoryEntry = (id: number, title: string) => {
    setHistory((prev) => prev.map((e) => (e.id === id ? { ...e, title } : e)));
  };

  /**
   * Scroll the page to the generated JSON section.
   */
    const scrollToJson = () => {
      document
        .getElementById('generated-json')
        ?.scrollIntoView({ behavior: 'smooth' });
    };

    useKeyboardShortcuts(
      {
        onCopy: copyToClipboard,
        onUndo: handleUndoAction,
        onRedo: handleRedoAction,
      },
      shortcutsEnabled,
    );

    return (
      <div className="min-h-screen flex flex-col bg-background">
        {!isOnline && !offlineDismissed && (
        <div className="bg-yellow-500 text-black p-2 text-center">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <span>{t('offlineNotice', { defaultValue: 'You are offline' })}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOfflineDismissed(true)}
            >
              {t('dismiss', { defaultValue: 'Dismiss' })}
            </Button>
          </div>
        </div>
      )}
      <div className="container mx-auto p-6 flex flex-col flex-1">
        {headerVisible && (
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 select-none">
                {logoEnabled && (
                  <img
                    src="/web-app-manifest-512x512.png"
                    alt=""
                    role="presentation"
                    className="w-10 h-10 animate-rainbow dark:animate-rainbow-dark"
                  />
                )}
                {t('appName')}
              </h1>
              <p className="text-muted-foreground select-none">{t('tagline')}</p>
              {headerButtonsEnabled && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <a
                          href="https://github.com/sponsors/supermarsx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.ClickSponsor)
                        }
                      >
                        <Heart className="w-4 h-4" /> {t('sponsor')}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('sponsor')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a
                        href="https://github.com/supermarsx/sora-json-prompt-crafter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.SeeGithub)
                        }
                      >
                        <Github className="w-4 h-4" /> {t('github')}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('github')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a
                        href="https://github.com/supermarsx/sora-json-prompt-crafter"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.StarGithub)
                        }
                      >
                        <Star className="w-4 h-4" />
                        {t('star')}
                        {githubStats?.stars ? ` ${githubStats.stars}` : ''}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('star')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a
                        href="https://github.com/supermarsx/sora-json-prompt-crafter/fork"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.ForkGithub)
                        }
                      >
                        <GitFork className="w-4 h-4" />
                        {t('fork')}
                        {githubStats?.forks ? ` ${githubStats.forks}` : ''}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('fork')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a
                        href="https://github.com/supermarsx/sora-json-prompt-crafter/issues/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.OpenIssues)
                        }
                      >
                        <Bug className="w-4 h-4" />
                        {t('issues')}
                        {githubStats?.issues ? ` ${githubStats.issues}` : ''}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('issues')}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a
                        href="https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                        onClick={() =>
                          trackEvent(trackingEnabled, AnalyticsEvent.ViewOnLovable)
                        }
                      >
                        <Heart className="w-4 h-4" />
                        {t('viewOnLovable')}
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('viewOnLovable')}</TooltipContent>
                </Tooltip>
                {soraToolsEnabled && !userscriptInstalled && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild variant="outline" size="sm" className="gap-1">
                        <a
                          href="/sora-userscript.user.js"
                          className="flex items-center gap-1"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent(
                              trackingEnabled,
                              AnalyticsEvent.InstallUserscript,
                            )
                          }
                        >
                          <Download className="w-4 h-4" />
                          {t('installUserscript')}
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('installUserscript')}</TooltipContent>
                  </Tooltip>
                )}
                {soraToolsEnabled &&
                  userscriptInstalled &&
                  userscriptVersion !== USERSCRIPT_VERSION && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="sm" className="gap-1">
                          <a
                            href="/sora-userscript.user.js"
                            className="flex items-center gap-1"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent(
                                trackingEnabled,
                                AnalyticsEvent.UpdateUserscript,
                              )
                            }
                          >
                            <RefreshCw className="w-4 h-4" />
                            {t('updateUserscript')}
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t('updateUserscript')}</TooltipContent>
                    </Tooltip>
                  )}
              </div>
            )}
            <p className="text-xs mt-2 text-muted-foreground">
              {t('agreeToDisclaimer')}{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setShowDisclaimer(true);
                      trackEvent(trackingEnabled, AnalyticsEvent.OpenDisclaimer);
                    }}
                    className="underline"
                  >
                    {t('fullDisclaimer')}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t('fullDisclaimer')}</TooltipContent>
              </Tooltip>
            </p>
          </div>
          {darkModeToggleVisible && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setDarkMode(!darkMode);
                    trackEvent(trackingEnabled, AnalyticsEvent.DarkModeToggle, {
                      enabled: !darkMode,
                    });
                  }}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle dark mode</TooltipContent>
            </Tooltip>
          )}
        </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 flex-1">
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {t('generationSettings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ControlPanel
                  options={options}
                  updateOptions={updateOptions}
                  updateNestedOptions={updateNestedOptions}
                  trackingEnabled={trackingEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {(!isSingleColumn || !floatingJsonEnabled) && (
            <Card
              id="generated-json"
              className="flex flex-col lg:sticky lg:top-4 lg:max-h-[calc(100vh-1rem)]"
            >
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t('generatedJsonPrompt')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <GeneratedJson
                  json={jsonString}
                  trackingEnabled={trackingEnabled}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {isSingleColumn && floatingJsonEnabled && (
        <div className="fixed bottom-0 left-0 right-0 z-40 h-[40vh] max-h-[50vh] border-t bg-background">
          <GeneratedJson json={jsonString} trackingEnabled={trackingEnabled} />
        </div>
      )}

      <ActionBar
        onUndo={handleUndoAction}
        onRedo={handleRedoAction}
        canUndo={canUndo}
        canRedo={canRedo}
        onCopy={copyToClipboard}
        onClear={clearJson}
        onShare={shareJson}
        onSendToSora={sendToSora}
        userscriptInstalled={userscriptInstalled}
        onImport={() => setShowImportModal(true)}
        onHistory={() => setShowHistory(true)}
        onReset={resetJson}
        onRegenerate={regenerateJson}
        onRandomize={randomizeJson}
        trackingEnabled={trackingEnabled}
        soraToolsEnabled={soraToolsEnabled}
        onToggleSoraTools={() => setSoraToolsEnabled(!soraToolsEnabled)}
        onToggleTracking={() => setTrackingEnabled(!trackingEnabled)}
        headerVisible={headerVisible}
        onToggleHeaderVisible={() => setHeaderVisible(!headerVisible)}
        headerButtonsEnabled={headerButtonsEnabled}
        onToggleHeaderButtons={() =>
          setHeaderButtonsEnabled(!headerButtonsEnabled)
        }
        logoEnabled={logoEnabled}
        onToggleLogo={() => setLogoEnabled(!logoEnabled)}
        darkModeToggleVisible={darkModeToggleVisible}
        onToggleDarkModeToggleVisible={() =>
          setDarkModeToggleVisible(!darkModeToggleVisible)
        }
        floatingJsonEnabled={floatingJsonEnabled}
        onToggleFloatingJson={() =>
          setFloatingJsonEnabled(!floatingJsonEnabled)
        }
        shortcutsEnabled={shortcutsEnabled}
        onToggleShortcuts={() =>
          setShortcutsEnabled(!shortcutsEnabled)
        }
        actionLabelsEnabled={actionLabelsEnabled}
        onToggleActionLabels={() =>
          setActionLabelsEnabled(!actionLabelsEnabled)
        }
        coreActionLabelsOnly={coreActionLabelsOnly}
        onToggleCoreActionLabels={() =>
          setCoreActionLabelsOnly(!coreActionLabelsOnly)
        }
        copied={copied}
        showJumpToJson={isSingleColumn && !floatingJsonEnabled}
        onJumpToJson={scrollToJson}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jsonContent={jsonString}
        options={options}
      />
      <HistoryPanel
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        actionHistory={actionHistory}
        onDelete={deleteHistoryEntry}
        onClear={clearHistory}
        onCopy={copyHistoryEntry}
        onEdit={editHistoryEntry}
        onImport={importHistoryEntries}
        onToggleFavorite={toggleFavorite}
        onRename={renameHistoryEntry}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={importJson}
      />
      <DisclaimerModal open={showDisclaimer} onOpenChange={setShowDisclaimer} />
      <Footer
        onShowDisclaimer={() => {
          setShowDisclaimer(true);
          trackEvent(trackingEnabled, AnalyticsEvent.OpenDisclaimer);
        }}
      />
      <ProgressBar />
    </div>
  );
};

export default Dashboard;
