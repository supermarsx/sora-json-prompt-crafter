import React, { useState, useEffect, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import HistoryItem from '@/components/history/HistoryItem';
import { FixedSizeList as List } from 'react-window';
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
  Trash2,
  Import as ImportIcon,
  Download,
  Check,
} from 'lucide-react';
const HistoryListOuter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} data-testid="history-list" {...props} />,
);
import { toast } from '@/components/ui/sonner-toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import ClipboardImportModal from './ClipboardImportModal';
import BulkFileImportModal from './BulkFileImportModal';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { formatDateTime } from '@/lib/date';
import { useTracking } from '@/hooks/use-tracking';
import { safeGet, safeSet, safeRemove } from '@/lib/storage';
import { TRACKING_HISTORY } from '@/lib/storage-keys';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export interface HistoryEntry {
  id: number;
  date: string;
  json: string;
}

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: HistoryEntry[];
  actionHistory: { date: string; action: string }[];
  onDelete: (id: number) => void;
  onClear: () => void;
  onCopy: (json: string) => void;
  onEdit: (json: string) => void;
  onImport: (jsons: string[]) => void;
}

/**
 * Renders a dialog for browsing and managing stored prompt history and recent
 * user actions. Provides import/export functionality, previews, and the ability
 * to restore or remove entries.
 *
 * @param open - Whether the history panel dialog is visible.
 * @param onOpenChange - Callback invoked when the open state changes.
 * @param history - List of previously saved prompt entries.
 * @param actionHistory - List of recent user actions tracked locally.
 * @param onDelete - Removes a prompt entry by its identifier.
 * @param onClear - Clears all prompt history entries.
 * @param onCopy - Copies a prompt JSON string to the clipboard.
 * @param onEdit - Loads a prompt JSON into the editor for modification.
 * @param onImport - Imports prompt JSON strings from external sources.
 * @returns Modal dialog UI for managing history and actions.
 */
