import type {
  ShotTypeOption,
  CameraAngleOption,
  CompositionRulesOption,
  CameraTypeOption,
  LensTypeOption,
  ApertureOption,
  BlurStyleOption,
  DepthOfFieldOption,
} from '@/data/cameraOptions';

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
  quality:
    | 'defective'
    | 'unacceptable'
    | 'poor'
    | 'bad'
    | 'below standard'
    | 'minimum'
    | 'moderate'
    | 'medium'
    | 'draft'
    | 'standard'
    | 'good'
    | 'high'
    | 'excellent'
    | 'ultra'
    | 'maximum'
    | 'low';
  temperature: number;
  dynamic_range: 'SDR' | 'HDR';
  output_format: 'png' | 'jpg' | 'webp';
  duration_seconds: number;
  fps: number;
  motion_strength: number;
  camera_motion: string;
  motion_direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';
  camera_angle: CameraAngleOption;
  shot_type: ShotTypeOption;
  subject_focus: 'center' | 'left' | 'right' | 'top' | 'bottom';
  composition_rules: CompositionRulesOption[];
  lighting: string;
  color_grade: string;
  depth_of_field: DepthOfFieldOption;
  lens_type: LensTypeOption;
  frame_interpolation: 'smooth' | 'realistic' | 'sharp';
  upscale: number;
  safety_filter: 'strict' | 'moderate' | 'off';
  made_out_of: string;
  environment: string;
  use_signature: boolean;
  signature?: string;
  blur_style: BlurStyleOption;
  aperture: ApertureOption;
  use_motion_animation: boolean;
  use_enhancement_safety: boolean;
  camera_type: CameraTypeOption;
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
  time_of_year?: string;
  use_character_mood: boolean;
  character_mood?: string;
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
