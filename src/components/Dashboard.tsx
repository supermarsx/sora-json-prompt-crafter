import React, { useState, useEffect } from 'react';
import { diffChars, Change } from 'diff';
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
import { useIsSingleColumn } from '@/hooks/use-single-column';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useTracking } from '@/hooks/use-tracking';
import { useSoraTools } from '@/hooks/use-sora-tools';
import { useHeaderButtons } from '@/hooks/use-header-buttons';
import { useLogo } from '@/hooks/use-logo';
import { useSoraUserscript } from '@/hooks/use-sora-userscript';
import { useActionHistory } from '@/hooks/use-action-history';
import { trackEvent } from '@/lib/analytics';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { generateJson } from '@/lib/generateJson';
import type { SoraOptions } from '@/lib/soraOptions';
import { loadOptionsFromJson } from '@/lib/loadOptionsFromJson';
import { OPTION_FLAG_MAP } from '@/lib/optionFlagMap';
import { isValidOptions } from '@/lib/validateOptions';
import { safeGet, safeSet } from '@/lib/storage';
import { DISABLE_STATS, USERSCRIPT_VERSION } from '@/lib/config';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale';

const Dashboard = () => {
  const { t } = useTranslation();
  useLocale();
  const [options, setOptions] = useState<SoraOptions>(() => {
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
  const jsonContainerRef = React.useRef<HTMLDivElement>(null);
  const prevJsonRef = React.useRef(jsonString);
  const [diffParts, setDiffParts] = useState<Change[] | null>(null);
  const isSingleColumn = useIsSingleColumn();
  const [darkMode, setDarkMode] = useDarkMode();
  const [trackingEnabled, setTrackingEnabled] = useTracking();
  const [soraToolsEnabled, setSoraToolsEnabled] = useSoraTools();
  const [headerButtonsEnabled, setHeaderButtonsEnabled] = useHeaderButtons();
  const [logoEnabled, setLogoEnabled] = useLogo();
  const [userscriptInstalled, userscriptVersion] = useSoraUserscript();
  const actionHistory = useActionHistory();
  const [githubStats, setGithubStats] = useState<{
    stars: number;
    forks: number;
    issues: number;
  }>();

  useEffect(() => {
    if (DISABLE_STATS) return;
    const cached = safeGet<{ stars: number; forks: number; issues: number }>(
      'githubStats',
      null,
      true,
    );
    const cachedTs = safeGet<number>('githubStatsTimestamp', 0, true);
    if (
      cached &&
      typeof cachedTs === 'number' &&
      Date.now() - cachedTs < 3600000
    ) {
      setGithubStats(cached);
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    const loadStats = async () => {
      try {
        const repoRes = await fetch(
          'https://api.github.com/repos/supermarsx/sora-json-prompt-crafter',
          { signal },
        );
        if (!repoRes.ok) {
          throw new Error('non ok');
        }
        const repoData = await repoRes.json();

        const issuesRes = await fetch(
          'https://api.github.com/search/issues?q=repo:supermarsx/sora-json-prompt-crafter+type:issue+state:open',
          { signal },
        );
        if (!issuesRes.ok) {
          throw new Error('non ok');
        }
        const issuesData = await issuesRes.json();

        if (!signal.aborted) {
          const data = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: issuesData.total_count,
          };
          setGithubStats(data);
          safeSet('githubStats', data, true);
          safeSet('githubStatsTimestamp', Date.now(), true);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to load GitHub stats');
        }
      }
    };
    void loadStats();
    return () => {
      controller.abort();
    };
  }, []);

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

  useEffect(() => {
    try {
      const diff = diffChars(prevJsonRef.current, jsonString).filter(
        (p) => !p.removed,
      );
      prevJsonRef.current = jsonString;
      setDiffParts(diff);
      const timer = setTimeout(() => {
        setDiffParts(diff.map((p) => ({ ...p, added: false }) as Change));
      }, 2000);
      trackEvent(trackingEnabled, 'json_changed');
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error processing diff:', error);
    }
  }, [jsonString, trackingEnabled]);

  useEffect(() => {
    const container = jsonContainerRef.current;
    if (!container) return;
    const atBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight,
      ) < 5;
    const atTop = container.scrollTop === 0;
    if (atBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (atTop) {
      container.scrollTop = 0;
    }
  }, [jsonString]);

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
    if (!('clipboard' in navigator)) {
      toast.error('Clipboard not supported');
      return;
    }
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        json: jsonString,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 100));
      toast.success('Sora JSON copied to clipboard!');
      const opts = options as unknown as Record<string, unknown>;
      const sections = Object.keys(options).filter(
        (key) => key.startsWith('use_') && opts[key],
      );
      trackEvent(trackingEnabled, 'copy_json', {
        sections: sections.join(','),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearJson = () => {
    setJsonString('{}');
    toast.success('JSON cleared!');
    trackEvent(trackingEnabled, 'clear_json');
  };

  const shareJson = () => {
    setShowShareModal(true);
    trackEvent(trackingEnabled, 'share_button');
  };

  const sendToSora = () => {
    const win = window.open('https://sora.chatgpt.com', '_blank');
    if (!win) return;
    const payload = { type: 'INSERT_SORA_JSON', json: JSON.parse(jsonString) };
    const start = () => {
      const interval = setInterval(() => {
        win.postMessage(payload, '*');
      }, 250);
      const ackHandler = (event: MessageEvent) => {
        if (
          event.source === win &&
          event.data?.type === 'INSERT_SORA_JSON_ACK'
        ) {
          clearInterval(interval);
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
      toast.success('JSON imported!');
      trackEvent(trackingEnabled, 'import_button');
    } catch {
      toast.error('Invalid JSON');
    }
  };

  const resetJson = () => {
    // Reset to default options
    setOptions(DEFAULT_OPTIONS);
    toast.success('Settings reset to defaults!');
    trackEvent(trackingEnabled, 'reset_button');
  };

  const regenerateJson = () => {
    setOptions((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 10000),
    }));
    toast.success('JSON regenerated with new seed!');
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
    toast.success('Options randomized!');
    trackEvent(trackingEnabled, 'randomize_button');
  };

  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions((prev) => {
      const next = { ...prev, ...updates };
      Object.keys(updates).forEach((key) => {
        const value = updates[key as keyof SoraOptions];
        if (key.startsWith('use_')) {
          if (
            typeof value === 'boolean' &&
            value !== prev[key as keyof SoraOptions]
          ) {
            trackEvent(trackingEnabled, 'section_toggle', {
              section: key,
              enabled: value,
            });
          }
        } else if (key === 'prompt') {
          trackEvent(trackingEnabled, 'prompt_change');
        } else if (key === 'negative_prompt') {
          trackEvent(trackingEnabled, 'negative_prompt_change');
        } else {
          trackEvent(trackingEnabled, 'input_change');
        }
      });
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
    if (!('clipboard' in navigator)) {
      toast.error('Clipboard not supported');
      return;
    }
    try {
      await navigator.clipboard.writeText(json);
      toast.success('Sora JSON copied to clipboard!');
      trackEvent(trackingEnabled, 'history_copy');
    } catch {
      toast.error('Failed to copy to clipboard');
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
      toast.error('Invalid JSON');
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
              Sora JSON Prompt Crafter
            </h1>
            <p className="text-muted-foreground select-none">
              Configure your Sora generation settings and get the perfect JSON
              prompt for stunning AI-generated content.
            </p>
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
                    <Heart className="w-4 h-4" /> Sponsor
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
                    <Github className="w-4 h-4" /> GitHub
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
                    Star{githubStats?.stars ? ` ${githubStats.stars}` : ''}
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
                    Fork{githubStats?.forks ? ` ${githubStats.forks}` : ''}
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
                    Issues{githubStats?.issues ? ` ${githubStats.issues}` : ''}
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
              By using this tool you agree by the{' '}
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
              <div className="h-full overflow-y-auto" ref={jsonContainerRef}>
                <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>
                    {diffParts
                      ? diffParts.map((part, idx) => (
                          <span
                            key={idx}
                            className={
                              part.added ? 'animate-highlight' : undefined
                            }
                          >
                            {part.value}
                          </span>
                        ))
                      : jsonString}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ActionBar
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
