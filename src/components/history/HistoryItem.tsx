import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Trash2, Edit, Eye, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '@/lib/analytics';
import type { HistoryEntry } from '../HistoryPanel';

interface HistoryItemProps {
  entry: HistoryEntry;
  onEdit: (json: string) => void;
  onCopy: (json: string) => void;
  onDelete: (id: number) => void;
  onPreview: (entry: HistoryEntry) => void;
  trackingEnabled: boolean;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  entry,
  onEdit,
  onCopy,
  onDelete,
  onPreview,
  trackingEnabled,
}) => {
  const { t } = useTranslation();
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="border p-3 rounded-md space-y-2">
      <div className="text-xs text-muted-foreground flex justify-between">
        <span>{entry.date}</span>
      </div>
      {(() => {
        try {
          const obj = JSON.parse(entry.json);
          return (
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="font-medium break-words">{obj.prompt}</div>
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
            setEdited(true);
            setTimeout(() => setEdited(false), 1500);
          }}
          className={`gap-1 ${edited ? 'text-green-600 animate-pulse' : ''}`}
        >
          {edited ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}{' '}
          {edited ? t('edited') : t('edit')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            trackEvent(trackingEnabled, 'history_copy');
            onCopy(entry.json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={`gap-1 ${copied ? 'text-green-600 animate-pulse' : ''}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}{' '}
          {copied ? t('copied') : t('copy')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            trackEvent(trackingEnabled, 'history_preview');
            onPreview(entry);
          }}
          className="gap-1"
        >
          <Eye className="w-4 h-4" /> {t('preview')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            if (confirmDelete) {
              trackEvent(trackingEnabled, 'history_delete_confirm');
              onDelete(entry.id);
              setConfirmDelete(false);
            } else {
              setConfirmDelete(true);
              setTimeout(() => setConfirmDelete(false), 1500);
            }
          }}
          className={`gap-1 ${confirmDelete ? 'animate-pulse' : ''}`}
        >
          <Trash2 className="w-4 h-4" />
          {confirmDelete ? t('confirm') : t('delete')}
        </Button>
      </div>
    </div>
  );
};

export default HistoryItem;
