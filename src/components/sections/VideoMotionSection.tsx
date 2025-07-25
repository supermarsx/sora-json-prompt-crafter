import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { CollapsibleSection } from '../CollapsibleSection';
import type { SoraOptions } from '@/lib/soraOptions';

interface VideoMotionSectionProps {
  options: SoraOptions;
  updateOptions: (updates: Partial<SoraOptions>) => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const VideoMotionSection: React.FC<VideoMotionSectionProps> = ({
  options,
  updateOptions,
  isEnabled,
  onToggle,
}) => {
  return (
    <CollapsibleSection
      title="Video & Motion"
      isOptional={true}
      isEnabled={isEnabled}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use_duration"
            checked={options.use_duration}
            onCheckedChange={(checked) =>
              updateOptions({ use_duration: !!checked })
            }
          />
          <Label htmlFor="use_duration">Use Duration</Label>
        </div>

        <div>
          <Label htmlFor="duration_seconds">Duration (seconds)</Label>
          <Input
            id="duration_seconds"
            type="number"
            value={options.duration_seconds}
            onChange={(e) =>
              updateOptions({ duration_seconds: parseInt(e.target.value) })
            }
            min="1"
            max="30"
            disabled={!options.use_duration}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="extended_fps"
            checked={options.extended_fps}
            onCheckedChange={(checked) =>
              updateOptions({ extended_fps: !!checked })
            }
          />
          <Label htmlFor="extended_fps">Extended FPS (up to 240)</Label>
        </div>

        <div>
          <Label htmlFor="fps">FPS</Label>
          <Input
            id="fps"
            type="number"
            value={options.fps}
            onChange={(e) => updateOptions({ fps: parseInt(e.target.value) })}
            min="1"
            max={options.extended_fps ? 240 : 60}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="extended_motion_strength"
            checked={options.extended_motion_strength}
            onCheckedChange={(checked) =>
              updateOptions({ extended_motion_strength: !!checked })
            }
          />
          <Label htmlFor="extended_motion_strength">
            Extended Motion Strength (up to 10)
          </Label>
        </div>

        <div>
          <Label htmlFor="motion_strength">
            Motion Strength: {options.motion_strength}
          </Label>
          <Slider
            value={[options.motion_strength]}
            onValueChange={(value) =>
              updateOptions({ motion_strength: value[0] })
            }
            max={options.extended_motion_strength ? 10 : 1}
            min={0}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="camera_motion">Camera Motion</Label>
          <Select
            value={options.camera_motion}
            onValueChange={(value) => updateOptions({ camera_motion: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dolly_in">Dolly In</SelectItem>
              <SelectItem value="dolly_out">Dolly Out</SelectItem>
              <SelectItem value="pan_left">Pan Left</SelectItem>
              <SelectItem value="pan_right">Pan Right</SelectItem>
              <SelectItem value="tilt_up">Tilt Up</SelectItem>
              <SelectItem value="tilt_down">Tilt Down</SelectItem>
              <SelectItem value="zoom_in">Zoom In</SelectItem>
              <SelectItem value="zoom_out">Zoom Out</SelectItem>
              <SelectItem value="static">Static</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="motion_direction">Motion Direction</Label>
          <Select
            value={options.motion_direction}
            onValueChange={(
              value: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down',
            ) => updateOptions({ motion_direction: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forward">Forward</SelectItem>
              <SelectItem value="backward">Backward</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="down">Down</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frame_interpolation">Frame Interpolation</Label>
          <Select
            value={options.frame_interpolation}
            onValueChange={(value: 'smooth' | 'realistic' | 'sharp') =>
              updateOptions({ frame_interpolation: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="smooth">Smooth</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="sharp">Sharp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CollapsibleSection>
  );
};
