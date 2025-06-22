import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { trackEvent } from '@/lib/analytics'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Copy,
  Check,
  Share,
  Import,
  History,
  RotateCcw,
  RefreshCw,
  Shuffle,
  Eye,
  EyeOff,
  Trash2,
  Cog,
  ChevronDown,
  ChevronUp,
  MoveDown,
} from 'lucide-react';

interface ActionBarProps {
  onCopy: () => void;
  onClear: () => void;
  onShare: () => void;
  onImport: () => void;
  onHistory: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  onRandomize: () => void;
  trackingEnabled: boolean;
  onToggleTracking: () => void;
  copied: boolean;
  showJumpToJson?: boolean;
  onJumpToJson?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onCopy,
  onClear,
  onShare,
  onImport,
  onHistory,
  onReset,
  onRegenerate,
  onRandomize,
  trackingEnabled,
  onToggleTracking,
  copied,
  showJumpToJson,
  onJumpToJson,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [clearing, setClearing] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setMinimized(false)
            trackEvent(trackingEnabled, 'restore_actions')
          }}
          variant="default"
          size="sm"
          className="gap-1"
        >
          Actions
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border rounded-md shadow-lg p-3 flex flex-wrap items-center gap-2">
      <Button onClick={onCopy} variant="outline" size="sm" className="gap-2">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        Copy
      </Button>
      <Button
        onClick={() => {
          setClearing(true);
          onClear();
          setTimeout(() => setClearing(false), 500);
        }}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Trash2 className={`w-4 h-4 ${clearing ? 'animate-spin' : ''}`} />
        Clear
      </Button>
      <Button onClick={onShare} variant="outline" size="sm" className="gap-2">
        <Share className="w-4 h-4" />
        Share
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Cog className="w-4 h-4" /> Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onImport} className="gap-2">
            <Import className="w-4 h-4" /> Import
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onReset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onRegenerate} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onRandomize} className="gap-2">
            <Shuffle className="w-4 h-4" /> Randomize
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleTracking()
              const newStatus = !trackingEnabled
              toast.success(newStatus ? 'Tracking enabled' : 'Tracking disabled')
              trackEvent(trackingEnabled, 'toggle_tracking', { enabled: newStatus })
            }}
            className="gap-2"
          >
            {trackingEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> Disable Tracking
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Enable Tracking
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={onHistory} variant="outline" size="sm" className="gap-2">
        <History className="w-4 h-4" />
        History
      </Button>
      {showJumpToJson && (
        <Button
          onClick={() => {
            onJumpToJson?.()
            trackEvent(trackingEnabled, 'jump_to_json')
          }}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <MoveDown className="w-4 h-4" />
          Jump to JSON
        </Button>
      )}
      <Button
        onClick={() => {
          setMinimized(true)
          trackEvent(trackingEnabled, 'minimize_actions')
        }}
        variant="ghost"
        size="icon"
        className="ml-auto"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
