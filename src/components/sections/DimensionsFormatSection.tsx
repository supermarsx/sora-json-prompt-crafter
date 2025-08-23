import React from 'react';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CollapsibleSection } from '../CollapsibleSection';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';

interface DimensionsFormatSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

/**
 * Section for choosing output dimensions and file format settings.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update the options state.
 * @param props.isEnabled - Whether the section is enabled.
 * @param props.onToggle - Toggle handler to enable or disable the section.
 */
export const DimensionsFormatSection: React.FC<
  DimensionsFormatSectionProps
> = ({ options, updateOptions, isEnabled, onToggle }) => {
  const { t, i18n } = useTranslation();
  const qualityOptions = [
    'maximum',
    'ultra',
    'excellent',
    'high',
    'good',
    'standard',
    'draft',
    'medium',
    'moderate',
    'minimum',
    'low',
    'below standard',
    'bad',
    'poor',
    'unacceptable',
    'defective',
  ];
  const aspectRatios = ['16:9', '21:9', '4:3', '1:1', '9:16'];
  const rawAspectRatioLabels =
    (i18n.getResource(
      i18n.language,
      'translation',
      'aspectRatioLabels',
    ) as Record<string, string>) || {};
  const aspectRatioLabels = aspectRatios.reduce(
    (labels, ratio) => ({ ...labels, [ratio]: rawAspectRatioLabels[ratio] }),
    {} as Record<string, string>,
  );
  const formatAspectRatio = (ratio: string) =>
    aspectRatioLabels[ratio] || ratio.replace(':', '×');

  return (
    <CollapsibleSection
      title="Dimensions & Format"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="aspect_ratio">{t('aspectRatio')}</Label>
          <Select
            value={options.aspect_ratio}
            onValueChange={(value: '16:9' | '21:9' | '4:3' | '1:1' | '9:16') =>
              updateOptions({ aspect_ratio: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio} value={ratio}>
                  {formatAspectRatio(ratio)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quality">{t('quality')}</Label>
          <Select
            value={options.quality}
            onValueChange={(value) =>
              updateOptions({ quality: value as SoraOptions['quality'] })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {qualityOptions.map((quality) => (
                <SelectItem key={quality} value={quality}>
                  {t(`qualityOptions.${quality}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ToggleField
          id="use_dimensions"
          label={t('useDimensions')}
          checked={options.use_dimensions}
          onCheckedChange={(checked) =>
            updateOptions({ use_dimensions: !!checked })
          }
        >
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="width">{t('width')}</Label>
              <Input
                id="width"
                type="number"
                value={options.width || 1024}
                onChange={(e) =>
                  updateOptions({ width: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="height">{t('height')}</Label>
              <Input
                id="height"
                type="number"
                value={options.height || 576}
                onChange={(e) =>
                  updateOptions({ height: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </ToggleField>

        <ToggleField
          id="use_output_format"
          label={t('useOutputFormat')}
          checked={options.use_output_format}
          onCheckedChange={(checked) =>
            updateOptions({ use_output_format: !!checked })
          }
        >
          <div>
            <Label htmlFor="output_format">{t('outputFormat')}</Label>
            <Select
              value={options.output_format}
              onValueChange={(value: 'png' | 'jpg' | 'webp') =>
                updateOptions({ output_format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ToggleField>

        <ToggleField
          id="use_dynamic_range"
          label={t('useDynamicRange')}
          checked={options.use_dynamic_range}
          onCheckedChange={(checked) =>
            updateOptions({ use_dynamic_range: !!checked })
          }
        >
          <div>
            <Label htmlFor="dynamic_range">{t('dynamicRange')}</Label>
            <Select
              value={options.dynamic_range}
              onValueChange={(value: 'SDR' | 'HDR') =>
                updateOptions({ dynamic_range: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SDR">SDR</SelectItem>
                <SelectItem value="HDR">HDR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ToggleField>
      </div>
    </CollapsibleSection>
  );
};
