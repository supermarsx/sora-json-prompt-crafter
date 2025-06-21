import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  Trash2,
  ChevronDown,
  ChevronUp,
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
  copied: boolean;
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
  copied,
}) => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setMinimized(false)} variant="default" size="sm" className="gap-1">
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
      <Button onClick={onClear} variant="outline" size="sm" className="gap-2">
        <Trash2 className="w-4 h-4" />
        Clear
      </Button>
      <Button onClick={onShare} variant="outline" size="sm" className="gap-2">
        <Share className="w-4 h-4" />
        Share
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Import className="w-4 h-4" /> Manage
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
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={onHistory} variant="outline" size="sm" className="gap-2">
        <History className="w-4 h-4" />
        History
      </Button>
      <Button onClick={() => setMinimized(true)} variant="ghost" size="icon" className="ml-auto">
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
};
