import type { SoraOptions } from './soraOptions';

export const OPTION_FLAG_MAP: Record<string, keyof SoraOptions> = {
  negative_prompt: 'use_negative_prompt',
  width: 'use_dimensions_format',
  height: 'use_dimensions_format',
  aspect_ratio: 'use_dimensions_format',
  output_format: 'use_dimensions_format',
  dynamic_range: 'use_dimensions_format',
  style_preset: 'use_style_preset',
  made_out_of: 'use_material',
  secondary_material: 'use_secondary_material',
  lighting: 'use_lighting',
  color_grade: 'use_color_grading',
  environment: 'use_environment',
  location: 'use_location',
  time_of_year: 'use_time_of_year',
  year: 'use_settings_location',
  season: 'use_season',
  atmosphere_mood: 'use_atmosphere_mood',
  subject_mood: 'use_subject_mood',
  sword_type: 'use_sword_type',
  sword_vibe: 'use_sword_type',
  upscale: 'use_upscale_factor',
  safety_filter: 'use_safety_filter',
  quality_booster: 'use_quality_booster',
  prevent_deformities: 'use_enhancement_safety',
  keep_typography_details: 'use_enhancement_safety',
  enhance_object_reflections: 'use_enhancement_safety',
  keep_key_details: 'use_enhancement_safety',
  add_same_face: 'use_face_enhancements',
  dont_change_face: 'use_face_enhancements',
  subject_gender: 'use_subject_gender',
  makeup_style: 'use_makeup_style',
  character_mood: 'use_character_mood',
  black_and_white_preset: 'use_black_and_white',
  special_effects: 'use_special_effects',
  lut_preset: 'use_lut_preset',
  dnd_character_race: 'use_dnd_character_race',
  dnd_character_class: 'use_dnd_character_class',
  dnd_character_background: 'use_dnd_character_background',
  dnd_character_alignment: 'use_dnd_character_alignment',
  dnd_monster_type: 'use_dnd_monster_type',
  dnd_environment: 'use_dnd_environment',
  dnd_magic_school: 'use_dnd_magic_school',
  dnd_item_type: 'use_dnd_item_type',
  camera_angle: 'use_camera_composition',
  shot_type: 'use_camera_composition',
  subject_focus: 'use_camera_composition',
  composition_rules: 'use_camera_composition',
  camera_type: 'use_camera_composition',
  lens_type: 'use_lens_type',
  aperture: 'use_aperture',
  depth_of_field: 'use_dof',
  blur_style: 'use_blur_style',
  motion_strength: 'use_motion_animation',
  camera_motion: 'use_motion_animation',
  motion_direction: 'use_motion_animation',
  fps: 'use_motion_animation',
  frame_interpolation: 'use_motion_animation',
  duration_seconds: 'use_duration',
  seed: 'use_core_settings',
  steps: 'use_core_settings',
  guidance_scale: 'use_core_settings',
  temperature: 'use_core_settings',
  cfg_rescale: 'use_core_settings',
  quality: 'use_core_settings',
  signature: 'use_signature',
};
