import React, { useState, useEffect } from 'react';
import { diffChars, Change } from 'diff';
import { Sun, Moon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ControlPanel } from './ControlPanel';
import { ShareModal } from './ShareModal';
import { ProgressBar } from './ProgressBar';
import { ActionBar } from './ActionBar';
import HistoryPanel, { HistoryEntry } from './HistoryPanel';
import ImportModal from './ImportModal';
import Footer from './Footer';
import DisclaimerModal from './DisclaimerModal';
import { useIsSingleColumn } from '@/hooks/use-single-column';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useTracking } from '@/hooks/use-tracking';
import { trackEvent } from '@/lib/analytics'

export interface SoraOptions {
  prompt: string;
  negative_prompt: string;
  use_negative_prompt: boolean;
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
  use_style_preset: boolean;
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
    use_negative_prompt: true,
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
    use_style_preset: false,
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
    composition_rules: [],
    lighting: '',
    color_grade: 'default (no specific color grading)',
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
  const [jsonString, setJsonString] = useState(() => {
    try {
      return localStorage.getItem('currentJson') || '';
    } catch {
      return '';
    }
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jsonHistory') || '[]');
    } catch {
      return [];
    }
  });
  const jsonContainerRef = React.useRef<HTMLDivElement>(null);
  const prevJsonRef = React.useRef(jsonString);
  const [diffParts, setDiffParts] = useState<Change[] | null>(null);
  const isSingleColumn = useIsSingleColumn();
  const [darkMode, setDarkMode] = useDarkMode();
  const [trackingEnabled, setTrackingEnabled] = useTracking();

  useEffect(() => {
    const times = [3, 5, 10, 30, 60]
    const timers = times.map(t =>
      setTimeout(() => trackEvent(trackingEnabled, `stay_${t}min`), t * 60 * 1000)
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [trackingEnabled])

  useEffect(() => {
    localStorage.setItem('jsonHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('currentJson', jsonString);
  }, [jsonString, trackingEnabled]);

  useEffect(() => {
    const diff = diffChars(prevJsonRef.current, jsonString).filter(p => !p.removed);
    prevJsonRef.current = jsonString;
    setDiffParts(diff);
    const timer = setTimeout(() => {
      setDiffParts(diff.map(p => ({ ...p, added: false } as Change)));
    }, 2000);
    trackEvent(trackingEnabled, 'json_changed');
    return () => clearTimeout(timer);
  }, [jsonString]);

  useEffect(() => {
    const container = jsonContainerRef.current;
    if (!container) return;
    const atBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 5;
    const atTop = container.scrollTop === 0;
    if (atBottom) {
      container.scrollTop = container.scrollHeight;
    } else if (atTop) {
      container.scrollTop = 0;
    }
  }, [jsonString]);

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

    if (!options.use_style_preset) {
      delete cleanOptions.style_preset;
    }

    if (!options.use_negative_prompt) {
      delete cleanOptions.negative_prompt;
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

    if (!options.use_dof) {
      delete cleanOptions.depth_of_field;
    }

    if (!options.use_blur_style) {
      delete cleanOptions.blur_style;
    }

    if (!options.use_color_grading) {
      delete cleanOptions.color_grade;
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
    delete cleanOptions.use_style_preset;
    delete cleanOptions.use_negative_prompt;
    delete cleanOptions.use_camera_composition;
    delete (cleanOptions as { image_count?: number }).image_count;

    const json = JSON.stringify(cleanOptions, null, 2);
    setJsonString(json);
    localStorage.setItem('currentJson', json);
  }, [options]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      const entry: HistoryEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        json: jsonString,
      };
      setHistory((prev) => [entry, ...prev]);
      toast.success('Sora JSON copied to clipboard!');
      const opts = options as unknown as Record<string, unknown>
      const sections = Object.keys(options).filter(key => key.startsWith('use_') && opts[key])
      trackEvent(trackingEnabled, 'copy_json', { sections: sections.join(',') })
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearJson = () => {
    setJsonString('{}');
    toast.success('JSON cleared!');
    trackEvent(trackingEnabled, 'clear_json');
  };

  const shareJson = () => {
    setShowShareModal(true);
    trackEvent(trackingEnabled, 'share_button');
  };

  const importJson = (json: string) => {
    try {
      const obj = JSON.parse(json);
      setOptions(prev => ({ ...prev, ...obj }));
      setShowImportModal(false);
      toast.success('JSON imported!');
      trackEvent(trackingEnabled, 'import_button');
    } catch {
      toast.error('Invalid JSON');
    }
  };

  const resetJson = () => {
    // Reset to default options
    setOptions({
      prompt: 'A breathtaking cinematic scene of a futuristic city at sunset, flying cars zipping between glass skyscrapers, vibrant colors, ultra-detailed, 8K, masterful lighting, trending on ArtStation',
      negative_prompt: 'blurry, low-res, dark, extra limbs, cropped, watermark, text, signature, logo',
      use_negative_prompt: true,
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
      use_style_preset: false,
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
      composition_rules: [],
      lighting: '',
      color_grade: 'default (no specific color grading)',
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
    trackEvent(trackingEnabled, 'reset_button');
  };

  const regenerateJson = () => {
    setOptions(prev => ({ ...prev, seed: Math.floor(Math.random() * 10000) }));
    toast.success('JSON regenerated with new seed!');
    trackEvent(trackingEnabled, 'regenerate_button');
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
    trackEvent(trackingEnabled, 'randomize_button');
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

  const deleteHistoryEntry = (id: number) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const clearHistory = () => setHistory([]);

  const copyHistoryEntry = async (json: string) => {
    try {
      await navigator.clipboard.writeText(json);
      toast.success('Sora JSON copied to clipboard!');
      trackEvent(trackingEnabled, 'history_copy');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const editHistoryEntry = (json: string) => {
    try {
      const obj = JSON.parse(json);
      setOptions(prev => ({ ...prev, ...obj }));
      document
        .getElementById('generated-json')
        ?.scrollIntoView({ behavior: 'smooth' });
      trackEvent(trackingEnabled, 'history_edit');
    } catch {
      toast.error('Invalid JSON');
    }
  };

  const importHistoryEntries = (jsons: string[]) => {
    const entries = jsons.map(j => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleString(),
      json: j,
    }));
    setHistory(prev => [...entries, ...prev]);
    trackEvent(trackingEnabled, 'history_import', { type: 'bulk' });
  };

  const scrollToJson = () => {
    document
      .getElementById('generated-json')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container mx-auto p-6 flex flex-col flex-1">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 select-none">
              <img
                src="/web-app-manifest-512x512.png"
                alt=""
                className="w-10 h-10 animate-rainbow dark:animate-rainbow-dark"
              />
              Sora JSON Prompt Crafter
            </h1>
            <p className="text-muted-foreground select-none">Configure your Sora generation settings and get the perfect JSON prompt for stunning AI-generated content.</p>
            <div className="flex items-center gap-2 mt-2">
              <a
                onClick={() => trackEvent(trackingEnabled, 'click_sponsor')}
                className="github-button"
                href="https://github.com/sponsors/supermarsx"
                data-icon="octicon-heart"
                data-size="large"
                aria-label="Sponsor supermarsx"
                data-color-scheme={darkMode ? 'dark_high_contrast' : 'light_high_contrast'}
              >
                Sponsor
              </a>
              <a
                onClick={() => trackEvent(trackingEnabled, 'see_github')}
                className="github-button"
                href="https://github.com/supermarsx/sora-json-prompt-crafter"
                data-icon="octicon-mark-github"
                data-size="large"
                aria-label="GitHub supermarsx/sora-json-prompt-crafter"
                data-color-scheme={darkMode ? 'dark_high_contrast' : 'light_high_contrast'}
              >
                GitHub
              </a>
              <a
                onClick={() => trackEvent(trackingEnabled, 'star_github')}
                className="github-button"
                href="https://github.com/supermarsx/sora-json-prompt-crafter"
                data-icon="octicon-star"
                data-show-count="true"
                data-size="large"
                aria-label="Star supermarsx/sora-json-prompt-crafter on GitHub"
                data-color-scheme={darkMode ? 'dark_high_contrast' : 'light_high_contrast'}
              >
                Star
              </a>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <a
                  href="https://lovable.dev/projects/385b40c5-6b5e-49fc-9f0a-e6a0f9a36181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                  onClick={() => trackEvent(trackingEnabled, 'view_on_lovable')}
                >
                  <Heart className="w-4 h-4" />
                  View on Lovable
                </a>
              </Button>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">
              By using this tool you agree by the{' '}
              <button onClick={() => setShowDisclaimer(true)} className="underline">
                full disclaimer
              </button>
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setDarkMode(!darkMode)
              trackEvent(trackingEnabled, 'dark_mode_toggle', { enabled: !darkMode })
            }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 flex-1">
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

          <Card
            id="generated-json"
            className="flex flex-col lg:sticky lg:top-4 lg:max-h-[calc(100vh-1rem)]"
          >
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Generated JSON Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <div className="h-full overflow-y-auto" ref={jsonContainerRef}>
                <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>
                    {diffParts
                      ? diffParts.map((part, idx) => (
                          <span
                            key={idx}
                            className={part.added ? "animate-highlight" : undefined}
                          >
                            {part.value}
                          </span>
                        ))
                      : jsonString}
                  </code>
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
        onImport={() => setShowImportModal(true)}
        onHistory={() => setShowHistory(true)}
        onReset={resetJson}
        onRegenerate={regenerateJson}
        onRandomize={randomizeJson}
        trackingEnabled={trackingEnabled}
        onToggleTracking={() => setTrackingEnabled(!trackingEnabled)}
        copied={copied}
        showJumpToJson={isSingleColumn}
        onJumpToJson={scrollToJson}
      />
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        jsonContent={jsonString}
      />
      <HistoryPanel
        open={showHistory}
        onOpenChange={setShowHistory}
        history={history}
        onDelete={deleteHistoryEntry}
        onClear={clearHistory}
        onCopy={copyHistoryEntry}
        onEdit={editHistoryEntry}
        onImport={importHistoryEntries}
      />
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={importJson}
      />
      <DisclaimerModal open={showDisclaimer} onOpenChange={setShowDisclaimer} />
      <Footer onShowDisclaimer={() => setShowDisclaimer(true)} />
      <ProgressBar />
    </div>
  );
};

export default Dashboard;
