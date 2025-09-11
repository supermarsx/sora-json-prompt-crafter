import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  getSectionPresets,
  saveSectionPreset,
  removeSectionPreset,
  SectionPreset,
} from '@/lib/storage';
import { Trash2, Check, Save, List, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import PresetNameDialog from './PresetNameDialog';

interface PresetDropdownProps {
  /**
   * Key identifying the section that owns these presets.
   */
  sectionKey: string;
  /**
   * Current option values for the section; saved when a preset is created.
   */
  currentValues: Record<string, unknown>;
  /**
   * Callback invoked when a preset is applied to merge its values into state.
   */
  onApply: (values: Record<string, unknown>) => void;
}

/**
 * Dropdown component allowing users to save, apply, and delete presets for a specific section.
 *
 * @param props - Component props.
 * @returns A button-triggered dropdown menu listing available presets.
 */
export const PresetDropdown: React.FC<PresetDropdownProps> = ({
  sectionKey,
  currentValues,
  onApply,
}) => {
  const { t } = useTranslation();
  const [presets, setPresets] = React.useState<SectionPreset[]>([]);
  const [confirmDelete, setConfirmDelete] = React.useState<Record<string, boolean>>({});
  const deleteTimers = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [nameDialogOpen, setNameDialogOpen] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [renaming, setRenaming] = React.useState<SectionPreset | null>(null);

  /**
   * Loads all presets for the current section from storage.
   */
  const loadPresets = React.useCallback(() => {
    const all = getSectionPresets();
    setPresets(all[sectionKey] ?? []);
  }, [sectionKey]);

  React.useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  /**
   * Prompts the user for a preset name and saves the current section values.
   */
  const handleSave = () => {
    setRenaming(null);
    setNameInput('');
    setNameDialogOpen(true);
  };

  /**
   * Applies the given preset by passing its stored values to the parent component.
   *
   * @param preset - Preset to apply.
   */
  const handleApply = (preset: SectionPreset) => {
    onApply(preset.values);
  };

  /**
   * Deletes the preset with the provided name from storage.
   *
   * @param name - Name of the preset to remove.
   */
  const handleDelete = (name: string) => {
    removeSectionPreset(sectionKey, name);
    loadPresets();
  };

  const resetConfirmDelete = React.useCallback((name?: string) => {
    if (name) {
      if (deleteTimers.current[name]) {
        clearTimeout(deleteTimers.current[name]);
        delete deleteTimers.current[name];
      }
      setConfirmDelete((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    } else {
      Object.values(deleteTimers.current).forEach(clearTimeout);
      deleteTimers.current = {};
      setConfirmDelete({});
    }
  }, []);

  const handleDeleteClick = (
    e: React.MouseEvent,
    name: string,
  ) => {
    if (confirmDelete[name]) {
      resetConfirmDelete(name);
      handleDelete(name);
    } else {
      e.preventDefault();
      setConfirmDelete((prev) => ({ ...prev, [name]: true }));
      deleteTimers.current[name] = setTimeout(() => {
        resetConfirmDelete(name);
      }, 1500);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (!open) resetConfirmDelete();
    }}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <List className="w-4 h-4" /> {t('presets')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {presets.length === 0 && (
          <DropdownMenuItem disabled>{t('noPresets')}</DropdownMenuItem>
        )}
        {presets.map((preset) => (
          <DropdownMenuSub key={preset.name}>
            <DropdownMenuSubTrigger>{preset.name}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleApply(preset)} className="gap-2">
                <Check className="w-4 h-4" /> {t('apply')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRenaming(preset);
                  setNameInput(preset.name);
                  setNameDialogOpen(true);
                }}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" /> {t('rename')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleDeleteClick(e, preset.name)}
                className="gap-2"
              >
                <Trash2
                  className={cn(
                    'w-4 h-4',
                    confirmDelete[preset.name] && 'animate-pulse',
                  )}
                />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> {t('savePreset')}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <PresetNameDialog
        open={nameDialogOpen}
        onOpenChange={setNameDialogOpen}
        initialName={nameInput}
        title={renaming ? t('rename') : t('savePreset')}
        onSave={(name) => {
          if (renaming) {
            removeSectionPreset(sectionKey, renaming.name);
            saveSectionPreset(sectionKey, { name, values: renaming.values });
          } else {
            saveSectionPreset(sectionKey, { name, values: currentValues });
          }
          loadPresets();
        }}
      />
    </DropdownMenu>
  );
};
