
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableDropdown } from '../SearchableDropdown';
import { MultiSelectDropdown } from '../MultiSelectDropdown';
import { CollapsibleSection } from '../CollapsibleSection';
import { SoraOptions } from '../Dashboard';

interface CameraCompositionSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
}

const shotTypeOptions = [
  "default", "as is", "not defined", "keep original", "establishing", "wide",
  "extreme wide", "very wide", "full", "long", "medium long", "cowboy",
  "medium", "medium close-up", "close-up", "extreme close-up", "detail",
  "insert", "over-the-shoulder", "point-of-view", "POV", "reaction",
  "two shot", "three shot", "group", "crowd", "aerial", "drone", "top-down",
  "bird's eye", "high angle", "low angle", "worm's eye", "tilted", "dutch angle",
  "profile", "cross", "reverse angle", "mirror", "reflection", "split screen",
  "mirror image", "tracking", "dolly", "push-in", "pull-out", "crane",
  "panoramic", "panorama", "static", "still", "freeze frame", "motion blur",
  "slow motion", "time-lapse", "macro", "cut-in", "cutaway", "insert detail",
  "subjective", "objective", "isometric"
];

const cameraAngleOptions = [
  "default", "as is", "not defined", "keep original", "eye-level", "high",
  "low", "bird's eye", "worm's eye", "overhead", "top-down", "shoulder-level",
  "knee-level", "hip-level", "ground-level", "canted", "dutch", "oblique",
  "reverse", "profile", "three-quarter", "front-facing", "back-facing",
  "behind", "above", "below", "under", "point-of-view", "POV",
  "over-the-shoulder", "mirror", "reflection", "through-glass",
  "through-object", "hidden", "peek", "peeking", "side", "diagonal", "tilted"
];

const compositionRulesOptions = [
  "rule of thirds", "golden ratio", "golden spiral", "diagonal method",
  "leading lines", "centered composition", "symmetry", "asymmetry",
  "dynamic symmetry", "frame within a frame", "foreground interest",
  "background interest", "balance", "visual weight", "negative space",
  "positive space", "triangular composition", "pyramid composition",
  "odds rule", "fill the frame", "breathing room", "eye line",
  "vanishing point", "converging lines", "implied lines", "S-curve",
  "L-curve", "Z-pattern", "C-pattern", "figure to ground", "isolated subject",
  "layering", "framing", "repetition", "pattern", "texture", "rhythm",
  "visual flow", "juxtaposition", "minimalism", "clutter", "cropping",
  "tight crop", "open composition", "closed composition", "high horizon",
  "low horizon", "eye-level perspective", "bird's eye perspective",
  "worm's eye perspective"
];

export const CameraCompositionSection: React.FC<CameraCompositionSectionProps> = ({
  options,
  updateOptions
}) => {
  const handleCompositionRulesChange = (selectedRules: string[]) => {
    updateOptions({ composition_rules: selectedRules });
  };

  return (
    <CollapsibleSection title="Camera & Composition">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            onCheckedChange={(checked) => updateOptions({ use_camera_angle: !!checked })}
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
            onValueChange={(value: 'center' | 'left' | 'right' | 'top' | 'bottom') => 
              updateOptions({ subject_focus: value })
            }
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

        <div className="md:col-span-2">
          <Label>Composition Rules</Label>
          <MultiSelectDropdown
            options={compositionRulesOptions}
            value={options.composition_rules}
            onValueChange={handleCompositionRulesChange}
            label="Composition Rules"
            placeholder="Select composition rules..."
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};
