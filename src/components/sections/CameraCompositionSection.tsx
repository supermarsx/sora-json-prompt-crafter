import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { MultiSelectDropdown } from '../MultiSelectDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';
import {
  shotTypeOptions,
  cameraAngleOptions,
  compositionRulesOptions,
  cameraTypeOptions,
  lensTypeOptions,
  apertureOptions,
  blurStyleOptions,
  depthOfFieldOptions,
} from '@/data/cameraPresets';

interface CameraCompositionSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const CameraCompositionSection: React.FC<
  CameraCompositionSectionProps
> = ({ options, updateOptions, isEnabled, onToggle }) => {
  const handleCompositionRulesChange = (selectedRules: string[]) => {
    updateOptions({ composition_rules: selectedRules });
  };

  return (
    <CollapsibleSection
      title="Camera & Composition"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label>Camera Type</Label>
          <SearchableDropdown
            options={cameraTypeOptions}
            value={options.camera_type}
            onValueChange={(value) => updateOptions({ camera_type: value })}
            label="Camera Type"
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_lens_type"
            checked={options.use_lens_type}
            onCheckedChange={(checked) =>
              updateOptions({ use_lens_type: !!checked })
            }
          />
          <Label htmlFor="use_lens_type">Use Lens Type</Label>
        </div>

        <div>
          <Label>Lens Type</Label>
          <SearchableDropdown
            options={lensTypeOptions}
            value={options.lens_type}
            onValueChange={(value) => updateOptions({ lens_type: value })}
            label="Lens Type"
            disabled={!options.use_lens_type}
          />
        </div>

        <div>
          <Label>Shot Type</Label>
          <SearchableDropdown
            options={shotTypeOptions}
            value={options.shot_type}
            onValueChange={(value) => updateOptions({ shot_type: value })}
            label="Shot Type"
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_camera_angle"
            checked={options.use_camera_angle}
            onCheckedChange={(checked) =>
              updateOptions({ use_camera_angle: !!checked })
            }
          />
          <Label htmlFor="use_camera_angle">Use Camera Angle</Label>
        </div>

        <div>
          <Label>Camera Angle</Label>
          <SearchableDropdown
            options={cameraAngleOptions}
            value={options.camera_angle}
            onValueChange={(value) => updateOptions({ camera_angle: value })}
            label="Camera Angle"
            disabled={!options.use_camera_angle}
          />
        </div>

        <div>
          <Label htmlFor="subject_focus">Subject Focus</Label>
          <Select
            value={options.subject_focus}
            onValueChange={(
              value: 'center' | 'left' | 'right' | 'top' | 'bottom',
            ) => updateOptions({ subject_focus: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Composition Rules</Label>
          <MultiSelectDropdown
            options={compositionRulesOptions}
            value={options.composition_rules}
            onValueChange={handleCompositionRulesChange}
            label="Composition Rules"
            placeholder="Select composition rules..."
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_aperture"
            checked={options.use_aperture}
            onCheckedChange={(checked) =>
              updateOptions({ use_aperture: !!checked })
            }
          />
          <Label htmlFor="use_aperture">Use Aperture</Label>
        </div>

        <div>
          <Label>Aperture</Label>
          <SearchableDropdown
            options={apertureOptions}
            value={options.aperture}
            onValueChange={(value) => updateOptions({ aperture: value })}
            label="Aperture"
            disabled={!options.use_aperture}
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_dof"
            checked={options.use_dof}
            onCheckedChange={(checked) => updateOptions({ use_dof: !!checked })}
          />
          <Label htmlFor="use_dof">Use Depth of Field</Label>
        </div>

        <div>
          <Label>Depth of Field</Label>
          <SearchableDropdown
            options={depthOfFieldOptions}
            value={options.depth_of_field || 'default'}
            onValueChange={(value) => updateOptions({ depth_of_field: value })}
            label="Depth of Field Options"
            disabled={!options.use_dof}
          />
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_blur_style"
            checked={options.use_blur_style}
            onCheckedChange={(checked) =>
              updateOptions({ use_blur_style: !!checked })
            }
          />
          <Label htmlFor="use_blur_style">Use Blur Style</Label>
        </div>

        <div>
          <Label>Blur Style</Label>
          <SearchableDropdown
            options={blurStyleOptions}
            value={options.blur_style || 'default'}
            onValueChange={(value) => updateOptions({ blur_style: value })}
            label="Blur Style Options"
            disabled={!options.use_blur_style}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
