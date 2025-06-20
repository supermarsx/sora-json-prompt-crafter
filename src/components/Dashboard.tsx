
import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ControlPanel } from './ControlPanel';

export interface SoraOptions {
  prompt: string;
  negative_prompt: string;
  seed: number | null;
  steps: number;
  guidance_scale: number;
  width: number;
  height: number;
  aspect_ratio: '16:9' | '21:9' | '4:3' | '1:1' | '9:16';
  model_version: 'sora-v2.1' | 'sora-v2.0' | 'default';
  sampler: 'Euler a' | 'DPM++ 2M Karras' | 'DDIM' | 'PLMS';
  cfg_rescale: number;
  highres_fix: boolean;
  style_preset: 'cinematic' | 'anime' | '3d' | 'photographic' | 'digital-art' | 'comic-book' | 'fantasy-art' | 'line-art' | 'analog-film' | 'neon-punk' | 'isometric' | 'low-poly' | 'origami' | 'modeling-compound' | 'tile-texture';
  quality: 'draft' | 'standard' | 'high' | 'ultra';
  temperature: number;
  clip_skip: number;
  batch_size: number;
  image_count: number;
  dynamic_range: 'SDR' | 'HDR';
  output_format: 'png' | 'jpg' | 'webp';
  duration_seconds: number;
  fps: number;
  motion_strength: number;
  camera_motion: 'static' | 'dolly_in' | 'dolly_out' | 'orbit' | 'pan_left' | 'pan_right' | 'tilt_up' | 'tilt_down' | 'zoom_in' | 'zoom_out';
  motion_direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';
  camera_angle: 'eye' | 'high' | 'low' | 'bird_eye' | 'worm_eye';
  shot_type: 'closeup' | 'medium' | 'wide' | 'establishing' | 'extreme_closeup' | 'full_body';
  subject_focus: 'center' | 'left' | 'right' | 'top' | 'bottom';
  composition_rules: string[];
  lighting: 'natural' | 'studio' | 'golden_hour' | 'blue_hour' | 'sunset' | 'sunrise' | 'night' | 'neon' | 'soft' | 'hard' | 'dramatic' | 'rim' | 'backlighting';
  color_grade: 'none' | 'teal_and_orange' | 'vintage' | 'warm' | 'cool' | 'desaturated' | 'high_contrast' | 'film_noir' | 'cyberpunk';
  depth_of_field: 'shallow' | 'deep' | 'medium';
  lens: 'anamorphic' | '35mm' | '50mm' | '85mm' | 'macro' | 'fisheye' | 'telephoto' | 'wide_angle';
  frame_interpolation: 'smooth' | 'realistic' | 'sharp';
  face_enhance: boolean;
  upscale: number;
  safety_filter: 'strict' | 'moderate' | 'off';
  nsfw: boolean;
  chaos: number;
}

const Dashboard = () => {
  const [options, setOptions] = useState<SoraOptions>({
    prompt: 'A breathtaking cinematic scene of a futuristic city at sunset, flying cars zipping between glass skyscrapers, vibrant colors, ultra-detailed, 8K, masterful lighting, trending on ArtStation',
    negative_prompt: 'blurry, low-res, dark, extra limbs, cropped, watermark, text, signature, logo, nsfw',
    seed: 1337,
    steps: 30,
    guidance_scale: 7.5,
    width: 1024,
    height: 576,
    aspect_ratio: '16:9',
    model_version: 'sora-v2.1',
    sampler: 'DPM++ 2M Karras',
    cfg_rescale: 0.7,
    highres_fix: true,
    style_preset: 'cinematic',
    quality: 'high',
    temperature: 1.1,
    clip_skip: 2,
    batch_size: 1,
    image_count: 4,
    dynamic_range: 'HDR',
    output_format: 'png',
    duration_seconds: 5,
    fps: 30,
    motion_strength: 0.85,
    camera_motion: 'dolly_in',
    motion_direction: 'forward',
    camera_angle: 'low',
    shot_type: 'wide',
    subject_focus: 'center',
    composition_rules: ['rule_of_thirds', 'leading_lines'],
    lighting: 'golden_hour',
    color_grade: 'teal_and_orange',
    depth_of_field: 'shallow',
    lens: 'anamorphic',
    frame_interpolation: 'smooth',
    face_enhance: false,
    upscale: 2,
    safety_filter: 'moderate',
    nsfw: false,
    chaos: 0.1,
  });

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    const cleanOptions = {
      ...options,
      seed: options.seed === 0 ? null : options.seed,
    };
    setJsonString(JSON.stringify(cleanOptions, null, 2));
  }, [options]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success('Sora JSON copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  };

  const updateNestedOptions = (path: string, value: any) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: any = newOptions;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newOptions;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-500" />
            Sora Prompt Generator
          </h1>
          <p className="text-muted-foreground">Configure your Sora generation settings and get the perfect JSON prompt for stunning AI-generated content.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* Controls Panel */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ControlPanel 
                  options={options} 
                  updateOptions={updateOptions}
                  updateNestedOptions={updateNestedOptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* JSON Preview Panel */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Sora JSON Prompt
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>{jsonString}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
