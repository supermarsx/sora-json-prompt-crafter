import React, { useState, useEffect } from 'react';
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
  Clipboard,
  Trash2,
  Edit,
  Eye,
  Import as ImportIcon,
  Download,
  Check,
} from 'lucide-react';
import { toast } from '@/components/ui/sonner-toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import ClipboardImportModal from './ClipboardImportModal';
import BulkFileImportModal from './BulkFileImportModal';
import { trackEvent } from '@/lib/analytics';
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [tab, setTab] = useState('prompts');
  const [confirmClearActions, setConfirmClearActions] = useState(false);
  const [confirmDeleteActionIdx, setConfirmDeleteActionIdx] = useState<
    number | null
  >(null);
  const noHistory = history.length === 0;
  const noActions = actionHistory.length === 0;

  useEffect(() => {
    if (open) {
      trackEvent(trackingEnabled, 'history_open');
    }
  }, [open, trackingEnabled]);

  useEffect(() => {
    if (!open) return;
    if (tab === 'prompts') {
      trackEvent(trackingEnabled, 'history_view_prompts');
    } else if (tab === 'actions') {
      trackEvent(trackingEnabled, 'history_view_actions');
    }
  }, [tab, open, trackingEnabled]);

  const exportClipboard = async () => {
    if (!('clipboard' in navigator)) {
      toast.error(t('clipboardUnsupported'));
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(history, null, 2));
      toast.success(t('copiedAllHistory'));
      trackEvent(trackingEnabled, 'history_export', { type: 'clipboard' });
    } catch {
      /* ignore */
    }
  };

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
    trackEvent(trackingEnabled, 'history_export', { type: 'file' });
  };

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

  const clearActions = () => {
    safeRemove(TRACKING_HISTORY);
    window.dispatchEvent(new Event('trackingHistoryUpdate'));
    toast.success(t('actionsCleared'));
  };

  const requestClearActions = () => setConfirmClearActions(true);

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
                          trackEvent(trackingEnabled, 'history_import_open', {
                            type: 'clipboard',
                          });
                          setShowClipboard(true);
                        }}
                      >
                        {t('pasteFromClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_import_open', {
                            type: 'bulk_clipboard',
                          });
                          setShowBulkClipboard(true);
                        }}
                      >
                        {t('bulkPasteFromClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_import_open', {
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
                          trackEvent(trackingEnabled, 'history_export_click', {
                            type: 'clipboard',
                          });
                          exportClipboard();
                        }}
                      >
                        {t('copyAllToClipboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_export_click', {
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
                    trackEvent(trackingEnabled, 'history_clear_click');
                    setConfirmClear(true);
                  }}
                  disabled={noHistory}
                >
                  {t('clearHistory')}
                </Button>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 pb-2">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="border p-3 rounded-md space-y-2"
                    >
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{entry.date}</span>
                      </div>
                      {(() => {
                        try {
                          const obj = JSON.parse(entry.json);
                          return (
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="font-medium break-words">
                                {obj.prompt}
                              </div>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })()}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_edit');
                            onEdit(entry.json);
                            setEditedId(entry.id);
                            setTimeout(() => {
                              setEditedId((prev) =>
                                prev === entry.id ? null : prev,
                              );
                            }, 1500);
                          }}
                          className={`gap-1 ${editedId === entry.id ? 'text-green-600 animate-pulse' : ''}`}
                        >
                          {editedId === entry.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Edit className="w-4 h-4" />
                          )}{' '}
                          {editedId === entry.id ? t('edited') : t('edit')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_copy');
                            onCopy(entry.json);
                            setCopiedId(entry.id);
                            setTimeout(() => {
                              setCopiedId((prev) =>
                                prev === entry.id ? null : prev,
                              );
                            }, 1500);
                          }}
                          className={`gap-1 ${copiedId === entry.id ? 'text-green-600 animate-pulse' : ''}`}
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Clipboard className="w-4 h-4" />
                          )}{' '}
                          {copiedId === entry.id ? t('copied') : t('copy')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_preview');
                            setPreview(entry);
                          }}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" /> {t('preview')}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirmDeleteId === entry.id) {
                              trackEvent(
                                trackingEnabled,
                                'history_delete_confirm',
                              );
                              onDelete(entry.id);
                              toast.success(t('entryDeleted'));
                              setConfirmDeleteId(null);
                            } else {
                              setConfirmDeleteId(entry.id);
                              setTimeout(() => {
                                setConfirmDeleteId((prev) =>
                                  prev === entry.id ? null : prev,
                                );
                              }, 1500);
                            }
                          }}
                          className={`gap-1 ${confirmDeleteId === entry.id ? 'animate-pulse' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {confirmDeleteId === entry.id
                            ? t('confirm')
                            : t('delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      {t('historyEmptyPrompts')}
                    </p>
                  )}
                </div>
              </ScrollArea>
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
                trackEvent(trackingEnabled, 'history_clear_confirm');
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
