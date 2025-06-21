
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CollapsibleSection } from '../CollapsibleSection';
import { SoraOptions } from '../Dashboard';

interface CoreSettingsSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const qualityOptions = [
  'defective', 'unacceptable', 'poor', 'bad', 'below standard', 
  'minimum', 'moderate', 'medium', 'draft', 'standard', 
  'good', 'high', 'excellent', 'ultra', 'maximum', 'low'
].sort();

export const CoreSettingsSection: React.FC<CoreSettingsSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  return (
    <CollapsibleSection
      title="Core Settings"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="seed">Seed</Label>
          <Input
            id="seed"
            type="number"
            value={options.seed || ''}
            onChange={(e) => updateOptions({ seed: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="Random seed (leave empty for random)"
          />
        </div>
        
        <div>
          <Label htmlFor="quality">Quality</Label>
          <Select value={options.quality} onValueChange={(value) => updateOptions({ quality: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {qualityOptions.map((quality) => (
                <SelectItem key={quality} value={quality}>
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Steps: {options.steps}</Label>
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
          <Label>Guidance Scale: {options.guidance_scale}</Label>
          <Slider
            value={[options.guidance_scale]}
            onValueChange={([value]) => updateOptions({ guidance_scale: value })}
            min={1}
            max={20}
            step={0.1}
            className="mt-2"
          />
        </div>
        
        <div>
          <Label>Temperature: {options.temperature}</Label>
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
          <Label>CFG Rescale: {options.cfg_rescale}</Label>
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
