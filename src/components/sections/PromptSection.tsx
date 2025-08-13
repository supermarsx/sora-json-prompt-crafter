import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleField } from '../ToggleField';
import type { SoraOptions } from '@/lib/soraOptions';
import { useResizeTracker } from '@/hooks/use-resize-tracker';

interface PromptSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  trackingEnabled: boolean;
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  options,
  updateOptions,
  trackingEnabled,
}) => {
  const { t } = useTranslation();
  const promptRef = React.useRef<HTMLTextAreaElement>(null);
  const negativeRef = React.useRef<HTMLTextAreaElement>(null);
  useResizeTracker(promptRef, trackingEnabled, 'prompt_resize');
  useResizeTracker(negativeRef, trackingEnabled, 'negative_prompt_resize');
  return (
    <div className="space-y-4">
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
