
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
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
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

const cameraTypeOptions = [
  "default (auto/any camera)",
  "not defined",
  "as is",
  "keep original",
  "DSLR (digital single-lens reflex)",
  "mirrorless (compact, digital interchangeable lens)",
  "rangefinder (classic street photography)",
  "SLR (film single-lens reflex)",
  "point and shoot (compact, easy use)",
  "bridge camera (hybrid zoom)",
  "medium format (pro, ultra high-res)",
  "large format (fine art, tilt/shift)",
  "instant camera (Polaroid, Instax style)",
  "disposable camera (lo-fi, retro)",
  "pinhole camera (experimental, soft focus)",
  "toy camera (Holga, Diana, quirky looks)",
  "twin-lens reflex (TLR, vintage)",
  "box camera (early 20th century style)",
  "folding camera (vintage portable)",
  "subminiature camera (spy, tiny format)",
  "action camera (GoPro, sports)",
  "360 camera (panoramic, immersive)",
  "smartphone camera (modern, casual)",
  "old phone camera (lo-fi, nostalgic)",
  "old iPhone camera (retro digital look)",
  "webcam (lo-fi, candid)",
  "camcorder (video, home movies)",
  "handheld camcorder (retro video)",
  "old handheld camera (vintage, shaky aesthetic)",
  "film camera (general analog)",
  "super 8 camera (home movies, film grain)",
  "vhs camcorder (analog video aesthetic)",
  "security camera (CCTV, fisheye)",
  "dashcam (in-car, wide angle)",
  "drone camera (aerial, birds-eye)",
  "thermal camera (heat vision, IR effect)",
  "infrared camera (night vision, special effect)",
  "night vision camera (low-light scenes)",
  "stereo camera (3D, VR)",
  "holographic camera (sci-fi, virtual capture)",
  "digital back (pro, modular studio)",
  "modular camera system (customizable pro)",
  "underwater camera (diving, marine shots)",
  "body camera (POV, documentary)",
  "surveillance camera (hidden, covert)",
  "robotic camera (automated, sci-fi)",
  "AI camera (smart, auto-enhanced)",
  "cinema camera (professional movie making)",
  "IMAX camera (ultra-wide, blockbuster)",
  "panoramic camera (wide landscapes)",
  "tilt-shift camera (architectural, creative DOF)",
  "field camera (large format outdoor)",
  "studio camera (broadcast, TV)",
  "toy digital camera (kids, low-fi)",
  "Sony Alpha 1 (flagship mirrorless)",
  "Sony Alpha 7R V (high-res full-frame)",
  "Sony FX6 (cinema line)",
  "Sony Venice (digital cinema camera)",
  "RED Komodo (compact cinema)",
  "RED V-Raptor (high-end cinema)",
  "RED Helium 8K (legendary cinema)",
  "Nikon Z9 (flagship mirrorless)",
  "Nikon D6 (pro DSLR)",
  "Nikon F6 (classic film SLR)",
  "Panasonic GH6 (hybrid mirrorless)",
  "Panasonic S1H (cinema mirrorless)",
  "Fujifilm GFX100 (medium format)",
  "Fujifilm X-T5 (APS-C mirrorless)",
  "Blackmagic Pocket Cinema Camera 6K",
  "Blackmagic URSA Mini Pro 12K",
  "DJI Osmo Pocket (portable gimbal)",
  "DJI Mavic 3 (drone camera)",
  "GoPro HERO12 Black (action camera)",
  "GoPro Max (360 action cam)"
];

export const CameraCompositionSection: React.FC<CameraCompositionSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle
}) => {
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
      </div>
    </CollapsibleSection>
  );
};
