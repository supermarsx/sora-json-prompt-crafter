import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ControlPanel } from './ControlPanel';
import { ShareModal } from './ShareModal';
import { ProgressBar } from './ProgressBar';
import { ActionBar } from './ActionBar';

export interface SoraOptions {
  prompt: string;
  negative_prompt: string;
  seed: number | null;
  steps: number;
  guidance_scale: number;
  width?: number;
  height?: number;
  use_dimensions: boolean;
  aspect_ratio: '16:9' | '21:9' | '4:3' | '1:1' | '9:16';
  cfg_rescale: number;
  style_preset: {
    category: string;
    style: string;
  };
  quality: 'defective' | 'unacceptable' | 'poor' | 'bad' | 'below standard' | 'minimum' | 'moderate' | 'medium' | 'draft' | 'standard' | 'good' | 'high' | 'excellent' | 'ultra' | 'maximum' | 'low';
  temperature: number;
  dynamic_range: 'SDR' | 'HDR';
  output_format: 'png' | 'jpg' | 'webp';
  duration_seconds: number;
  fps: number;
  motion_strength: number;
  camera_motion: string;
  motion_direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';
  camera_angle: string;
  shot_type: string;
  subject_focus: 'center' | 'left' | 'right' | 'top' | 'bottom';
  composition_rules: string[];
  lighting: string;
  color_grade: string;
  depth_of_field: string;
  lens_type: string;
  frame_interpolation: 'smooth' | 'realistic' | 'sharp';
  upscale: number;
  safety_filter: 'strict' | 'moderate' | 'off';
  made_out_of: string;
  environment: string;
  use_signature: boolean;
  signature?: string;
  blur_style: string;
  aperture: string;
  use_motion_animation: boolean;
  use_enhancement_safety: boolean;
  camera_type: string;
  use_settings_location: boolean;
  year: number;
  use_season: boolean;
  season?: string;
  use_atmosphere_mood: boolean;
  atmosphere_mood?: string;
  use_subject_mood: boolean;
  subject_mood?: string;
  use_sword_type: boolean;
  sword_type?: string;
  sword_vibe?: string;
  use_core_settings: boolean;
  use_dimensions_format: boolean;
  use_lighting: boolean;
  use_material: boolean;
  use_secondary_material: boolean;
  secondary_material?: string;
  use_color_grading: boolean;
  use_environment: boolean;
  use_time_of_year: boolean;
  use_character_mood: boolean;
  use_sword_details: boolean;
  prevent_deformities: boolean;
  use_upscale_factor: boolean;
  use_safety_filter: boolean;
  keep_typography_details: boolean;
  use_face_enhancements: boolean;
  add_same_face: boolean;
  dont_change_face: boolean;
  use_subject_gender: boolean;
  subject_gender?: string;
  use_makeup_style: boolean;
  makeup_style?: string;
  use_quality_booster: boolean;
  quality_booster?: string;
  enhance_object_reflections: boolean;
  keep_key_details: boolean;
  use_black_and_white: boolean;
  black_and_white_preset?: string;
  use_location: boolean;
  location?: string;
  use_special_effects: boolean;
  special_effects?: string[];
  use_lut_preset: boolean;
  lut_preset?: string;
  use_dnd_section: boolean;
  use_dnd_character_race: boolean;
  dnd_character_race?: string;
  use_dnd_character_class: boolean;
  dnd_character_class?: string;
  use_dnd_character_background: boolean;
  dnd_character_background?: string;
  use_dnd_character_alignment: boolean;
  dnd_character_alignment?: string;
  use_dnd_monster_type: boolean;
  dnd_monster_type?: string;
  use_dnd_environment: boolean;
  dnd_environment?: string;
  use_dnd_magic_school: boolean;
  dnd_magic_school?: string;
  use_dnd_item_type: boolean;
  dnd_item_type?: string;
  use_camera_angle: boolean;
  use_lens_type: boolean;
  use_aperture: boolean;
  use_dof: boolean;
  use_blur_style: boolean;
  use_camera_composition: boolean;
  extended_motion_strength: boolean;
  extended_fps: boolean;
  use_duration: boolean;
}

