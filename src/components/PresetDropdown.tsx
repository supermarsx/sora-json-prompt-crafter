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
    const name = window.prompt(t('presetNamePrompt'));
    if (!name) return;
    saveSectionPreset(sectionKey, { name, values: currentValues });
    loadPresets();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {t('presets')}
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
              <DropdownMenuItem onClick={() => handleApply(preset)}>
                {t('apply')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(preset.name)}>
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSave}>
          {t('savePreset')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
