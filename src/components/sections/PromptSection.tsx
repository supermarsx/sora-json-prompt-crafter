import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  const promptRef = React.useRef<HTMLTextAreaElement>(null);
  const negativeRef = React.useRef<HTMLTextAreaElement>(null);
  useResizeTracker(promptRef, trackingEnabled, 'prompt_resize');
  useResizeTracker(negativeRef, trackingEnabled, 'negative_prompt_resize');
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="prompt" className="text-base font-semibold mb-2 block">
          Prompt
        </Label>
        <Textarea
          id="prompt"
          value={options.prompt}
          onChange={(e) => updateOptions({ prompt: e.target.value })}
          placeholder="Describe what you want to generate..."
          className="min-h-[100px] resize-y"
          ref={promptRef}
        />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Checkbox
            id="use_negative_prompt"
            checked={options.use_negative_prompt}
            onCheckedChange={(checked) =>
              updateOptions({ use_negative_prompt: !!checked })
            }
          />
          <Label htmlFor="negative_prompt" className="text-base font-semibold">
            Negative Prompt
          </Label>
        </div>
        <Textarea
          id="negative_prompt"
          value={options.negative_prompt}
          onChange={(e) => updateOptions({ negative_prompt: e.target.value })}
          placeholder="Describe what you want to avoid..."
          className="min-h-[80px] resize-y"
          disabled={!options.use_negative_prompt}
          ref={negativeRef}
        />
      </div>
    </div>
  );
};
