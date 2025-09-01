import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';
import { useResizeTracker } from '@/hooks/use-resize-tracker';
import { AnalyticsEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';
import { PresetDropdown } from '../PresetDropdown';

interface PromptSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  trackingEnabled: boolean;
}

/**
 * Section for entering the main prompt and optional negative prompt text.
 *
 * @param props - Component props.
 * @param props.options - Current Sora options.
 * @param props.updateOptions - Function to update option values.
 * @param props.trackingEnabled - Whether analytics tracking is enabled.
 */
export const PromptSection: React.FC<PromptSectionProps> = ({
  options,
  updateOptions,
  trackingEnabled,
}) => {
  const { t } = useTranslation();
  const promptRef = React.useRef<HTMLTextAreaElement>(null);
  const negativeRef = React.useRef<HTMLTextAreaElement>(null);
  useResizeTracker(promptRef, trackingEnabled, AnalyticsEvent.PromptResize);
  useResizeTracker(
    negativeRef,
    trackingEnabled,
    AnalyticsEvent.NegativePromptResize,
  );

  /**
   * Restores prompt and negative prompt fields to their defaults.
   */
  const handleReset = () => {
    updateOptions({
      prompt: DEFAULT_OPTIONS.prompt,
      negative_prompt: DEFAULT_OPTIONS.negative_prompt,
      use_negative_prompt: DEFAULT_OPTIONS.use_negative_prompt,
    });
  };
  const currentValues = {
    prompt: options.prompt,
    negative_prompt: options.negative_prompt,
    use_negative_prompt: options.use_negative_prompt,
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <PresetDropdown
          sectionKey="prompt"
          currentValues={currentValues}
          onApply={(values) =>
            updateOptions(values as Partial<SoraOptions>)
          }
        />
        <Button variant="outline" size="sm" onClick={handleReset}>
          {t('reset')}
        </Button>
      </div>
      <div>
        <Label htmlFor="prompt" className="text-base font-semibold mb-2 block">
          {t('prompt')}
        </Label>
        <Textarea
          id="prompt"
          value={options.prompt}
          onChange={(e) => updateOptions({ prompt: e.target.value })}
          placeholder={t('promptPlaceholder')}
          className="min-h-[100px] resize-y"
          ref={promptRef}
        />
      </div>

      <ToggleField
        id="use_negative_prompt"
        label={t('negativePrompt')}
        checked={options.use_negative_prompt}
        onCheckedChange={(checked) =>
          updateOptions({ use_negative_prompt: !!checked })
        }
      >
        <Textarea
          id="negative_prompt"
          value={options.negative_prompt}
          onChange={(e) => updateOptions({ negative_prompt: e.target.value })}
          placeholder={t('negativePromptPlaceholder')}
          className="min-h-[80px] resize-y"
          ref={negativeRef}
          aria-label={t('negativePrompt')}
        />
      </ToggleField>
    </div>
  );
};
