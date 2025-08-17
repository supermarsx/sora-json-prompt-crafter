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
              >
                <ImportIcon className="w-4 h-4" /> {t('import')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onReset}
              >
                <RotateCcw className="w-4 h-4" /> {t('reset')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onRegenerate}
              >
                <RefreshCw className="w-4 h-4" /> {t('regenerate')}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={onRandomize}
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
                onClick={() => {
                  purgeCache();
                  trackEvent(trackingEnabled, AnalyticsEvent.PurgeCache);
                }}
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
