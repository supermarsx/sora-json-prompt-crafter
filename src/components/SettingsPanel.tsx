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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
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
  Medal,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { purgeCache } from '@/lib/purgeCache';
import { useUpdateCheck } from '@/hooks/use-update-check';
import { exportAppData, importAppData, safeGet } from '@/lib/storage';
import { formatDateTime } from '@/lib/date';
import {
  JSON_COPY_COUNT,
  JSON_COPY_MILESTONES,
  JSON_CHANGE_COUNT,
  JSON_CHANGE_MILESTONES,
  SHARE_COUNT,
  SHARE_MILESTONES,
  UNDO_COUNT,
  UNDO_MILESTONES,
  REDO_COUNT,
  REDO_MILESTONES,
  APP_RELOAD_COUNT,
  APP_RELOAD_MILESTONES,
  TOTAL_SECONDS,
  TIME_MILESTONES,
} from '@/lib/storage-keys';
import { cn } from '@/lib/utils';

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
  defaultTab?: 'manage' | 'general' | 'milestones';
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
  defaultTab = 'manage',
}) => {
  const { t } = useTranslation();
  const [confirmPurgeCache, setConfirmPurgeCache] = useState(false);
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

  const TIER_NAMES = [
    'Hermes',
    'Ares',
    'Apollo',
    'Artemis',
    'Hephaestus',
    'Dionysus',
    'Demeter',
    'Aphrodite',
    'Athena',
    'Hera',
    'Poseidon',
    'Hades',
    'Cronus',
    'Rhea',
    'Uranus',
    'Zeus',
  ];

  const milestoneCategories = [
    {
      key: JSON_COPY_MILESTONES,
      countKey: JSON_COPY_COUNT,
      label: t('copy'),
      unit: 'copies',
      thresholds: [10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000].map(
        (n, idx) => ({ value: n, label: String(n), tier: TIER_NAMES[idx] }),
      ),
    },
    {
      key: SHARE_MILESTONES,
      countKey: SHARE_COUNT,
      label: t('share'),
      unit: 'shares',
      thresholds: [5, 10, 50, 100, 1000, 10000].map((n, idx) => ({
        value: n,
        label: String(n),
        tier: TIER_NAMES[idx],
      })),
    },
    {
      key: JSON_CHANGE_MILESTONES,
      countKey: JSON_CHANGE_COUNT,
      label: 'Changes',
      unit: 'changes',
      thresholds: [250, 1500, 10000, 25000, 100000].map((n, idx) => ({
        value: n,
        label: String(n),
        tier: TIER_NAMES[idx],
      })),
    },
    {
      key: UNDO_MILESTONES,
      countKey: UNDO_COUNT,
      label: t('undo'),
      unit: 'undos',
      thresholds: [100, 500, 1000, 10000].map((n, idx) => ({
        value: n,
        label: String(n),
        tier: TIER_NAMES[idx],
      })),
    },
    {
      key: REDO_MILESTONES,
      countKey: REDO_COUNT,
      label: t('redo'),
      unit: 'redos',
      thresholds: [100, 500, 1000, 10000].map((n, idx) => ({
        value: n,
        label: String(n),
        tier: TIER_NAMES[idx],
      })),
    },
    {
      key: APP_RELOAD_MILESTONES,
      countKey: APP_RELOAD_COUNT,
      label: 'Reloads',
      unit: 'reloads',
      thresholds: [10, 30, 70, 100, 500, 1000].map((n, idx) => ({
        value: n,
        label: String(n),
        tier: TIER_NAMES[idx],
      })),
    },
    {
      key: TIME_MILESTONES,
      countKey: TOTAL_SECONDS,
      label: 'Time',
      unit: 'minutes',
      thresholds: (
        [
          [5 * 60, '5m'],
          [10 * 60, '10m'],
          [30 * 60, '30m'],
          [60 * 60, '1h'],
          [3 * 60 * 60, '3h'],
          [8 * 60 * 60, '8h'],
          [12 * 60 * 60, '12h'],
          [2 * 24 * 60 * 60, '2d'],
          [4 * 24 * 60 * 60, '4d'],
          [7 * 24 * 60 * 60, '7d'],
          [14 * 24 * 60 * 60, '2w'],
          [28 * 24 * 60 * 60, '4w'],
          [60 * 24 * 60 * 60, '2m'],
          [120 * 24 * 60 * 60, '4m'],
          [240 * 24 * 60 * 60, '8m'],
        ] as [number, string][]
      ).map(([value, label], idx) => ({
        value,
        label,
        tier: TIER_NAMES[idx],
      })),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('manage')}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manage">{t('manage')}</TabsTrigger>
              <TabsTrigger value="general">{t('general')}</TabsTrigger>
              <TabsTrigger value="milestones">{t('milestones')}</TabsTrigger>
            </TabsList>
            <TabsContent value="manage">
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-2 py-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={onImport}
                      >
                        <ImportIcon className="w-4 h-4" /> {t('import')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('import')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={onReset}
                      >
                        <RotateCcw className="w-4 h-4" /> {t('reset')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('reset')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={onRegenerate}
                      >
                        <RefreshCw className="w-4 h-4" /> {t('regenerate')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('regenerate')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={onRandomize}
                      >
                        <Shuffle className="w-4 h-4" /> {t('randomize')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('randomize')}</TooltipContent>
                  </Tooltip>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="general">
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-2 py-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {trackingEnabled
                        ? t('disableTracking')
                        : t('enableTracking')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 hidden"
                        onClick={() => {
                          try {
                            onToggleSoraTools();
                            toast.success(
                              !soraToolsEnabled
                                ? 'Sora integration enabled'
                                : 'Sora integration disabled',
                            );
                          } catch {
                            toast.error('Failed to toggle Sora integration');
                          }
                        }}
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {soraToolsEnabled
                        ? 'Hide Sora Integration'
                        : 'Show Sora Integration'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          try {
                            onToggleHeaderButtons();
                            toast.success(
                              !headerButtonsEnabled
                                ? t('showHeaderButtons')
                                : t('hideHeaderButtons'),
                            );
                            trackEvent(
                              trackingEnabled,
                              AnalyticsEvent.ToggleHeaderButtons,
                              {
                                enabled: !headerButtonsEnabled,
                              },
                            );
                          } catch {
                            toast.error('Failed to toggle header buttons');
                          }
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {headerButtonsEnabled
                        ? t('hideHeaderButtons')
                        : t('showHeaderButtons')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          try {
                            onToggleLogo();
                            toast.success(
                              !logoEnabled ? t('showLogo') : t('hideLogo'),
                            );
                            trackEvent(trackingEnabled, AnalyticsEvent.ToggleLogo, {
                              enabled: !logoEnabled,
                            });
                          } catch {
                            toast.error('Failed to toggle logo');
                          }
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {logoEnabled ? t('hideLogo') : t('showLogo')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          try {
                            onToggleActionLabels();
                            toast.success(
                              !actionLabelsEnabled
                                ? t('showLabels')
                                : t('shortenButtons'),
                            );
                            trackEvent(
                              trackingEnabled,
                              AnalyticsEvent.ToggleActionLabels,
                              {
                                enabled: !actionLabelsEnabled,
                              },
                            );
                          } catch {
                            toast.error('Failed to toggle action labels');
                          }
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
                    </TooltipTrigger>
                    <TooltipContent>
                      {actionLabelsEnabled
                        ? t('shortenButtons')
                        : t('showLabels')}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={exportDataFile}
                      >
                        <Download className="w-4 h-4" />
                        {t('exportData', { defaultValue: 'Export data' })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('exportData', { defaultValue: 'Export data' })}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={importDataFile}
                      >
                        <ImportIcon className="w-4 h-4" />
                        {t('importData', { defaultValue: 'Import data' })}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('importData', { defaultValue: 'Import data' })}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          setConfirmPurgeCache(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" /> {t('purgeCache')}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('purgeCache')}</TooltipContent>
                  </Tooltip>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="milestones">
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-4 py-2">
                  {milestoneCategories.map((cat) => {
                    const achieved =
                      (safeGet<number[]>(cat.key, [], true) as number[]) ?? [];
                    const rawCount =
                      (safeGet<number>(cat.countKey, 0, true) as number) ?? 0;
                    const count =
                      cat.unit === 'minutes'
                        ? Math.floor(rawCount / 60)
                        : rawCount;
                    const next = cat.thresholds.find(
                      (th) => th.value > rawCount,
                    );
                    const remainingRaw = next ? next.value - rawCount : 0;
                    const remaining =
                      cat.unit === 'minutes'
                        ? Math.ceil(remainingRaw / 60)
                        : remainingRaw;
                    const current = [...cat.thresholds]
                      .reverse()
                      .find((th) => rawCount >= th.value);
                    const currentTier = current
                      ? current.tier
                      : t('commonerTier', { defaultValue: 'Commoner' });
                    const nextTier = next ? next.tier : 'Max';
                    const message = `You did ${count} ${cat.unit}, you're currently at ${currentTier} level, reach ${nextTier} level by doing ${remaining} more.`;
                    return (
                      <div key={cat.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message}
                          </span>
                        </div>
                        <div
                          className={cn(
                            'flex gap-1',
                            cat.key === TIME_MILESTONES &&
                              'flex-wrap max-w-[200px] gap-2 mt-1'
                          )}
                        >
                          {cat.thresholds.map((th) => (
                            <Tooltip key={th.value} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Medal
                                  className={cn(
                                    'w-4 h-4',
                                    achieved.includes(th.value)
                                      ? 'text-yellow-500'
                                      : 'text-gray-300',
                                  )}
                                />
                              </TooltipTrigger>
                              <TooltipContent>{th.tier}</TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmPurgeCache}
        onOpenChange={setConfirmPurgeCache}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('purgeCacheTitle')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                purgeCache();
                trackEvent(trackingEnabled, AnalyticsEvent.PurgeCache);
                setConfirmPurgeCache(false);
              }}
            >
              {t('purgeCacheConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                try {
                  onToggleTracking();
                  toast.success(t('trackingDisabled'));
                  trackEvent(true, AnalyticsEvent.DisableTrackingConfirm);
                  trackEvent(true, AnalyticsEvent.ToggleTracking, { enabled: false });
                  setConfirmDisableTracking(false);
                } catch {
                  toast.error('Failed to toggle tracking');
                }
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
                try {
                  onToggleTracking();
                  toast.success(t('trackingEnabled'));
                  trackEvent(true, AnalyticsEvent.EnableTrackingConfirm);
                  trackEvent(true, AnalyticsEvent.ToggleTracking, { enabled: true });
                  setConfirmEnableTracking(false);
                } catch {
                  toast.error('Failed to toggle tracking');
                }
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
