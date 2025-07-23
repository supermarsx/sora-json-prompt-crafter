import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/hooks/use-locale';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  logoEnabled: boolean;
  onToggleLogo: () => void;
  actionLabelsEnabled: boolean;
  onToggleActionLabels: () => void;
  copied: boolean;
  showJumpToJson?: boolean;
  onJumpToJson?: () => void;
}

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
  logoEnabled,
  onToggleLogo,
  actionLabelsEnabled,
  onToggleActionLabels,
  copied,
  showJumpToJson,
  onJumpToJson,
}) => {
  const { t } = useTranslation();
  const [locale, setLocale] = useLocale();
  const [minimized, setMinimized] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmDisableTracking, setConfirmDisableTracking] = useState(false);
  const [confirmEnableTracking, setConfirmEnableTracking] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setMinimized(false);
            trackEvent(trackingEnabled, 'restore_actions');
          }}
          variant="default"
          size="sm"
          className="gap-1"
        >
          {t('actions')}
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-md shadow-lg p-3 flex flex-wrap items-center gap-2">
      {soraToolsEnabled && userscriptInstalled && (
        <Button
          onClick={onSendToSora}
          variant="outline"
          size="sm"
          className={cn({ 'gap-2': actionLabelsEnabled })}
        >
          <Send className="w-4 h-4" />
          {actionLabelsEnabled && t('sendToSora')}
        </Button>
      )}
      <Button
        onClick={onUndo}
        variant="outline"
        size="sm"
        disabled={!canUndo}
        className={cn({ 'gap-2': actionLabelsEnabled })}
      >
        <Undo2 className="w-4 h-4" />
        {actionLabelsEnabled && t('undo')}
      </Button>
      <Button
        onClick={onRedo}
        variant="outline"
        size="sm"
        disabled={!canRedo}
        className={cn({ 'gap-2': actionLabelsEnabled })}
      >
        <Redo2 className="w-4 h-4" />
        {actionLabelsEnabled && t('redo')}
      </Button>
      <Button
        onClick={onCopy}
        variant="outline"
        size="sm"
        className={cn({ 'gap-2': actionLabelsEnabled })}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {actionLabelsEnabled && t('copy')}
      </Button>
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
      <Button
        onClick={onShare}
        variant="outline"
        size="sm"
        className={cn({ 'gap-2': actionLabelsEnabled })}
      >
        <Share className="w-4 h-4" />
        {actionLabelsEnabled && t('share')}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Cog className="w-4 h-4" /> {actionLabelsEnabled && t('manage')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onImport} className="gap-2">
            <Import className="w-4 h-4" /> {t('import')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onReset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> {t('reset')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onRegenerate} className="gap-2">
            <RefreshCw className="w-4 h-4" /> {t('regenerate')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onRandomize} className="gap-2">
            <Shuffle className="w-4 h-4" /> {t('randomize')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              if (trackingEnabled) {
                setConfirmDisableTracking(true);
              } else {
                setConfirmEnableTracking(true);
              }
            }}
            className="gap-2"
          >
            {trackingEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> {t('disableTracking')}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> {t('enableTracking')}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onToggleSoraTools}
            className="gap-2 hidden"
          >
            {soraToolsEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Sora Integration
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Sora Integration
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleHeaderButtons();
              trackEvent(trackingEnabled, 'toggle_header_buttons', {
                enabled: !headerButtonsEnabled,
              });
            }}
            className="gap-2"
          >
            {headerButtonsEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> {t('hideHeaderButtons')}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> {t('showHeaderButtons')}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleLogo();
              trackEvent(trackingEnabled, 'toggle_logo', {
                enabled: !logoEnabled,
              });
            }}
            className="gap-2"
          >
            {logoEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> {t('hideLogo')}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> {t('showLogo')}
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleActionLabels();
              trackEvent(trackingEnabled, 'toggle_action_labels', {
                enabled: !actionLabelsEnabled,
              });
            }}
            className="gap-2"
          >
            {actionLabelsEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> {t('hideLabels')}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> {t('showLabels')}
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn({ 'gap-2': actionLabelsEnabled })}
          >
            <Languages className="w-4 h-4" />
            {actionLabelsEnabled && t('language')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
      <Button
        onClick={onHistory}
        variant="outline"
        size="sm"
        className={cn({ 'gap-2': actionLabelsEnabled })}
      >
        <History className="w-4 h-4" />
        {actionLabelsEnabled && t('history')}
      </Button>
      {showJumpToJson && (
        <Button
          onClick={() => {
            onJumpToJson?.();
            trackEvent(trackingEnabled, 'jump_to_json');
          }}
          variant="outline"
          size="sm"
          className={cn({ 'gap-2': actionLabelsEnabled })}
        >
          <MoveDown className="w-4 h-4" />
          {actionLabelsEnabled && t('jumpToJson')}
        </Button>
      )}
      <Button
        onClick={() => {
          setMinimized(true);
          trackEvent(trackingEnabled, 'minimize_actions');
        }}
        variant="ghost"
        size="icon"
        className="ml-auto"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>

      <AlertDialog
        open={confirmDisableTracking}
        onOpenChange={setConfirmDisableTracking}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('disableTrackingTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('disableTrackingDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleTracking();
                toast.success(t('trackingDisabled'));
                trackEvent(true, 'disable_tracking_confirm');
                trackEvent(true, 'toggle_tracking', { enabled: false });
                setConfirmDisableTracking(false);
              }}
            >
              {t('disableTrackingConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmEnableTracking}
        onOpenChange={setConfirmEnableTracking}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('enableTrackingTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('enableTrackingDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleTracking();
                toast.success(t('trackingEnabled'));
                trackEvent(true, 'enable_tracking_confirm');
                trackEvent(true, 'toggle_tracking', { enabled: true });
                setConfirmEnableTracking(false);
              }}
            >
              {t('enableTrackingConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
