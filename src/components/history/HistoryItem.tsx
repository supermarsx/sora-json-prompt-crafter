import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, Trash2, Edit, Eye, Check, Star, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import type { HistoryEntry } from '../HistoryPanel';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { formatDisplayDate } from '@/lib/date';

interface HistoryItemProps {
  entry: HistoryEntry;
  onEdit: (entry: HistoryEntry) => void;
  onCopy: (entry: HistoryEntry) => void;
  onDelete: (id: number) => void;
  onPreview: (entry: HistoryEntry) => void;
  trackingEnabled: boolean;
  onToggleFavorite: (id: number) => void;
  onRename: (entry: HistoryEntry) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  entry,
  onEdit,
  onCopy,
  onDelete,
  onPreview,
  trackingEnabled,
  onToggleFavorite,
  onRename,
}) => {
  const { t } = useTranslation();
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="border p-3 rounded-md space-y-2">
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{formatDisplayDate(new Date(entry.date))}</span>
        </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-medium break-words text-foreground">
          {entry.title}
        </div>
        {(() => {
          try {
            const obj = JSON.parse(entry.json);
            return <div className="break-words">{obj.prompt}</div>;
          } catch {
            return null;
          }
        })()}
      </div>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                trackEvent(trackingEnabled, AnalyticsEvent.HistoryEdit);
                onEdit(entry);
                setEdited(true);
                setTimeout(() => setEdited(false), 1500);
              }}
              className={`gap-1 ${edited ? 'text-green-600 animate-pulse' : ''}`}
            >
              {edited ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}{' '}
              {edited ? t('edited') : t('edit')} ({entry.editCount})
            </Button>
          </TooltipTrigger>
          <TooltipContent>{edited ? t('edited') : t('edit')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                trackEvent(trackingEnabled, AnalyticsEvent.HistoryCopy);
                onCopy(entry);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className={`gap-1 ${copied ? 'text-green-600 animate-pulse' : ''}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}{' '}
              {copied ? t('copied') : t('copy')} ({entry.copyCount})
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? t('copied') : t('copy')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRename(entry)}
              className="gap-1"
            >
              <Pencil className="w-4 h-4" /> {t('rename', { defaultValue: 'Rename' })}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('rename', { defaultValue: 'Rename' })}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                trackEvent(trackingEnabled, AnalyticsEvent.HistoryPreview);
                onPreview(entry);
              }}
              className="gap-1"
            >
              <Eye className="w-4 h-4" /> {t('preview')}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('preview')}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={entry.favorite ? 'default' : 'outline'}
              onClick={() => onToggleFavorite(entry.id)}
              className="gap-1"
              aria-label={entry.favorite
                ? t('unfavorite', { defaultValue: 'Unfavorite' })
                : t('favorite', { defaultValue: 'Favorite' })}
            >
              <Star
                className={`w-4 h-4 ${
                  entry.favorite ? 'fill-current text-yellow-500' : ''
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {entry.favorite
              ? t('unfavorite', { defaultValue: 'Unfavorite' })
              : t('favorite', { defaultValue: 'Favorite' })}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirmDelete) {
                  trackEvent(trackingEnabled, AnalyticsEvent.HistoryDeleteConfirm);
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
          </TooltipTrigger>
          <TooltipContent>
            {confirmDelete ? t('confirm') : t('delete')}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default HistoryItem;
