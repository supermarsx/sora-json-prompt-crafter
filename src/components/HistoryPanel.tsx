import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Clipboard,
  Trash2,
  Edit,
  Eye,
  Import as ImportIcon,
  Download,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import ClipboardImportModal from './ClipboardImportModal'
import BulkFileImportModal from './BulkFileImportModal'
import { trackEvent } from '@/lib/analytics'
import { useTracking } from '@/hooks/use-tracking'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export interface HistoryEntry {
  id: number
  date: string
  json: string
}

interface HistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: HistoryEntry[]
  actionHistory: { date: string; action: string }[]
  onDelete: (id: number) => void
  onClear: () => void
  onCopy: (json: string) => void
  onEdit: (json: string) => void
  onImport: (jsons: string[]) => void
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
  const [preview, setPreview] = useState<HistoryEntry | null>(null)
  const [trackingEnabled] = useTracking()
  const [confirmClear, setConfirmClear] = useState(false)
  const [showClipboard, setShowClipboard] = useState(false)
  const [showBulkClipboard, setShowBulkClipboard] = useState(false)
  const [showBulkFile, setShowBulkFile] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [editedId, setEditedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [tab, setTab] = useState('prompts')
  const [confirmClearActions, setConfirmClearActions] = useState(false)
  const [confirmDeleteActionIdx, setConfirmDeleteActionIdx] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      trackEvent(trackingEnabled, 'history_open')
    }
  }, [open, trackingEnabled])

  useEffect(() => {
    if (!open) return
    if (tab === 'prompts') {
      trackEvent(trackingEnabled, 'history_view_prompts')
    } else if (tab === 'actions') {
      trackEvent(trackingEnabled, 'history_view_actions')
    }
  }, [tab, open, trackingEnabled])


  const exportClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(history, null, 2))
      toast.success('Copied all history to clipboard!')
      trackEvent(trackingEnabled, 'history_export', { type: 'clipboard' })
    } catch {
      /* ignore */
    }
  }

  const exportFile = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const datetime = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now
        .getDate()
        .toString()
        .padStart(2, '0')}-${now
          .getHours()
          .toString()
          .padStart(2, '0')}${now
            .getMinutes()
            .toString()
            .padStart(2, '0')}${now
              .getSeconds()
              .toString()
              .padStart(2, '0')}`
    const rand = Math.random().toString(16).slice(2, 8)
    a.href = url
    a.download = `history-${datetime}-${rand}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('History downloaded!')
    trackEvent(trackingEnabled, 'history_export', { type: 'file' })
  }

  const exportActions = () => {
    const data = JSON.stringify(actionHistory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const datetime = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now
        .getDate()
        .toString()
        .padStart(2, '0')}-${now
          .getHours()
          .toString()
          .padStart(2, '0')}${now
            .getMinutes()
            .toString()
            .padStart(2, '0')}${now
              .getSeconds()
              .toString()
              .padStart(2, '0')}`
    const rand = Math.random().toString(16).slice(2, 8)
    a.href = url
    a.download = `latest-actions-${datetime}-${rand}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Actions downloaded!')
  }

  const clearActions = () => {
    localStorage.removeItem('trackingHistory')
    window.dispatchEvent(new Event('trackingHistoryUpdate'))
    toast.success('Actions cleared!')
  }

  const requestClearActions = () => setConfirmClearActions(true)

  const deleteAction = (idx: number) => {
    const list = JSON.parse(localStorage.getItem('trackingHistory') || '[]')
    list.splice(idx, 1)
    localStorage.setItem('trackingHistory', JSON.stringify(list))
    window.dispatchEvent(new Event('trackingHistoryUpdate'))
    toast.success('Action deleted!')
  }

  const requestDeleteAction = (idx: number) => {
    if (confirmDeleteActionIdx === idx) {
      deleteAction(idx)
      setConfirmDeleteActionIdx(null)
    } else {
      setConfirmDeleteActionIdx(idx)
      setTimeout(() => {
        setConfirmDeleteActionIdx(prev => (prev === idx ? null : prev))
      }, 1500)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
          </DialogHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="prompts">JSON Prompts</TabsTrigger>
              <TabsTrigger value="actions">Latest Actions</TabsTrigger>
            </TabsList>
            <TabsContent value="prompts">
              <p className="text-sm text-muted-foreground mb-2">
                This is your clipboard copied prompt history, every copied prompt goes here. You can review them, export them or delete them when you don't need them any longer
              </p>
              <div className="mb-4 flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ImportIcon className="w-4 h-4" /> Import
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_import_open', { type: 'clipboard' })
                          setShowClipboard(true)
                        }}
                      >
                        Paste from clipboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_import_open', { type: 'bulk_clipboard' })
                          setShowBulkClipboard(true)
                        }}
                      >
                        Bulk paste from clipboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_import_open', { type: 'bulk_file' })
                          setShowBulkFile(true)
                        }}
                      >
                        Bulk file import
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="w-4 h-4" /> Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_export_click', { type: 'clipboard' })
                          exportClipboard()
                        }}
                      >
                        Copy all to clipboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          trackEvent(trackingEnabled, 'history_export_click', { type: 'file' })
                          exportFile()
                        }}
                      >
                        Download JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    trackEvent(trackingEnabled, 'history_clear_click')
                    setConfirmClear(true)
                  }}
                >
                  Clear History
                </Button>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 pb-2">
                  {history.map((entry) => (
                    <div key={entry.id} className="border p-3 rounded-md space-y-2">
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{entry.date}</span>
                      </div>
                      {(() => {
                        try {
                          const obj = JSON.parse(entry.json)
                          return (
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="font-medium break-words">{obj.prompt}</div>
                            </div>
                          )
                        } catch {
                          return null
                        }
                      })()}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_edit')
                            onEdit(entry.json)
                            setEditedId(entry.id)
                            setTimeout(() => {
                              setEditedId(prev => (prev === entry.id ? null : prev))
                            }, 1500)
                          }}
                          className={`gap-1 ${editedId === entry.id ? 'text-green-600 animate-pulse' : ''}`}
                        >
                          {editedId === entry.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Edit className="w-4 h-4" />
                          )}{' '}
                          {editedId === entry.id ? 'Edited' : 'Edit'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_copy')
                            onCopy(entry.json)
                            setCopiedId(entry.id)
                            setTimeout(() => {
                              setCopiedId(prev => (prev === entry.id ? null : prev))
                            }, 1500)
                          }}
                          className={`gap-1 ${copiedId === entry.id ? 'text-green-600 animate-pulse' : ''}`}
                        >
                          {copiedId === entry.id ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Clipboard className="w-4 h-4" />
                          )}{' '}
                          {copiedId === entry.id ? 'Copied' : 'Copy'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackEvent(trackingEnabled, 'history_preview')
                            setPreview(entry)
                          }}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" /> Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirmDeleteId === entry.id) {
                              trackEvent(trackingEnabled, 'history_delete_confirm')
                              onDelete(entry.id)
                              toast.success('Entry deleted!')
                              setConfirmDeleteId(null)
                            } else {
                              setConfirmDeleteId(entry.id)
                              setTimeout(() => {
                                setConfirmDeleteId(prev => (prev === entry.id ? null : prev))
                              }, 1500)
                            }
                          }}
                          className={`gap-1 ${confirmDeleteId === entry.id ? 'animate-pulse' : ''}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {confirmDeleteId === entry.id ? 'Confirm' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      We're lonely here, please generate some prompts and copy them 🥺
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="actions">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  This is your latest actions, they will be kept here for you to know. If you disable tracking you'll disable this history too
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={exportActions}>
                    <Download className="w-4 h-4" /> Export
                  </Button>
                  <Button size="sm" variant="destructive" onClick={requestClearActions}>
                    Clear actions
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2 pb-2">
                  {actionHistory.map((a, idx) => (
                    <div key={idx} className="border p-2 rounded-md flex justify-between items-center text-xs">
                      <span>{a.date}</span>
                      <span className="flex items-center gap-2">
                        {a.action}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`p-0 w-3.5 h-3.5 ${confirmDeleteActionIdx === idx ? 'text-destructive animate-pulse' : ''}`}
                          onClick={() => requestDeleteAction(idx)}
                        >
                          {confirmDeleteActionIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </span>
                    </div>
                  ))}
                  {actionHistory.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">No actions yet</p>
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
            <AlertDialogTitle>Clear history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all entries permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                trackEvent(trackingEnabled, 'history_clear_confirm')
                onClear()
                setConfirmClear(false)
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmClearActions} onOpenChange={setConfirmClearActions}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear latest actions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all action entries permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearActions()
                setConfirmClearActions(false)
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>JSON Preview</DialogTitle>
          </DialogHeader>
          {preview && (
            <ScrollArea className="h-[60vh]">
              <pre className="whitespace-pre-wrap text-xs p-2">
                {(() => {
                  try {
                    const obj = JSON.parse(preview.json)
                    return JSON.stringify({ prompt: obj }, null, 2)
                  } catch {
                    return preview.json
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
        title="Import from Clipboard"
      />
      <ClipboardImportModal
        open={showBulkClipboard}
        onOpenChange={setShowBulkClipboard}
        onImport={onImport}
        title="Bulk Import from Clipboard"
      />
      <BulkFileImportModal
        open={showBulkFile}
        onOpenChange={setShowBulkFile}
        onImport={onImport}
      />
    </>
  )
}

export default HistoryPanel
