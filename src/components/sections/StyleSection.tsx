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
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import { stylePresets } from '@/data/stylePresets';

interface StyleSectionProps {
  options: SoraOptions;
  updateNestedOptions: (path: string, value: unknown) => void;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const StyleSection: React.FC<StyleSectionProps> = ({
  options,
  updateNestedOptions,
  updateOptions,
}) => {
  const { t } = useTranslation();
  const formatLabel = (value: string) => {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <CollapsibleSection
      title="Style Preset"
      isOptional={true}
      isEnabled={options.use_style_preset}
      onToggle={(enabled) => updateOptions({ use_style_preset: enabled })}
    >
      <div className="grid grid-cols-1 gap-4">
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
          <Select
            value={options.style_preset.style}
            onValueChange={(value) =>
              updateNestedOptions('style_preset.style', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stylePresets[
                options.style_preset.category as keyof typeof stylePresets
              ]?.map((style) => (
                <SelectItem key={style} value={style}>
                  {formatLabel(style)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CollapsibleSection>
  );
};
