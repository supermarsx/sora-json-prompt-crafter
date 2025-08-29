import { useEffect } from 'react';

interface ShortcutHandlers {
  onCopy?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

/**
 * Registers global keyboard shortcuts for copy, undo and redo actions.
 *
 * @param handlers Callback functions for the respective keyboard shortcuts.
 */
export function useKeyboardShortcuts({ onCopy, onUndo, onRedo }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase();
        switch (key) {
          case 'c':
            if (onCopy) {
              onCopy();
              e.preventDefault();
            }
            break;
          case 'z':
            if (e.shiftKey) {
              if (onRedo) {
                onRedo();
                e.preventDefault();
              }
            } else if (onUndo) {
              onUndo();
              e.preventDefault();
            }
            break;
          case 'y':
            if (onRedo) {
              onRedo();
              e.preventDefault();
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCopy, onUndo, onRedo]);
}

export default useKeyboardShortcuts;
