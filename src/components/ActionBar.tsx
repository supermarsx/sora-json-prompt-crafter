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
  Shuffle,
  Eye,
  EyeOff,
  Trash2,
  Send,
  Cog,
  ChevronDown,
  ChevronUp,
  MoveDown,
} from 'lucide-react';

interface ActionBarProps {
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
            {t('language')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setLocale('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocale('es')}>
            Español
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocale('pt-PT')}>
            Português
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setLocale('ru')}>
            Русский
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
