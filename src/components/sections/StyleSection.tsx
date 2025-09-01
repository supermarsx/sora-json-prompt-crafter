import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableDropdown } from '../SearchableDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import { stylePresets } from '@/data/stylePresets';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';

interface StyleSectionProps {
  options: SoraOptions;
  updateNestedOptions: (path: string, value: unknown) => void;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

/**
 * Section for selecting and enabling preset artistic styles.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateNestedOptions - Setter for nested style preset fields.
 * @param props.updateOptions - Updates top-level option flags.
 */
export const StyleSection: React.FC<StyleSectionProps> = ({
  options,
  updateNestedOptions,
  updateOptions,
}) => {
  const { t } = useTranslation();
  /**
   * Converts a style value into a human-readable label.
   *
   * @param value - Raw style preset value.
   * @returns Capitalized label for display.
   */
  const formatLabel = (value: string) => {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const currentValues = {
    use_style_preset: options.use_style_preset,
    style_preset: options.style_preset,
  };

  return (
    <CollapsibleSection
      title="Style Preset"
      isOptional={true}
      isEnabled={options.use_style_preset}
      onToggle={(enabled) => updateOptions({ use_style_preset: enabled })}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end space-x-2">
          <PresetDropdown
            sectionKey="style"
            currentValues={currentValues}
            onApply={(values) => {
              const v = values as Partial<SoraOptions>;
              if ('use_style_preset' in v) {
                updateOptions({
                  use_style_preset: v.use_style_preset as boolean,
                });
              }
              if (v.style_preset) {
                const preset = v.style_preset as SoraOptions['style_preset'];
                updateNestedOptions('style_preset.category', preset.category);
                updateNestedOptions('style_preset.style', preset.style);
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              updateOptions({
                use_style_preset: DEFAULT_OPTIONS.use_style_preset,
              });
              updateNestedOptions(
                'style_preset.category',
                DEFAULT_OPTIONS.style_preset.category,
              );
              updateNestedOptions(
                'style_preset.style',
                DEFAULT_OPTIONS.style_preset.style,
              );
            }}
          >
            {t('reset')}
          </Button>
        </div>
        <div>
          <Label htmlFor="style_category">{t('styleCategory')}</Label>
          <Select
            value={options.style_preset.category}
            onValueChange={(value) =>
              updateNestedOptions('style_preset.category', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(stylePresets).map((category) => (
                <SelectItem key={category} value={category}>
                  {t(`stylePresetCategories.${category}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="style_preset">{t('style')}</Label>
          <SearchableDropdown
            options={
              stylePresets[
                options.style_preset.category as keyof typeof stylePresets
              ] ?? []
            }
            value={options.style_preset.style}
            onValueChange={(value) =>
              updateNestedOptions('style_preset.style', value)
            }
            label="Style Options"
            placeholder="Select style..."
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