const Dashboard = () => {
  const [options, setOptions] = useState<SoraOptions>({
    prompt: 'A breathtaking cinematic scene of a futuristic city at sunset, flying cars zipping between glass skyscrapers, vibrant colors, ultra-detailed, 8K, masterful lighting, trending on ArtStation',
    negative_prompt: 'blurry, low-res, dark, extra limbs, cropped, watermark, text, signature, logo',
    seed: 1337,
    steps: 30,
    guidance_scale: 7.5,
    width: 1024,
    height: 576,
    use_dimensions: true,
    aspect_ratio: '16:9',
    cfg_rescale: 0.7,
    style_preset: {
      category: 'Photography & Cinematic',
      style: 'cinematic'
    },
    quality: 'high',
    temperature: 1.1,
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
    lens_type: 'default',
    frame_interpolation: 'smooth',
    upscale: 2,
    safety_filter: 'moderate',
    made_out_of: 'default',
    environment: 'default',
    use_signature: false,
    blur_style: 'default',
    aperture: 'default (auto aperture)',
    use_motion_animation: false,
    use_enhancement_safety: false,
    camera_type: 'default (auto/any camera)',
    use_settings_location: false,
    year: new Date().getFullYear(),
    use_season: false,
    use_atmosphere_mood: false,
    use_subject_mood: false,
    use_sword_type: false,
    use_core_settings: false,
    use_dimensions_format: false,
    use_lighting: false,
    use_material: false,
    use_secondary_material: false,
    use_color_grading: false,
    use_environment: false,
    use_time_of_year: false,
    use_character_mood: false,
    use_sword_details: false,
    prevent_deformities: false,
    use_upscale_factor: false,
    use_safety_filter: false,
    keep_typography_details: false,
    use_face_enhancements: false,
    add_same_face: false,
    dont_change_face: false,
    use_subject_gender: false,
    use_makeup_style: false,
    use_quality_booster: false,
    enhance_object_reflections: false,
    keep_key_details: false,
    use_black_and_white: false,
    use_location: false,
    use_special_effects: false,
    use_lut_preset: false,
    use_dnd_section: false,
    use_dnd_character_race: false,
    use_dnd_character_class: false,
    use_dnd_character_background: false,
    use_dnd_character_alignment: false,
    use_dnd_monster_type: false,
    use_dnd_environment: false,
    use_dnd_magic_school: false,
    use_dnd_item_type: false,
    use_camera_composition: false,
    use_camera_angle: false,
    use_lens_type: false,
    use_aperture: false,
    use_dof: false,
    use_blur_style: false,
    extended_motion_strength: false,
    extended_fps: false,
    use_duration: false,
  });

  const [copied, setCopied] = useState(false);
  const [jsonString, setJsonString] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const cleanOptions = { ...options };
    
    // Remove control flags and unused optional fields
    Object.keys(cleanOptions).forEach(key => {
      if (key.startsWith('use_') || key.startsWith('extended_')) {
        delete cleanOptions[key];
      }
    });

    // Remove optional fields if not enabled
    if (!options.use_core_settings) {
      delete cleanOptions.seed;
      delete cleanOptions.steps;
      delete cleanOptions.guidance_scale;
      delete cleanOptions.temperature;
      delete cleanOptions.cfg_rescale;
      delete cleanOptions.quality;
    }

    if (!options.use_dimensions_format) {
      delete cleanOptions.width;
      delete cleanOptions.height;
      delete cleanOptions.aspect_ratio;
      delete cleanOptions.output_format;
      delete cleanOptions.dynamic_range;
    } else if (!options.use_dimensions) {
      delete cleanOptions.width;
      delete cleanOptions.height;
    }

    if (!options.use_material) {
      delete cleanOptions.made_out_of;
      delete cleanOptions.secondary_material;
    } else if (!options.use_secondary_material) {
      delete cleanOptions.secondary_material;
    }

    if (!options.use_camera_composition) {
      delete cleanOptions.camera_angle;
      delete cleanOptions.shot_type;
      delete cleanOptions.subject_focus;
      delete cleanOptions.composition_rules;
      delete cleanOptions.camera_type;
      delete cleanOptions.lens_type;
    }

    if (!options.use_aperture) {
      delete cleanOptions.aperture;
    }

    if (!options.use_lens_type) {
      delete cleanOptions.lens_type;
    }

    if (!options.use_blur_style) {
      delete cleanOptions.blur_style;
    }

    if (!options.use_lighting) {
      delete cleanOptions.lighting;
    }

    if (!options.use_motion_animation) {
      delete cleanOptions.duration_seconds;
      delete cleanOptions.fps;
      delete cleanOptions.motion_strength;
      delete cleanOptions.camera_motion;
      delete cleanOptions.motion_direction;
      delete cleanOptions.frame_interpolation;
    } else if (!options.use_duration) {
      delete cleanOptions.duration_seconds;
    }

    if (!options.use_enhancement_safety) {
      delete cleanOptions.prevent_deformities;
      delete cleanOptions.upscale;
      delete cleanOptions.safety_filter;
      delete cleanOptions.keep_typography_details;
      delete cleanOptions.quality_booster;
      delete cleanOptions.enhance_object_reflections;
      delete cleanOptions.keep_key_details;
    } else {
      if (!options.use_safety_filter) {
        delete cleanOptions.safety_filter;
      }
      if (!options.use_quality_booster) {
        delete cleanOptions.quality_booster;
      }
    }

    if (!options.use_face_enhancements) {
      delete cleanOptions.add_same_face;
      delete cleanOptions.dont_change_face;
      delete cleanOptions.subject_gender;
      delete cleanOptions.makeup_style;
      delete cleanOptions.character_mood;
    } else {
      if (!options.use_subject_gender) {
        delete cleanOptions.subject_gender;
      }
      if (!options.use_makeup_style) {
        delete cleanOptions.makeup_style;
      }
      if (!options.use_character_mood) {
        delete cleanOptions.character_mood;
      }
    }

    if (!options.use_signature) {
      delete cleanOptions.signature;
    }
    if (!options.use_settings_location) {
      delete cleanOptions.year;
      delete cleanOptions.environment;
      delete cleanOptions.location;
      delete cleanOptions.season;
      delete cleanOptions.atmosphere_mood;
    } else {
      if (!options.use_environment) {
        delete cleanOptions.environment;
      }
      if (!options.use_location) {
        delete cleanOptions.location;
      }
    }
    if (!options.use_season) {
      delete cleanOptions.season;
    }
    if (!options.use_atmosphere_mood) {
      delete cleanOptions.atmosphere_mood;
    }
    if (!options.use_subject_mood) {
      delete cleanOptions.subject_mood;
    }
    if (!options.use_sword_type) {
      delete cleanOptions.sword_type;
      delete cleanOptions.sword_vibe;
    }
    if (!options.use_upscale_factor) {
      delete cleanOptions.upscale;
    }

    if (!options.use_dnd_section) {
      delete cleanOptions.dnd_character_race;
      delete cleanOptions.dnd_character_class;
      delete cleanOptions.dnd_character_background;
      delete cleanOptions.dnd_character_alignment;
      delete cleanOptions.dnd_monster_type;
      delete cleanOptions.dnd_environment;
      delete cleanOptions.dnd_magic_school;
      delete cleanOptions.dnd_item_type;
    } else {
      if (!options.use_dnd_character_race) {
        delete cleanOptions.dnd_character_race;
      }
      if (!options.use_dnd_character_class) {
        delete cleanOptions.dnd_character_class;
      }
      if (!options.use_dnd_character_background) {
        delete cleanOptions.dnd_character_background;
      }
      if (!options.use_dnd_character_alignment) {
        delete cleanOptions.dnd_character_alignment;
      }
      if (!options.use_dnd_monster_type) {
        delete cleanOptions.dnd_monster_type;
      }
      if (!options.use_dnd_environment) {
        delete cleanOptions.dnd_environment;
      }
      if (!options.use_dnd_magic_school) {
        delete cleanOptions.dnd_magic_school;
      }
      if (!options.use_dnd_item_type) {
        delete cleanOptions.dnd_item_type;
      }
    }
    
    // Remove control flags from final JSON
    delete cleanOptions.use_dimensions;
    delete cleanOptions.use_signature;
    delete cleanOptions.use_motion_animation;
    delete cleanOptions.use_enhancement_safety;
    delete cleanOptions.use_settings_location;
    delete cleanOptions.use_season;
    delete cleanOptions.use_atmosphere_mood;
    delete cleanOptions.use_subject_mood;
    delete cleanOptions.use_sword_type;
    delete cleanOptions.use_camera_composition;
    delete (cleanOptions as { image_count?: number }).image_count;

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

  const clearJson = () => {
    setJsonString('{}');
    toast.success('JSON cleared!');
  };

  const shareJson = () => {
    setShowShareModal(true);
  };

  const resetJson = () => {
    // Reset to default options
    setOptions({
      prompt: 'A breathtaking cinematic scene of a futuristic city at sunset, flying cars zipping between glass skyscrapers, vibrant colors, ultra-detailed, 8K, masterful lighting, trending on ArtStation',
      negative_prompt: 'blurry, low-res, dark, extra limbs, cropped, watermark, text, signature, logo',
      seed: 1337,
      steps: 30,
      guidance_scale: 7.5,
      width: 1024,
      height: 576,
      use_dimensions: true,
      aspect_ratio: '16:9',
      cfg_rescale: 0.7,
      style_preset: {
        category: 'Photography & Cinematic',
        style: 'cinematic'
      },
      quality: 'high',
      temperature: 1.1,
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
      lens_type: 'default',
      frame_interpolation: 'smooth',
      upscale: 2,
      safety_filter: 'moderate',
      made_out_of: 'default',
      environment: 'default',
      use_signature: false,
      blur_style: 'default',
      aperture: 'default (auto aperture)',
      use_motion_animation: false,
      use_enhancement_safety: false,
      camera_type: 'default (auto/any camera)',
      use_settings_location: false,
      year: new Date().getFullYear(),
      use_season: false,
      use_atmosphere_mood: false,
      use_subject_mood: false,
      use_sword_type: false,
      use_core_settings: false,
      use_dimensions_format: false,
      use_lighting: false,
      use_material: false,
      use_secondary_material: false,
      use_color_grading: false,
      use_environment: false,
      use_time_of_year: false,
      use_character_mood: false,
      use_sword_details: false,
      prevent_deformities: false,
      use_upscale_factor: false,
      use_safety_filter: false,
      keep_typography_details: false,
      use_face_enhancements: false,
      add_same_face: false,
      dont_change_face: false,
      use_subject_gender: false,
      use_makeup_style: false,
      use_quality_booster: false,
      enhance_object_reflections: false,
      keep_key_details: false,
      use_black_and_white: false,
      use_location: false,
      use_special_effects: false,
      use_lut_preset: false,
      use_dnd_section: false,
      use_dnd_character_race: false,
      use_dnd_character_class: false,
      use_dnd_character_background: false,
      use_dnd_character_alignment: false,
      use_dnd_monster_type: false,
      use_dnd_environment: false,
      use_dnd_magic_school: false,
      use_dnd_item_type: false,
      use_camera_composition: false,
      use_camera_angle: false,
      use_lens_type: false,
      use_aperture: false,
      use_dof: false,
      use_blur_style: false,
      extended_motion_strength: false,
      extended_fps: false,
      use_duration: false,
    });
    toast.success('Settings reset to defaults!');
  };

  const regenerateJson = () => {
    setOptions(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
    toast.success('JSON regenerated with new seed!');
  };

  const randomizeJson = () => {
    const randomOptions: Partial<SoraOptions> = {
      seed: Math.floor(Math.random() * 10000),
      steps: Math.floor(Math.random() * 31) + 20,
      guidance_scale: Math.random() * 12 + 3,
      quality: ['defective', 'poor', 'moderate', 'high', 'excellent'][
        Math.floor(Math.random() * 5)
      ] as SoraOptions['quality'],
      temperature: Math.random() * 0.5 + 0.8,
      motion_strength: Math.random(),
    };
    
    setOptions(prev => ({ ...prev, ...randomOptions }));
    toast.success('Options randomized!');
  };

  const updateOptions = (updates: Partial<SoraOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  };

  const updateNestedOptions = (path: string, value: unknown) => {
    setOptions(prev => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: Record<string, unknown> = newOptions as Record<string, unknown>;
      
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
            Sora JSON Prompt Crafter
          </h1>
          <p className="text-muted-foreground">Configure your Sora generation settings and get the perfect JSON prompt for stunning AI-generated content.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
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

          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Generated JSON Prompt
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
      
      <ActionBar
        onCopy={copyToClipboard}
        onClear={clearJson}
        onShare={shareJson}
        onReset={resetJson}
        onRegenerate={regenerateJson}
        onRandomize={randomizeJson}
        copied={copied}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jsonContent={jsonString}
      />
      <ProgressBar />
    </div>
  );
};

export default Dashboard;
