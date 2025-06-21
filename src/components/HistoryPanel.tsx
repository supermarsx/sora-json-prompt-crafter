import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import ClipboardImportModal from './ClipboardImportModal'

export interface HistoryEntry {
  id: number
  date: string
  json: string
}

interface HistoryPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  history: HistoryEntry[]
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
  onDelete,
  onClear,
  onCopy,
  onEdit,
  onImport,
}) => {
  const [preview, setPreview] = useState<HistoryEntry | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [showClipboard, setShowClipboard] = useState(false)
  const [showBulkClipboard, setShowBulkClipboard] = useState(false)

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed)) {
        const strings = parsed.map(j => (typeof j === 'string' ? j : JSON.stringify(j)))
        onImport(strings)
      } else {
        onImport([JSON.stringify(parsed)])
      }
    } catch {
      /* ignore */
    }
  }

  const exportClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(history, null, 2))
      toast.success('Copied all history to clipboard!')
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
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
            <DialogDescription>
              This is your clipboard copied prompt history, every copied prompt goes here. You can review them, export them or delete them when you don't need them any longer
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ImportIcon className="w-4 h-4" /> Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setShowClipboard(true)}>
                    Paste from clipboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setShowBulkClipboard(true)}>
                    Bulk paste from clipboard
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <label className="w-full cursor-pointer">
                      Bulk file import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                    </label>
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
                  <DropdownMenuItem onSelect={exportClipboard}>
                    Copy all to clipboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={exportFile}>
                    Download JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmClear(true)}
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
                      const { prompt, ...rest } = obj
                      const flatten = (o: Record<string, unknown>, p = ''): Record<string, unknown> => {
                        return Object.keys(o).reduce((acc, k) => {
                          const v = o[k]
                          const key = p ? `${p}.${k}` : k
                          if (v && typeof v === 'object' && !Array.isArray(v)) {
                            Object.assign(acc, flatten(v, key))
                          } else {
                            acc[key] = v
                          }
                          return acc
                        }, {} as Record<string, unknown>)
                      }
                      const flat = flatten(rest)
                      const keys = Object.keys(flat)
                      const sample = keys.sort(() => 0.5 - Math.random()).slice(0, 3)
                      return (
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="font-medium break-words">{prompt}</div>
                          <div>
                            {sample.map(key => `${key}: ${String(flat[key])}`).join(', ')}
                          </div>
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
                      onClick={() => onEdit(entry.json)}
                      className="gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopy(entry.json)}
                      className="gap-1"
                    >
                      <Clipboard className="w-4 h-4" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPreview(entry)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(entry.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
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
                onClear()
                setConfirmClear(false)
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
                {preview.json}
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
    </>
  )
}

export default HistoryPanel
