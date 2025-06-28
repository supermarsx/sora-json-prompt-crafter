import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner-toast';
import { trackEvent } from '@/lib/analytics';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
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
  Send,
  Cog,
  ChevronDown,
  ChevronUp,
  MoveDown,
} from 'lucide-react';

interface ActionBarProps {
  onCopy: () => void;
  onClear: () => void;
  onShare: () => void;
  onSendToSora: () => void;
  userscriptInstalled: boolean;
  onImport: () => void;
  onHistory: () => void;
  onReset: () => void;
  onRegenerate: () => void;
  onRandomize: () => void;
  trackingEnabled: boolean;
  soraToolsEnabled: boolean;
  onToggleSoraTools: () => void;
  onToggleTracking: () => void;
  headerButtonsEnabled: boolean;
  onToggleHeaderButtons: () => void;
  logoEnabled: boolean;
  onToggleLogo: () => void;
  copied: boolean;
  showJumpToJson?: boolean;
  onJumpToJson?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onCopy,
  onClear,
  onShare,
  onSendToSora,
  userscriptInstalled,
  onImport,
  onHistory,
  onReset,
  onRegenerate,
  onRandomize,
  trackingEnabled,
  soraToolsEnabled,
  onToggleSoraTools,
  onToggleTracking,
  headerButtonsEnabled,
  onToggleHeaderButtons,
  logoEnabled,
  onToggleLogo,
  copied,
  showJumpToJson,
  onJumpToJson,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmDisableTracking, setConfirmDisableTracking] = useState(false);
  const [confirmEnableTracking, setConfirmEnableTracking] = useState(false);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setMinimized(false);
            trackEvent(trackingEnabled, 'restore_actions');
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
      {soraToolsEnabled && userscriptInstalled && (
        <Button
          onClick={onSendToSora}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Send to Sora
        </Button>
      )}
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
              if (trackingEnabled) {
                setConfirmDisableTracking(true);
              } else {
                setConfirmEnableTracking(true);
              }
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
          <DropdownMenuItem
            onSelect={onToggleSoraTools}
            className="gap-2 hidden"
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
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleHeaderButtons();
              trackEvent(trackingEnabled, 'toggle_header_buttons', {
                enabled: !headerButtonsEnabled,
              });
            }}
            className="gap-2"
          >
            {headerButtonsEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Header Buttons
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Header Buttons
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              onToggleLogo();
              trackEvent(trackingEnabled, 'toggle_logo', {
                enabled: !logoEnabled,
              });
            }}
            className="gap-2"
          >
            {logoEnabled ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Logo
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Logo
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
            onJumpToJson?.();
            trackEvent(trackingEnabled, 'jump_to_json');
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
          setMinimized(true);
          trackEvent(trackingEnabled, 'minimize_actions');
        }}
        variant="ghost"
        size="icon"
        className="ml-auto"
      >
        <ChevronDown className="w-4 h-4" />
      </Button>

      <AlertDialog
        open={confirmDisableTracking}
        onOpenChange={setConfirmDisableTracking}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable tracking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop sending anonymous usage data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleTracking();
                toast.success('Tracking disabled');
                trackEvent(true, 'disable_tracking_confirm');
                trackEvent(true, 'toggle_tracking', { enabled: false });
                setConfirmDisableTracking(false);
              }}
            >
              Disable
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
            <AlertDialogTitle>Enable tracking?</AlertDialogTitle>
            <AlertDialogDescription>
              This allows sending anonymous usage data to help improve the app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleTracking();
                toast.success('Tracking enabled');
                trackEvent(true, 'enable_tracking_confirm');
                trackEvent(true, 'toggle_tracking', { enabled: true });
                setConfirmEnableTracking(false);
              }}
            >
              Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
