import React, { useEffect, useState } from 'react';
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
import { useTracking } from '@/hooks/use-tracking';
import { useSoraTools } from '@/hooks/use-sora-tools';
import { useHeaderButtons } from '@/hooks/use-header-buttons';
import { useLogo } from '@/hooks/use-logo';
import { useActionLabels } from '@/hooks/use-action-labels';
import { useSoraUserscript } from '@/hooks/use-sora-userscript';
import { useActionHistory } from '@/hooks/use-action-history';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { trackEvent } from '@/lib/analytics';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { generateJson } from '@/lib/generateJson';
import type { SoraOptions } from '@/lib/soraOptions';
import { loadOptionsFromJson } from '@/lib/loadOptionsFromJson';
import { OPTION_FLAG_MAP } from '@/lib/optionFlagMap';
import { isValidOptions } from '@/lib/validateOptions';
import { safeGet, safeSet } from '@/lib/storage';
import { USERSCRIPT_VERSION } from '@/version';
import { useGithubStats } from '@/hooks/use-github-stats';
import { useClipboard } from '@/hooks/use-clipboard';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale';

const Dashboard = () => {
  const { t } = useTranslation();
  useLocale();
  const {
    state: options,
    setState: setOptions,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  } = useUndoRedo<SoraOptions>(() => {
    try {
      const stored = safeGet('currentJson');
      if (stored) {
        const parsed = loadOptionsFromJson(stored);
        if (parsed) return parsed;
      }
      return DEFAULT_OPTIONS;
    } catch (error) {
      console.error('Error initializing options:', error);
      return DEFAULT_OPTIONS;
    }
  });

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState(() => {
    const stored = safeGet('currentJson');
    return stored ?? '{}';
  });

  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    safeGet<HistoryEntry[]>('jsonHistory', [], true),
  );
  const isSingleColumn = useIsSingleColumn();
  const [darkMode, setDarkMode] = useDarkMode();
  const [trackingEnabled, setTrackingEnabled] = useTracking();
  const [soraToolsEnabled, setSoraToolsEnabled] = useSoraTools();
  const [headerButtonsEnabled, setHeaderButtonsEnabled] = useHeaderButtons();
  const [logoEnabled, setLogoEnabled] = useLogo();
  const [actionLabelsEnabled, setActionLabelsEnabled] = useActionLabels();
  const [userscriptInstalled, userscriptVersion] = useSoraUserscript();
  const actionHistory = useActionHistory();
  const githubStats = useGithubStats();
  const { copy } = useClipboard();

  useEffect(() => {
    const times = [3, 5, 10, 30, 60];
    const timers = times.map((t) =>
      setTimeout(
        () => trackEvent(trackingEnabled, `stay_${t}min`),
        t * 60 * 1000,
      ),
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [trackingEnabled]);

  useEffect(() => {
    safeSet('jsonHistory', history, true);
  }, [history]);

  useEffect(() => {
    safeSet('currentJson', jsonString);
  }, [jsonString, trackingEnabled]);

  const firstLoadRef = React.useRef(true);
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      const stored = safeGet('currentJson');
      if (stored) return;
    }
    try {
      const json = generateJson(options);
      setJsonString(json);
      safeSet('currentJson', json);
    } catch (error) {
      console.error('Error generating JSON:', error);
      setJsonString('{}');
    }
  }, [options]);

  const copyToClipboard = async () => {
    const success = await copy(jsonString, t('jsonCopied'));
    if (success) {
      setCopied(true);
      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        json: jsonString,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 100));
      const opts = options as unknown as Record<string, unknown>;
      const sections = Object.keys(options).filter(
        (key) => key.startsWith('use_') && opts[key],
      );
      trackEvent(trackingEnabled, 'copy_json', {
        sections: sections.join(','),
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearJson = () => {
    setJsonString('{}');
    toast.success(t('jsonCleared'));
    trackEvent(trackingEnabled, 'clear_json');
  };

  const shareJson = () => {
    setShowShareModal(true);
    trackEvent(trackingEnabled, 'share_button');
  };

  const sendToSora = () => {
    const win = window.open('https://sora.chatgpt.com', '_blank', 'noopener');
    if (!win) return;
    const payload = { type: 'INSERT_SORA_JSON', json: JSON.parse(jsonString) };
    const start = () => {
      const intervalId = setInterval(() => {
        win.postMessage(payload, '*');
      }, 250);
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        window.removeEventListener('message', ackHandler);
      }, 10000);
      const ackHandler = (event: MessageEvent) => {
        if (
          event.source === win &&
          event.data?.type === 'INSERT_SORA_JSON_ACK'
        ) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          window.removeEventListener('message', ackHandler);
        }
      };
      window.addEventListener('message', ackHandler);
    };
    setTimeout(start, 500);
    trackEvent(trackingEnabled, 'send_to_sora');
  };

  const importJson = (json: string) => {
    try {
      const obj = JSON.parse(json);
      if (!isValidOptions(obj)) throw new Error('invalid');
      setOptions((prev) => ({ ...prev, ...obj }));
      setShowImportModal(false);
      toast.success(t('jsonImported'));
      trackEvent(trackingEnabled, 'import_button');
    } catch {
      toast.error(t('invalidJson'));
    }
  };

  const resetJson = () => {
    // Reset to default options
    reset(DEFAULT_OPTIONS);
    toast.success(t('settingsReset'));
    trackEvent(trackingEnabled, 'reset_button');
  };

  const regenerateJson = () => {
    setOptions((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 10000),
    }));
    toast.success(t('jsonRegenerated'));
    trackEvent(trackingEnabled, 'regenerate_button');
  };

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
    trackEvent(trackingEnabled, 'randomize_button');
  };

  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions((prev) => {
      const changedKeys = Object.keys(updates).filter((key) => {
        const newValue = updates[key as keyof SoraOptions];
        return newValue !== prev[key as keyof SoraOptions];
      });

      const next = { ...prev, ...updates };

      if (changedKeys.length > 0) {
        trackEvent(trackingEnabled, 'options_change', {
          keys: changedKeys.join(','),
        });
      }

      return next;
    });
  };

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
      trackEvent(trackingEnabled, 'input_change');
      return newOptions;
    });
  };

  const deleteHistoryEntry = (id: number) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  const clearHistory = () => setHistory([]);

  const copyHistoryEntry = async (json: string) => {
    const success = await copy(json, t('jsonCopied'));
    if (success) {
      trackEvent(trackingEnabled, 'history_copy');
    }
  };

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
      trackEvent(trackingEnabled, 'selected_json_prompt');
      trackEvent(trackingEnabled, 'history_edit');
    } catch {
      toast.error(t('invalidJson'));
    }
  };

  const importHistoryEntries = (jsons: string[]) => {
    const entries = jsons.map((j) => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleString(),
      json: j,
    }));
    setHistory((prev) => [...entries, ...prev].slice(0, 100));
    trackEvent(trackingEnabled, 'history_import', { type: 'bulk' });
  };

  const scrollToJson = () => {
    document
      .getElementById('generated-json')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto p-6 flex flex-col flex-1">
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
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://github.com/sponsors/supermarsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() => trackEvent(trackingEnabled, 'click_sponsor')}
                  >
                    <Heart className="w-4 h-4" /> {t('sponsor')}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://github.com/supermarsx/sora-json-prompt-crafter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() => trackEvent(trackingEnabled, 'see_github')}
                  >
                    <Github className="w-4 h-4" /> {t('github')}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://github.com/supermarsx/sora-json-prompt-crafter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() => trackEvent(trackingEnabled, 'star_github')}
                  >
                    <Star className="w-4 h-4" />
                    {t('star')}
                    {githubStats?.stars ? ` ${githubStats.stars}` : ''}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://github.com/supermarsx/sora-json-prompt-crafter/fork"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() => trackEvent(trackingEnabled, 'fork_github')}
                  >
                    <GitFork className="w-4 h-4" />
                    {t('fork')}
                    {githubStats?.forks ? ` ${githubStats.forks}` : ''}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://github.com/supermarsx/sora-json-prompt-crafter/issues/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() => trackEvent(trackingEnabled, 'open_issues')}
                  >
                    <Bug className="w-4 h-4" />
                    {t('issues')}
                    {githubStats?.issues ? ` ${githubStats.issues}` : ''}
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <a
                    href="https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                    onClick={() =>
                      trackEvent(trackingEnabled, 'view_on_lovable')
                    }
                  >
                    <Heart className="w-4 h-4" />
                    {t('viewOnLovable')}
                  </a>
                </Button>
                {soraToolsEnabled && !userscriptInstalled && (
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <a
                      href="/sora-userscript.user.js"
                      className="flex items-center gap-1"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent(trackingEnabled, 'install_userscript')
                      }
                    >
                      <Download className="w-4 h-4" />
                      {t('installUserscript')}
                    </a>
                  </Button>
                )}
                {soraToolsEnabled &&
                  userscriptInstalled &&
                  userscriptVersion !== USERSCRIPT_VERSION && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <a
                        href="/sora-userscript.user.js"
                        className="flex items-center gap-1"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent(trackingEnabled, 'update_userscript')
                        }
                      >
                        <RefreshCw className="w-4 h-4" />
                        {t('updateUserscript')}
                      </a>
                    </Button>
                  )}
              </div>
            )}
            <p className="text-xs mt-2 text-muted-foreground">
              {t('agreeToDisclaimer')}{' '}
              <button
                onClick={() => {
                  setShowDisclaimer(true);
                  trackEvent(trackingEnabled, 'open_disclaimer');
                }}
                className="underline"
              >
                {t('fullDisclaimer')}
              </button>
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setDarkMode(!darkMode);
              trackEvent(trackingEnabled, 'dark_mode_toggle', {
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
        </div>

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
        </div>
      </div>

      <ActionBar
        onUndo={undo}
        onRedo={redo}
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
        headerButtonsEnabled={headerButtonsEnabled}
        onToggleHeaderButtons={() =>
          setHeaderButtonsEnabled(!headerButtonsEnabled)
        }
        logoEnabled={logoEnabled}
        onToggleLogo={() => setLogoEnabled(!logoEnabled)}
        actionLabelsEnabled={actionLabelsEnabled}
        onToggleActionLabels={() =>
          setActionLabelsEnabled(!actionLabelsEnabled)
        }
        copied={copied}
        showJumpToJson={isSingleColumn}
        onJumpToJson={scrollToJson}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jsonContent={jsonString}
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
          trackEvent(trackingEnabled, 'open_disclaimer');
        }}
      />
      <ProgressBar />
    </div>
  );
};

export default Dashboard;
