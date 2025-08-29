import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

interface CoreSettingsSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}


/**
 * Section for adjusting fundamental generation parameters such as seed,
 * quality, and guidance settings.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update the options state.
 * @param props.isEnabled - Whether this section is active.
 * @param props.onToggle - Handler to enable or disable the section.
 */
export const CoreSettingsSection: React.FC<CoreSettingsSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  const { t } = useTranslation();

  const handleReset = () => {
    updateOptions({
      seed: DEFAULT_OPTIONS.seed,
      steps: DEFAULT_OPTIONS.steps,
      guidance_scale: DEFAULT_OPTIONS.guidance_scale,
      temperature: DEFAULT_OPTIONS.temperature,
      cfg_rescale: DEFAULT_OPTIONS.cfg_rescale,
    });
  };
  return (
    <CollapsibleSection
      title={t('coreSettings')}
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            {t('reset')}
          </Button>
        </div>
        <div>
          <Label htmlFor="seed">{t('seed')}</Label>
          <Input
            id="seed"
            type="number"
            value={options.seed || ''}
            onChange={(e) =>
              updateOptions({
                seed: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder={t('randomSeedPlaceholder')}
          />
        </div>


        <div>
          <Label>{t('stepsLabel', { count: options.steps })}</Label>
          <Slider
            value={[options.steps]}
            onValueChange={([value]) => updateOptions({ steps: value })}
            min={1}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>
            {t('guidanceScaleLabel', { value: options.guidance_scale })}
          </Label>
          <Slider
            value={[options.guidance_scale]}
            onValueChange={([value]) =>
              updateOptions({ guidance_scale: value })
            }
            min={1}
            max={20}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t('temperatureLabel', { value: options.temperature })}</Label>
          <Slider
            value={[options.temperature]}
            onValueChange={([value]) => updateOptions({ temperature: value })}
            min={0.1}
            max={2.0}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t('cfgRescaleLabel', { value: options.cfg_rescale })}</Label>
          <Slider
            value={[options.cfg_rescale]}
            onValueChange={([value]) => updateOptions({ cfg_rescale: value })}
            min={0}
            max={1}
            step={0.05}
            className="mt-2"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
