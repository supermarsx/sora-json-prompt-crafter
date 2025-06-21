
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SoraOptions } from '../Dashboard';

interface PromptSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

export const PromptSection: React.FC<PromptSectionProps> = ({ options, updateOptions }) => {
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
        />
      </div>
      
      <div>
        <Label htmlFor="negative_prompt" className="text-base font-semibold mb-2 block">
          Negative Prompt
        </Label>
        <Textarea
          id="negative_prompt"
          value={options.negative_prompt}
          onChange={(e) => updateOptions({ negative_prompt: e.target.value })}
          placeholder="Describe what you want to avoid..."
          className="min-h-[80px] resize-y"
        />
      </div>
    </div>
  );
};
