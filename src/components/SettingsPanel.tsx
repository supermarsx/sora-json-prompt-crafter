import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Import as ImportIcon,
  Download,
  RotateCcw,
  RefreshCw,
  Shuffle,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { purgeCache } from '@/lib/purgeCache';
import { useUpdateCheck } from '@/hooks/use-update-check';
import { exportAppData, importAppData } from '@/lib/storage';
import { formatDateTime } from '@/lib/date';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  onRandomize: () => void;
  trackingEnabled: boolean;
  onToggleTracking: () => void;
  soraToolsEnabled: boolean;
  onToggleSoraTools: () => void;
  headerButtonsEnabled: boolean;
  onToggleHeaderButtons: () => void;
  logoEnabled: boolean;
  onToggleLogo: () => void;
  actionLabelsEnabled: boolean;
  onToggleActionLabels: () => void;
}

/**
 * Settings dialog offering a variety of configuration actions for the app.
 * Provides import, reset, regenerate, randomize and cache purge actions as
 * well as toggles for analytics tracking, Sora tools, header buttons, logo and
 * action labels. Internal state tracks confirmation dialogs when enabling or
 * disabling tracking.
 *
 * @param open - Controls whether the dialog is visible.
 * @param onOpenChange - Callback fired when dialog open state changes.
 * @param onImport - Invoked to import settings from a file.
 * @param onReset - Handler to reset all options.
 * @param onRegenerate - Handler to regenerate the JSON output.
 * @param onRandomize - Handler to randomize current options.
 * @param trackingEnabled - Current analytics tracking status.
 * @param onToggleTracking - Toggles analytics tracking.
 * @param soraToolsEnabled - Whether Sora tools are enabled.
 * @param onToggleSoraTools - Toggles Sora tools visibility.
 * @param headerButtonsEnabled - Whether header buttons are shown.
 * @param onToggleHeaderButtons - Toggles header button visibility.
 * @param logoEnabled - Whether the logo is displayed.
 * @param onToggleLogo - Toggles logo visibility.
 * @param actionLabelsEnabled - Whether action buttons display text labels.
 * @param onToggleActionLabels - Toggles action button labels.
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onOpenChange,
  onImport,
  onReset,
  onRegenerate,
  onRandomize,
  trackingEnabled,
  onToggleTracking,
  soraToolsEnabled,
  onToggleSoraTools,
  headerButtonsEnabled,
  onToggleHeaderButtons,
  logoEnabled,
  onToggleLogo,
  actionLabelsEnabled,
  onToggleActionLabels,
}) => {
  const { t } = useTranslation();
  const [confirmDisableTracking, setConfirmDisableTracking] = useState(false);
  const [confirmEnableTracking, setConfirmEnableTracking] = useState(false);
  const { checkForUpdate } = useUpdateCheck();

  useEffect(() => {
    if (open) {
      trackEvent(trackingEnabled, AnalyticsEvent.SettingsOpen);
      checkForUpdate();
    }
  }, [open, trackingEnabled, checkForUpdate]);

  const exportDataFile = () => {
    const blob = new Blob([JSON.stringify(exportAppData(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const datetime = formatDateTime();
    const rand = Math.random().toString(16).slice(2, 8);
    a.href = url;
    a.download = `sora-data-${datetime}-${rand}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('dataExported', { defaultValue: 'Data exported' }));
    trackEvent(trackingEnabled, AnalyticsEvent.DataExport);
  };

  const importDataFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importAppData(JSON.parse(text));
        toast.success(t('dataImported', { defaultValue: 'Data imported' }));
        trackEvent(trackingEnabled, AnalyticsEvent.DataImport);
      } catch {
        toast.error(t('invalidDataFile', { defaultValue: 'Invalid data file' }));
      }
    };
    input.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('manage')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-2 py-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onImport}
                title={t('import')}
              >
                <ImportIcon className="w-4 h-4" /> {t('import')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onReset}
                title={t('reset')}
              >
                <RotateCcw className="w-4 h-4" /> {t('reset')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onRegenerate}
                title={t('regenerate')}
              >
                <RefreshCw className="w-4 h-4" /> {t('regenerate')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onRandomize}
                title={t('randomize')}
              >
                <Shuffle className="w-4 h-4" /> {t('randomize')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  if (trackingEnabled) {
                    setConfirmDisableTracking(true);
                  } else {
                    setConfirmEnableTracking(true);
                  }
                }}
                title={
                  trackingEnabled
                    ? t('disableTracking')
                    : t('enableTracking')
                }
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
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hidden"
                onClick={onToggleSoraTools}
                title={
                  soraToolsEnabled ? 'Hide Sora Integration' : 'Show Sora Integration'
                }
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
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  onToggleHeaderButtons();
                  trackEvent(trackingEnabled, AnalyticsEvent.ToggleHeaderButtons, {
                    enabled: !headerButtonsEnabled,
                  });
                }}
                title={
                  headerButtonsEnabled
                    ? t('hideHeaderButtons')
                    : t('showHeaderButtons')
                }
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
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  onToggleLogo();
                  trackEvent(trackingEnabled, AnalyticsEvent.ToggleLogo, {
                    enabled: !logoEnabled,
                  });
                }}
                title={logoEnabled ? t('hideLogo') : t('showLogo')}
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
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  onToggleActionLabels();
                  trackEvent(trackingEnabled, AnalyticsEvent.ToggleActionLabels, {
                    enabled: !actionLabelsEnabled,
                  });
                }}
                title={
                  actionLabelsEnabled ? t('shortenButtons') : t('showLabels')
                }
              >
                {actionLabelsEnabled ? (
                  <>
                    <EyeOff className="w-4 h-4" /> {t('shortenButtons')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" /> {t('showLabels')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={exportDataFile}
                title={t('exportData', { defaultValue: 'Export data' })}
              >
                <Download className="w-4 h-4" />
                {t('exportData', { defaultValue: 'Export data' })}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={importDataFile}
                title={t('importData', { defaultValue: 'Import data' })}
              >
                <ImportIcon className="w-4 h-4" />
                {t('importData', { defaultValue: 'Import data' })}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => {
                  purgeCache();
                  trackEvent(trackingEnabled, AnalyticsEvent.PurgeCache);
                }}
                title={t('purgeCache')}
              >
                <Trash2 className="w-4 h-4" /> {t('purgeCache')}
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
                trackEvent(true, AnalyticsEvent.DisableTrackingConfirm);
                trackEvent(true, AnalyticsEvent.ToggleTracking, { enabled: false });
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
                trackEvent(true, AnalyticsEvent.EnableTrackingConfirm);
                trackEvent(true, AnalyticsEvent.ToggleTracking, { enabled: true });
                setConfirmEnableTracking(false);
              }}
            >
              {t('enableTrackingConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SettingsPanel;
