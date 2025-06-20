
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { SoraOptions } from './Dashboard';

interface ControlPanelProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  updateNestedOptions: (path: string, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  updateOptions,
  updateNestedOptions,
}) => {
  const availableCompositionRules = [
    { id: 'rule_of_thirds', label: 'Rule of Thirds' },
    { id: 'leading_lines', label: 'Leading Lines' },
    { id: 'symmetry', label: 'Symmetry' },
    { id: 'golden_ratio', label: 'Golden Ratio' },
    { id: 'framing', label: 'Natural Framing' },
    { id: 'depth', label: 'Depth Layering' },
  ];

  const handleCompositionRuleToggle = (ruleId: string, checked: boolean) => {
    const currentRules = options.composition_rules;
    const newRules = checked
      ? [...currentRules, ruleId]
      : currentRules.filter(r => r !== ruleId);
    updateOptions({ composition_rules: newRules });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Prompt Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Prompt</Badge>
            Main Prompt & Negative
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Main Prompt</Label>
            <Textarea
              id="prompt"
              value={options.prompt}
              onChange={(e) => updateOptions({ prompt: e.target.value })}
              placeholder="Describe your scene in detail..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="negative_prompt">Negative Prompt</Label>
            <Textarea
              id="negative_prompt"
              value={options.negative_prompt}
              onChange={(e) => updateOptions({ negative_prompt: e.target.value })}
              placeholder="What to avoid in the generation..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generation Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Generation</Badge>
            Core Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                type="number"
                value={options.seed || ''}
                onChange={(e) => updateOptions({ seed: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Random"
              />
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select
                value={options.quality}
                onValueChange={(value: 'draft' | 'standard' | 'high' | 'ultra') =>
                  updateOptions({ quality: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="ultra">Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Steps</Label>
              <Badge variant="secondary">{options.steps}</Badge>
            </div>
            <Slider
              value={[options.steps]}
              onValueChange={(value) => updateOptions({ steps: value[0] })}
              max={50}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Guidance Scale</Label>
              <Badge variant="secondary">{options.guidance_scale}</Badge>
            </div>
            <Slider
              value={[options.guidance_scale]}
              onValueChange={(value) => updateOptions({ guidance_scale: value[0] })}
              max={20}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Model Version</Label>
            <Select
              value={options.model_version}
              onValueChange={(value: 'sora-v2.1' | 'sora-v2.0' | 'default') =>
                updateOptions({ model_version: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sora-v2.1">Sora v2.1</SelectItem>
                <SelectItem value="sora-v2.0">Sora v2.0</SelectItem>
                <SelectItem value="default">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Output Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">Output</Badge>
            Dimensions & Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={options.width}
                onChange={(e) => updateOptions({ width: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={options.height}
                onChange={(e) => updateOptions({ height: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select
              value={options.aspect_ratio}
              onValueChange={(value: '16:9' | '21:9' | '4:3' | '1:1' | '9:16') =>
                updateOptions({ aspect_ratio: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select
              value={options.output_format}
              onValueChange={(value: 'png' | 'jpg' | 'webp') =>
                updateOptions({ output_format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Style & Visual Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300">Style</Badge>
            Visual Style & Preset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Style Preset</Label>
            <Select
              value={options.style_preset}
              onValueChange={(value) => updateOptions({ style_preset: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="3d">3D Render</SelectItem>
                <SelectItem value="photographic">Photographic</SelectItem>
                <SelectItem value="digital-art">Digital Art</SelectItem>
                <SelectItem value="comic-book">Comic Book</SelectItem>
                <SelectItem value="fantasy-art">Fantasy Art</SelectItem>
                <SelectItem value="line-art">Line Art</SelectItem>
                <SelectItem value="analog-film">Analog Film</SelectItem>
                <SelectItem value="neon-punk">Neon Punk</SelectItem>
                <SelectItem value="isometric">Isometric</SelectItem>
                <SelectItem value="low-poly">Low Poly</SelectItem>
                <SelectItem value="origami">Origami</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color Grading</Label>
            <Select
              value={options.color_grade}
              onValueChange={(value) => updateOptions({ color_grade: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="teal_and_orange">Teal & Orange</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cool">Cool</SelectItem>
                <SelectItem value="desaturated">Desaturated</SelectItem>
                <SelectItem value="high_contrast">High Contrast</SelectItem>
                <SelectItem value="film_noir">Film Noir</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lighting</Label>
            <Select
              value={options.lighting}
              onValueChange={(value) => updateOptions({ lighting: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="natural">Natural</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="golden_hour">Golden Hour</SelectItem>
                <SelectItem value="blue_hour">Blue Hour</SelectItem>
                <SelectItem value="sunset">Sunset</SelectItem>
                <SelectItem value="sunrise">Sunrise</SelectItem>
                <SelectItem value="night">Night</SelectItem>
                <SelectItem value="neon">Neon</SelectItem>
                <SelectItem value="soft">Soft</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
                <SelectItem value="rim">Rim Lighting</SelectItem>
                <SelectItem value="backlighting">Backlighting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Camera & Composition */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300">Camera</Badge>
            Camera & Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shot Type</Label>
              <Select
                value={options.shot_type}
                onValueChange={(value) => updateOptions({ shot_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="closeup">Close-up</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                  <SelectItem value="establishing">Establishing</SelectItem>
                  <SelectItem value="extreme_closeup">Extreme Close-up</SelectItem>
                  <SelectItem value="full_body">Full Body</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Camera Angle</Label>
              <Select
                value={options.camera_angle}
                onValueChange={(value) => updateOptions({ camera_angle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eye">Eye Level</SelectItem>
                  <SelectItem value="high">High Angle</SelectItem>
                  <SelectItem value="low">Low Angle</SelectItem>
                  <SelectItem value="bird_eye">Bird's Eye</SelectItem>
                  <SelectItem value="worm_eye">Worm's Eye</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lens Type</Label>
            <Select
              value={options.lens}
              onValueChange={(value) => updateOptions({ lens: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anamorphic">Anamorphic</SelectItem>
                <SelectItem value="35mm">35mm</SelectItem>
                <SelectItem value="50mm">50mm</SelectItem>
                <SelectItem value="85mm">85mm</SelectItem>
                <SelectItem value="macro">Macro</SelectItem>
                <SelectItem value="fisheye">Fisheye</SelectItem>
                <SelectItem value="telephoto">Telephoto</SelectItem>
                <SelectItem value="wide_angle">Wide Angle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Depth of Field</Label>
            <Select
              value={options.depth_of_field}
              onValueChange={(value) => updateOptions({ depth_of_field: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shallow">Shallow</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="deep">Deep</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Composition Rules</Label>
            <div className="grid grid-cols-1 gap-2">
              {availableCompositionRules.map((rule) => (
                <div key={rule.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={rule.id}
                    checked={options.composition_rules.includes(rule.id)}
                    onCheckedChange={(checked) => handleCompositionRuleToggle(rule.id, checked === true)}
                  />
                  <Label htmlFor={rule.id} className="text-sm cursor-pointer flex-1">
                    {rule.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">Video</Badge>
            Motion & Animation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Duration (seconds)</Label>
                <Badge variant="secondary">{options.duration_seconds}s</Badge>
              </div>
              <Slider
                value={[options.duration_seconds]}
                onValueChange={(value) => updateOptions({ duration_seconds: value[0] })}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">FPS</Label>
                <Badge variant="secondary">{options.fps}</Badge>
              </div>
              <Slider
                value={[options.fps]}
                onValueChange={(value) => updateOptions({ fps: value[0] })}
                max={60}
                min={12}
                step={6}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Camera Motion</Label>
            <Select
              value={options.camera_motion}
              onValueChange={(value) => updateOptions({ camera_motion: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="dolly_in">Dolly In</SelectItem>
                <SelectItem value="dolly_out">Dolly Out</SelectItem>
                <SelectItem value="orbit">Orbit</SelectItem>
                <SelectItem value="pan_left">Pan Left</SelectItem>
                <SelectItem value="pan_right">Pan Right</SelectItem>
                <SelectItem value="tilt_up">Tilt Up</SelectItem>
                <SelectItem value="tilt_down">Tilt Down</SelectItem>
                <SelectItem value="zoom_in">Zoom In</SelectItem>
                <SelectItem value="zoom_out">Zoom Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Motion Strength</Label>
              <Badge variant="secondary">{options.motion_strength}</Badge>
            </div>
            <Slider
              value={[options.motion_strength]}
              onValueChange={(value) => updateOptions({ motion_strength: value[0] })}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">Advanced</Badge>
            Enhancement & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="face-enhance" className="text-sm font-medium">Face Enhancement</Label>
                <p className="text-xs text-muted-foreground">Improve facial details</p>
              </div>
              <Switch
                id="face-enhance"
                checked={options.face_enhance}
                onCheckedChange={(checked) => updateOptions({ face_enhance: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="highres-fix" className="text-sm font-medium">Hi-Res Fix</Label>
                <p className="text-xs text-muted-foreground">Upscaling enhancement</p>
              </div>
              <Switch
                id="highres-fix"
                checked={options.highres_fix}
                onCheckedChange={(checked) => updateOptions({ highres_fix: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Upscale Factor</Label>
              <Badge variant="secondary">{options.upscale}x</Badge>
            </div>
            <Slider
              value={[options.upscale]}
              onValueChange={(value) => updateOptions({ upscale: value[0] })}
              max={4}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Safety Filter</Label>
            <Select
              value={options.safety_filter}
              onValueChange={(value: 'strict' | 'moderate' | 'off') =>
                updateOptions({ safety_filter: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strict">Strict</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Chaos/Randomness</Label>
              <Badge variant="secondary">{options.chaos}</Badge>
            </div>
            <Slider
              value={[options.chaos]}
              onValueChange={(value) => updateOptions({ chaos: value[0] })}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
