import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale';
import { Button } from '@/components/ui/button';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { safeGet, safeSet } from '@/lib/storage';
import {
  UNDO_COUNT,
  UNDO_MILESTONES,
  REDO_COUNT,
  REDO_MILESTONES,
} from '@/lib/storage-keys';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

import SettingsPanel from './SettingsPanel';
import { useUpdateCheck } from '@/hooks/use-update-check';
import { toast } from '@/components/ui/sonner-toast';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import {
  Copy,
  Check,
  Share,
  Import,
  History,
  RotateCcw,
  RefreshCw,
  Undo2,
  Redo2,
  Shuffle,
  Eye,
  EyeOff,
  Trash2,
  Send,
  Cog,
  Languages,
  ChevronDown,
  ChevronUp,
  MoveDown,
} from 'lucide-react';

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

interface ActionBarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onCopy: () => void;
  onClear: () => void;
  onShare: () => void;
  onSendToSora: () => void;
  userscriptInstalled: boolean;
  onImport: () => void;
  onHistory: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  onRandomize: () => void;
  trackingEnabled: boolean;
  soraToolsEnabled: boolean;
  onToggleSoraTools: () => void;
  onToggleTracking: () => void;
  headerButtonsEnabled: boolean;
  onToggleHeaderButtons: () => void;
  headerVisible: boolean;
  onToggleHeaderVisible: () => void;
  logoEnabled: boolean;
  onToggleLogo: () => void;
  darkModeToggleVisible: boolean;
  onToggleDarkModeToggleVisible: () => void;
  floatingJsonEnabled: boolean;
  onToggleFloatingJson: () => void;
  actionLabelsEnabled: boolean;
  onToggleActionLabels: () => void;
  coreActionLabelsOnly: boolean;
  onToggleCoreActionLabels: () => void;
  copied: boolean;
  showJumpToJson?: boolean;
  onJumpToJson?: () => void;
}
/**
 * Renders a floating toolbar providing prompt controls such as undo/redo,
 * copy, clear, share, import, history access and language selection. Optional
 * buttons can send prompts to Sora, jump to the JSON preview or open settings.
 * Internal handlers manage collapsing the bar into a single restore button.
 *
 * @param props Callbacks and feature flags controlling which actions appear
 * and how they behave.
 * @returns Fixed-position toolbar or, when minimized, a small button that
 * restores the full action bar.
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onCopy,
  onClear,
  onShare,
  onSendToSora,
  userscriptInstalled,
  onImport,
  onHistory,
  onReset,
  onRegenerate,
  onRandomize,
  trackingEnabled,
  soraToolsEnabled,
  onToggleSoraTools,
  onToggleTracking,
  headerButtonsEnabled,
  onToggleHeaderButtons,
  headerVisible,
  onToggleHeaderVisible,
  logoEnabled,
  onToggleLogo,
  darkModeToggleVisible,
  onToggleDarkModeToggleVisible,
  floatingJsonEnabled,
  onToggleFloatingJson,
  actionLabelsEnabled,
  onToggleActionLabels,
  coreActionLabelsOnly,
  onToggleCoreActionLabels,
  copied,
  showJumpToJson,
  onJumpToJson,
}) => {
  const { t } = useTranslation();
  const [locale, setLocale] = useLocale();
  const [minimized, setMinimized] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { checkForUpdate, updateAvailable } = useUpdateCheck();
const { toast: notify } = useToast();

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  useEffect(() => {
    if (updateAvailable) {
      notify({
        title: 'Update available',
        description: 'Refresh the page to load the latest version.',
        action: (
          <ToastAction
            altText="Refresh"
            onClick={() => window.location.reload()}
          >
            Refresh
          </ToastAction>
        ),
      });
    }
  }, [updateAvailable, notify]);

  /**
   * Collapses the action bar to a single restore button and records the
   * associated analytics event.
   */
  const handleMinimize = () => {
    setMinimized(true);
    trackEvent(trackingEnabled, AnalyticsEvent.MinimizeActions);
  };

  /**
   * Restores the full action bar from a minimized state and records the
   * corresponding analytics event.
   */
  const handleRestore = () => {
    setMinimized(false);
    trackEvent(trackingEnabled, AnalyticsEvent.RestoreActions);
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleRestore}
              variant="default"
              size="sm"
              className="gap-1"
            >
              {t('actions')}
              <ChevronUp className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('actions')}</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-md shadow-lg p-3 flex flex-wrap items-center gap-2">
      {soraToolsEnabled && userscriptInstalled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSendToSora}
              variant="outline"
              size="sm"
              className={cn({ 'gap-2': actionLabelsEnabled })}
            >
              <Send className="w-4 h-4" />
              {actionLabelsEnabled && t('sendToSora')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('sendToSora')}</TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              onUndo();
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
            }}
            variant="outline"
            size="sm"
            disabled={!canUndo}
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Undo2 className="w-4 h-4" />
            {actionLabelsEnabled && t('undo')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('undo')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              onRedo();
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
            }}
            variant="outline"
            size="sm"
            disabled={!canRedo}
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Redo2 className="w-4 h-4" />
            {actionLabelsEnabled && t('redo')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('redo')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onCopy}
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {actionLabelsEnabled && t('copy')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('copy')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
          setClearing(true);
          onClear();
          setTimeout(() => setClearing(false), 500);
        }}
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Trash2 className={`w-4 h-4 ${clearing ? 'animate-spin' : ''}`} />
            {actionLabelsEnabled && t('clear')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('clear')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onShare}
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Share className="w-4 h-4" />
            {actionLabelsEnabled && t('share')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('share')}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled && !coreActionLabelsOnly })}
          >
            <Cog className="w-4 h-4" />
            {actionLabelsEnabled && !coreActionLabelsOnly && t('manage')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('manage')}</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn({ 'gap-2': actionLabelsEnabled && !coreActionLabelsOnly })}
              >
                <Languages className="w-4 h-4" />
                {actionLabelsEnabled && !coreActionLabelsOnly && t('language')}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('language')}</TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="max-h-screen sm:max-h-[50vh] overflow-y-auto">
          <DropdownMenuItem
            onSelect={() => setLocale('en-US')}
            className="gap-2"
          >
            <img
              src="/flags/en-US.svg"
              alt="English (United States)"
              className="w-4 h-4"
            />{' '}
            English (United States)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('es-ES')}
            className="gap-2"
          >
            <img
              src="/flags/es-ES.svg"
              alt="Español (España)"
              className="w-4 h-4"
            />{' '}
            Español (España)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('pt-PT')}
            className="gap-2"
          >
            <img
              src="/flags/pt-PT.svg"
              alt="Português (Portugal)"
              className="w-4 h-4"
            />{' '}
            Português (Portugal)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('ru-RU')}
            className="gap-2"
          >
            <img
              src="/flags/ru-RU.svg"
              alt="Русский (Россия)"
              className="w-4 h-4"
            />{' '}
            Русский (Россия)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('pt-BR')}
            className="gap-2"
          >
            <img
              src="/flags/pt-BR.svg"
              alt="Português (Brasil)"
              className="w-4 h-4"
            />{' '}
            Português (Brasil)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('fr-FR')}
            className="gap-2"
          >
            <img
              src="/flags/fr-FR.svg"
              alt="Français (France)"
              className="w-4 h-4"
            />{' '}
            Français (France)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('de-DE')}
            className="gap-2"
          >
            <img
              src="/flags/de-DE.svg"
              alt="Deutsch (Deutschland)"
              className="w-4 h-4"
            />{' '}
            Deutsch (Deutschland)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('zh-CN')}
            className="gap-2"
          >
            <img src="/flags/zh-CN.svg" alt="中文 (中国)" className="w-4 h-4" />{' '}
            中文 (中国)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('it-IT')}
            className="gap-2"
          >
            <img
              src="/flags/it-IT.svg"
              alt="Italiano (Italia)"
              className="w-4 h-4"
            />{' '}
            Italiano (Italia)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('es-MX')}
            className="gap-2"
          >
            <img
              src="/flags/es-MX.svg"
              alt="Español (México)"
              className="w-4 h-4"
            />{' '}
            Español (México)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('en-GB')}
            className="gap-2"
          >
            <img
              src="/flags/en-GB.svg"
              alt="English (United Kingdom)"
              className="w-4 h-4"
            />{' '}
            English (United Kingdom)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('bn-IN')}
            className="gap-2"
          >
            <img
              src="/flags/bn-IN.svg"
              alt="বাংলা (ভারত)"
              className="w-4 h-4"
            />{' '}
            বাংলা (ভারত)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('ja-JP')}
            className="gap-2"
          >
            <img
              src="/flags/ja-JP.svg"
              alt="日本語 (日本)"
              className="w-4 h-4"
            />{' '}
            日本語 (日本)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('en-PR')}
            className="gap-2"
          >
            <img src="/flags/en-PR.svg" alt="Pirate" className="w-4 h-4" />{' '}
            Pirate
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('ko-KR')}
            className="gap-2"
          >
            <img
              src="/flags/ko-KR.svg"
              alt="한국어 (대한민국)"
              className="w-4 h-4"
            />{' '}
            한국어 (대한민국)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('ro-RO')}
            className="gap-2"
          >
            <img
              src="/flags/ro-RO.svg"
              alt="Română (România)"
              className="w-4 h-4"
            />{' '}
            Română (România)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('sv-SE')}
            className="gap-2"
          >
            <img
              src="/flags/sv-SE.svg"
              alt="Svenska (Sverige)"
              className="w-4 h-4"
            />{' '}
            Svenska (Sverige)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('uk-UA')}
            className="gap-2"
          >
            <img
              src="/flags/uk-UA.svg"
              alt="Українська (Україна)"
              className="w-4 h-4"
            />{' '}
            Українська (Україна)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('ne-NP')}
            className="gap-2"
          >
            <img
              src="/flags/ne-NP.svg"
              alt="नेपाली (नेपाल)"
              className="w-4 h-4"
            />{' '}
            नेपाली (नेपाल)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('da-DK')}
            className="gap-2"
          >
            <img
              src="/flags/da-DK.svg"
              alt="Dansk (Danmark)"
              className="w-4 h-4"
            />{' '}
            Dansk (Danmark)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('et-EE')}
            className="gap-2"
          >
            <img
              src="/flags/et-EE.svg"
              alt="Eesti (Eesti)"
              className="w-4 h-4"
            />{' '}
            Eesti (Eesti)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('fi-FI')}
            className="gap-2"
          >
            <img
              src="/flags/fi-FI.svg"
              alt="Suomi (Suomi)"
              className="w-4 h-4"
            />{' '}
            Suomi (Suomi)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('el-GR')}
            className="gap-2"
          >
            <img
              src="/flags/el-GR.svg"
              alt="Ελληνικά (Ελλάδα)"
              className="w-4 h-4"
            />{' '}
            Ελληνικά (Ελλάδα)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('th-TH')}
            className="gap-2"
          >
            <img
              src="/flags/th-TH.svg"
              alt="ไทย (ประเทศไทย)"
              className="w-4 h-4"
            />{' '}
            ไทย (ประเทศไทย)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('de-AT')}
            className="gap-2"
          >
            <img
              src="/flags/de-AT.svg"
              alt="Deutsch (Österreich)"
              className="w-4 h-4"
            />{' '}
            Deutsch (Österreich)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('fr-BE')}
            className="gap-2"
          >
            <img
              src="/flags/fr-BE.svg"
              alt="Français (Belgique)"
              className="w-4 h-4"
            />{' '}
            Français (Belgique)
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setLocale('es-AR')}
            className="gap-2"
          >
            <img
              src="/flags/es-AR.svg"
              alt="Español (Argentina)"
              className="w-4 h-4"
            />{' '}
            Español (Argentina)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onHistory}
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled && !coreActionLabelsOnly })}
          >
            <History className="w-4 h-4" />
            {actionLabelsEnabled && !coreActionLabelsOnly && t('history')}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('history')}</TooltipContent>
      </Tooltip>
      {showJumpToJson && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                onJumpToJson?.();
                trackEvent(trackingEnabled, AnalyticsEvent.JumpToJson);
              }}
              variant="outline"
              size="sm"
              className={cn({ 'gap-2': actionLabelsEnabled && !coreActionLabelsOnly })}
            >
              <MoveDown className="w-4 h-4" />
              {actionLabelsEnabled && !coreActionLabelsOnly && t('jumpToJson')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('jumpToJson')}</TooltipContent>
        </Tooltip>
      )}
      <Button
        onClick={handleMinimize}
        variant="ghost"
        size="icon"
        className="ml-auto"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>

      <SettingsPanel
        open={showSettings}
        onOpenChange={setShowSettings}
        onImport={onImport}
        onReset={onReset}
        onRegenerate={onRegenerate}
        onRandomize={onRandomize}
        trackingEnabled={trackingEnabled}
        onToggleTracking={onToggleTracking}
        soraToolsEnabled={soraToolsEnabled}
        onToggleSoraTools={onToggleSoraTools}
        headerVisible={headerVisible}
        onToggleHeaderVisible={onToggleHeaderVisible}
        headerButtonsEnabled={headerButtonsEnabled}
        onToggleHeaderButtons={onToggleHeaderButtons}
        logoEnabled={logoEnabled}
        onToggleLogo={onToggleLogo}
        darkModeToggleVisible={darkModeToggleVisible}
        onToggleDarkModeToggleVisible={onToggleDarkModeToggleVisible}
        floatingJsonEnabled={floatingJsonEnabled}
        onToggleFloatingJson={onToggleFloatingJson}
        actionLabelsEnabled={actionLabelsEnabled}
        onToggleActionLabels={onToggleActionLabels}
        coreActionLabelsOnly={coreActionLabelsOnly}
        onToggleCoreActionLabels={onToggleCoreActionLabels}
      />
    </div>
  );
};
