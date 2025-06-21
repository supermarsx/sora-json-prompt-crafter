import React, { useState } from 'react'
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
import { Clipboard, Trash2, Edit, Eye } from 'lucide-react'

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
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  open,
  onOpenChange,
  history,
  onDelete,
  onClear,
  onCopy,
  onEdit,
}) => {
  const [preview, setPreview] = useState<HistoryEntry | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>History</DialogTitle>
          </DialogHeader>
          <div className="mb-4 text-right">
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
                    <span className="truncate max-w-[50%]">
                      {entry.json.slice(0, 40)}...
                    </span>
                  </div>
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
                  No history yet.
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
    </>
  )
}

export default HistoryPanel