export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  open,
  onOpenChange,
  history,
  actionHistory,
  onDelete,
  onClear,
  onCopy,
  onEdit,
  onImport,
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<HistoryEntry | null>(null);
  const [trackingEnabled] = useTracking();
  const [confirmClear, setConfirmClear] = useState(false);
  const [showClipboard, setShowClipboard] = useState(false);
  const [showBulkClipboard, setShowBulkClipboard] = useState(false);
  const [showBulkFile, setShowBulkFile] = useState(false);
  const [tab, setTab] = useState('prompts');
  const [confirmClearActions, setConfirmClearActions] = useState(false);
  const [confirmDeleteActionIdx, setConfirmDeleteActionIdx] = useState<
    number | null
  >(null);
  const noHistory = history.length === 0;
  const noActions = actionHistory.length === 0;

  useEffect(() => {
    if (open) {
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryOpen);
    }
  }, [open, trackingEnabled]);

  useEffect(() => {
    if (!open) return;
    if (tab === 'prompts') {
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryViewPrompts);
    } else if (tab === 'actions') {
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryViewActions);
    }
  }, [tab, open, trackingEnabled]);

  /**
   * Copies the entire prompt history to the system clipboard.
   * Shows a toast message and records an analytics event on success.
   */
  const exportClipboard = async () => {
    if (!('clipboard' in navigator)) {
      toast.error(t('clipboardUnsupported'));
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(history, null, 2));
      toast.success(t('copiedAllHistory'));
      trackEvent(trackingEnabled, AnalyticsEvent.HistoryExport, {
        type: 'clipboard',
      });
    } catch {
      /* ignore */
    }
  };

  /**
   * Downloads the prompt history as a JSON file using a timestamped filename.
   * Records an analytics event for the file export action.
   */
  const exportFile = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const datetime = formatDateTime();
    const rand = Math.random().toString(16).slice(2, 8);
    a.href = url;
    a.download = `history-${datetime}-${rand}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('historyDownloaded'));
    trackEvent(trackingEnabled, AnalyticsEvent.HistoryExport, {
      type: 'file',
    });
  };

  /**
   * Downloads the recent action history as a JSON file.
   * The file name includes a timestamp to avoid collisions.
   */
  const exportActions = () => {
    const data = JSON.stringify(actionHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const datetime = formatDateTime();
    const rand = Math.random().toString(16).slice(2, 8);
    a.href = url;
    a.download = `latest-actions-${datetime}-${rand}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t('actionsDownloaded'));
  };

  /**
   * Clears all stored action history and notifies listeners of the update.
   */
  const clearActions = () => {
    safeRemove(TRACKING_HISTORY);
    window.dispatchEvent(new Event('trackingHistoryUpdate'));
    toast.success(t('actionsCleared'));
  };

  /**
   * Opens the confirmation dialog to clear all tracked actions.
   */
  const requestClearActions = () => setConfirmClearActions(true);

  /**
   * Removes a single action from storage at the specified index.
   *
   * @param idx - Index of the action to delete.
   */
  const deleteAction = (idx: number) => {
    const list = safeGet<{ date: string; action: string }[]>(
      TRACKING_HISTORY,
      [],
      true,
    );
    list.splice(idx, 1);
    safeSet(TRACKING_HISTORY, list, true);
    window.dispatchEvent(new Event('trackingHistoryUpdate'));
    toast.success(t('actionDeleted'));
  };

  /**
   * Initiates a confirmation sequence for deleting an action. If the same index
   * is requested twice within a short timeframe, the action is deleted.
   *
   * @param idx - Index of the action to remove.
   */
  const requestDeleteAction = (idx: number) => {
    if (confirmDeleteActionIdx === idx) {
      deleteAction(idx);
      setConfirmDeleteActionIdx(null);
    } else {
      setConfirmDeleteActionIdx(idx);
      setTimeout(() => {
        setConfirmDeleteActionIdx((prev) => (prev === idx ? null : prev));
      }, 1500);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('history')}</DialogTitle>
            <DialogDescription>{t('historyDescription')}</DialogDescription>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompts">{t('jsonPromptsTab')}</TabsTrigger>
              <TabsTrigger value="actions">{t('latestActionsTab')}</TabsTrigger>
            </TabsList>
            <TabsContent value="prompts">
              <p className="text-sm text-muted-foreground mb-2">
                {t('historyPromptsIntro')}
              </p>
              <div className="mb-4 flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ImportIcon className="w-4 h-4" /> {t('import')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, AnalyticsEvent.HistoryImportOpen, {
                            type: 'clipboard',
                          });
                          setShowClipboard(true);
                        }}
                      >
                        {t('pasteFromClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(
                            trackingEnabled,
                            AnalyticsEvent.HistoryImportOpen,
                            {
                            type: 'bulk_clipboard',
                          });
                          setShowBulkClipboard(true);
                        }}
                      >
                        {t('bulkPasteFromClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(
                            trackingEnabled,
                            AnalyticsEvent.HistoryImportOpen,
                            {
                            type: 'bulk_file',
                          });
                          setShowBulkFile(true);
                        }}
                      >
                        {t('bulkFileImport')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        disabled={noHistory}
                      >
                        <Download className="w-4 h-4" /> {t('export')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, AnalyticsEvent.HistoryExportClick, {
                            type: 'clipboard',
                          });
                          exportClipboard();
                        }}
                      >
                        {t('copyAllToClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(
                            trackingEnabled,
                            AnalyticsEvent.HistoryExportClick,
                            {
                            type: 'file',
                          });
                          exportFile();
                        }}
                      >
                        {t('downloadJson')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    trackEvent(trackingEnabled, AnalyticsEvent.HistoryClearClick);
                    setConfirmClear(true);
                  }}
                  disabled={noHistory}
                >
                  {t('clearHistory')}
                </Button>
              </div>
              <div className="h-[60vh]">
                {history.length > 0 ? (
                  <List
                    height={Math.round(window.innerHeight * 0.6)}
                    itemCount={history.length}
                    itemSize={130}
                    width="100%"
                    className="pb-2"
                    outerElementType={HistoryListOuter}
                  >
                    {({ index, style }) => (
                      <div style={{ ...style, paddingBottom: 16 }}>
                        <HistoryItem
                          entry={history[index]}
                          onEdit={onEdit}
                          onCopy={onCopy}
                          onDelete={(id) => {
                            onDelete(id);
                            toast.success(t('entryDeleted'));
                          }}
                          onPreview={setPreview}
                          trackingEnabled={trackingEnabled}
                        />
                      </div>
                    )}
                  </List>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    {t('historyEmptyPrompts')}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="actions">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  {t('latestActionsIntro')}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={exportActions}
                    disabled={noActions}
                  >
                    <Download className="w-4 h-4" /> {t('export')}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={requestClearActions}
                    disabled={noActions}
                  >
                    {t('clearActions')}
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2 pb-2">
                  {actionHistory.map((a, idx) => (
                    <div
                      key={idx}
                      className="border p-2 rounded-md flex justify-between items-center text-xs"
                    >
                      <span>{a.date}</span>
                      <span className="flex items-center gap-2">
                        {a.action}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`p-0 w-3.5 h-3.5 ${confirmDeleteActionIdx === idx ? 'text-destructive animate-pulse' : ''}`}
                          onClick={() => requestDeleteAction(idx)}
                          aria-label={
                            confirmDeleteActionIdx === idx
                              ? t('confirm')
                              : t('delete')
                          }
                        >
                          {confirmDeleteActionIdx === idx ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </span>
                    </div>
                  ))}
                  {actionHistory.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      {t('noActionsYet')}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clearHistoryTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clearHistoryDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                trackEvent(trackingEnabled, AnalyticsEvent.HistoryClearConfirm);
                onClear();
                setConfirmClear(false);
              }}
            >
              {t('clear')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmClearActions}
        onOpenChange={setConfirmClearActions}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clearActionsTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clearActionsDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearActions();
                setConfirmClearActions(false);
              }}
            >
              {t('clear')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('jsonPreviewTitle')}</DialogTitle>
            <DialogDescription>{t('jsonPreviewDescription')}</DialogDescription>
          </DialogHeader>
          {preview && (
            <ScrollArea className="h-[60vh]">
              <pre className="whitespace-pre-wrap text-xs p-2">
                {(() => {
                  try {
                    const obj = JSON.parse(preview.json);
                    return JSON.stringify({ prompt: obj }, null, 2);
                  } catch {
                    return preview.json;
                  }
                })()}
              </pre>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      <ClipboardImportModal
        open={showClipboard}
        onOpenChange={setShowClipboard}
        onImport={onImport}
        title={t('importFromClipboard')}
      />
      <ClipboardImportModal
        open={showBulkClipboard}
        onOpenChange={setShowBulkClipboard}
        onImport={onImport}
        title={t('bulkImportFromClipboard')}
      />
      <BulkFileImportModal
        open={showBulkFile}
        onOpenChange={setShowBulkFile}
        onImport={onImport}
      />
    </>
  );
};

export default HistoryPanel;
