
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

const lensTypeOptions = [
  "default",
  "as is",
  "not defined",
  "keep original",
  "standard 50mm",
  "wide 24mm",
  "ultra wide 14mm",
  "fisheye 8mm",
  "telephoto 85mm",
  "super telephoto 300mm",
  "macro 100mm",
  "micro 5mm",
  "zoom 24-70mm",
  "prime 35mm",
  "prime 85mm",
  "prime 135mm",
  "anamorphic 40mm",
  "cinema 50mm",
  "portrait 85mm",
  "tilt-shift 90mm",
  "pinhole 35mm",
  "soft focus 80mm",
  "mirror 500mm",
  "catadioptric 250mm",
  "infrared 720nm",
  "ultraviolet 365nm",
  "vintage 35mm",
  "toy 22mm",
  "plastic 35mm",
  "crystal 28mm",
  "split diopter 50mm",
  "dual 35mm",
  "periscope 24mm",
  "rectilinear 24mm",
  "defocus 100mm",
  "superzoom 18-200mm",
  "perspective control 24mm"
];

const apertureOptions = [
  "default (auto aperture)",
  "not defined",
  "as is",
  "f/0.7 (ultra fast, extreme bokeh, specialty lens)",
  "f/0.8 (ultra fast, creamy background blur)",
  "f/0.95 (legendary bokeh, dreamy rendering)",
  "f/1.0 (super shallow depth, rare portraiture)",
  "f/1.2 (artistic bokeh, extreme low light)",
  "f/1.4 (classic fast prime, buttery background)",
  "f/1.7 (vintage look, character rendering)",
  "f/1.8 (common fast prime, strong subject isolation)",
  "f/2.0 (soft background, bright, low light)",
  "f/2.2 (gentle bokeh, classic street/portrait)",
  "f/2.4 (subtle separation, natural background)",
  "f/2.8 (standard bright zoom, low light workhorse)",
  "f/3.2 (transition zone, more context)",
  "f/3.5 (vintage zoom/aperture, moderate depth)",
  "f/4.0 (versatile, landscape, travel, sharper background)",
  "f/4.5 (good for group photos, more clarity)",
  "f/5.0 (mild background blur, more sharpness)",
  "f/5.6 (classic landscape, sharp across frame)",
  "f/6.3 (good depth, sunlight outdoors)",
  "f/6.7 (subtle isolation, older lens feel)",
  "f/7.1 (sharper, more in focus, environmental shots)",
  "f/8.0 (street, travel, deep focus, best sharpness)",
  "f/9.0 (rich context, large DOF)",
  "f/9.5 (older lens, specialty use)",
  "f/10 (transition to full sharpness, few effects)",
  "f/11 (great for landscapes, wide clarity)",
  "f/13 (full depth, less diffraction)",
  "f/14 (extra depth, rare specialty)",
  "f/16 (everything in focus, bright scenes)",
  "f/18 (full clarity, maximum daylight)",
  "f/19 (extreme DOF, creative look)",
  "f/20 (very deep focus, rare use)",
  "f/22 (maximum DOF, sharp foreground/background)",
  "f/25 (large format, specialty use)",
  "f/29 (hyper focus, creative/fine art)",
  "f/32 (ultimate landscape, nearly pinhole effect)",
  "f/36 (rare, technical, maximum DOF)",
  "f/40 (extreme focus, special lenses)",
  "f/45 (large format, technical camera work)",
  "f/51 (historic large format/technical use)",
  "f/57 (very rare, large format only)",
  "f/64 (famous Ansel Adams, Group f/64, maximum depth)"
];

const blurStyleOptions = [
  "default",
  "no blur",
  "as is",
  "background blur",
  "foreground blur",
  "subject blur",
  "radial blur",
  "motion blur",
  "directional blur",
  "linear blur",
  "vertical blur",
  "horizontal blur",
  "zoom blur",
  "tilt-shift blur",
  "bokeh blur",
  "soft blur",
  "strong blur",
  "gaussian blur",
  "box blur",
  "lens blur",
  "surface blur",
  "median blur",
  "bilateral blur",
  "edge blur",
  "depth blur",
  "field blur",
  "iris blur",
  "spin blur",
  "path blur",
  "dreamlike blur",
  "ethereal blur",
  "glow blur",
  "crystal blur",
  "fractal blur",
  "pixelated blur",
  "anamorphic blur",
  "old handheld blur",
  "old iPhone blur",
  "old lens blur",
  "old phone blur",
  "vintage blur",
  "chromatic blur",
  "halo blur",
  "vignette blur",
  "atmospheric blur",
  "mist blur",
  "haze blur",
  "fog blur",
  "cloud blur",
  "water blur",
  "heat haze blur",
  "double vision blur",
  "ghosting blur",
  "glass blur",
  "frosted blur",
  "prism blur",
  "mirror blur",
  "diffraction blur",
  "neon blur",
  "glitter blur",
  "zoom burst blur"
];

const depthOfFieldOptions = [
  "default",
  "keep original",
  "not defined",
  "as is",
  "ultra shallow depth of field",
  "very shallow depth of field",
  "shallow depth of field",
  "medium depth of field",
  "deep depth of field",
  "very deep depth of field",
  "infinite depth of field",
  "selective focus",
  "split focus",
  "rack focus",
  "focus stacking",
  "tilt-shift effect",
  "macro focus",
  "bokeh background",
  "background blur",
  "foreground blur",
  "sharp foreground, blurred background",
  "sharp background, blurred foreground",
  "everything in focus",
  "subject in focus",
  "foreground in focus",
  "background in focus"
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

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_lens_type"
            checked={options.use_lens_type}
            onCheckedChange={(checked) => updateOptions({ use_lens_type: !!checked })}
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

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="use_aperture"
            checked={options.use_aperture}
            onCheckedChange={(checked) => updateOptions({ use_aperture: !!checked })}
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
            onCheckedChange={(checked) => updateOptions({ use_blur_style: !!checked })}
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
