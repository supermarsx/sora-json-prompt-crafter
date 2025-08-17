import type { SoraOptions } from '@/lib/soraOptions';

/**
 * Remove a set of keys from the provided object.
 *
 * @param obj - Object from which properties should be removed.
 * @param keys - Keys that will be deleted from the object.
 */
function removeProps(
  obj: Record<string, unknown>,
  keys: (keyof SoraOptions)[],
) {
  keys.forEach((k) => {
    delete obj[k as string];
  });
}

/**
 * Remove keys from the object when a related feature is disabled.
 *
 * @param obj - Object potentially holding properties to remove.
 * @param enabled - Whether the feature is enabled.
 * @param keys - Keys to remove when the feature is disabled.
 */
function removeIfDisabled(
  obj: Record<string, unknown>,
  enabled: boolean,
  keys: (keyof SoraOptions)[],
) {
  if (!enabled) removeProps(obj, keys);
}

/**
 * Generate a JSON string containing only the enabled Sora options.
 *
 * @param options - The full set of options selected by the user.
 * @returns A formatted JSON string representing the active options.
 */
export function generateJson(options: SoraOptions): string {
  const cleanOptions = { ...options };

  Object.keys(cleanOptions).forEach((key) => {
    if (key.startsWith('use_') || key.startsWith('extended_')) {
      delete (cleanOptions as Record<string, unknown>)[key];
    }
  });
  removeIfDisabled(cleanOptions, options.use_core_settings, [
    'seed',
    'steps',
    'guidance_scale',
    'temperature',
    'cfg_rescale',
    'quality',
  ]);

  if (!options.use_dimensions_format) {
    removeProps(cleanOptions, [
      'width',
      'height',
      'aspect_ratio',
      'output_format',
      'dynamic_range',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_dimensions, ['width', 'height']);
  }

  removeIfDisabled(cleanOptions, options.use_style_preset, ['style_preset']);
  removeIfDisabled(cleanOptions, options.use_negative_prompt, [
    'negative_prompt',
  ]);

  if (!options.use_material) {
    removeProps(cleanOptions, ['made_out_of', 'secondary_material']);
  } else {
    removeIfDisabled(cleanOptions, options.use_secondary_material, [
      'secondary_material',
    ]);
  }

  if (!options.use_camera_composition) {
    removeProps(cleanOptions, [
      'camera_angle',
      'shot_type',
      'subject_focus',
      'composition_rules',
      'camera_type',
      'lens_type',
    ]);
  }

  removeIfDisabled(cleanOptions, options.use_aperture, ['aperture']);
  removeIfDisabled(cleanOptions, options.use_lens_type, ['lens_type']);
  removeIfDisabled(cleanOptions, options.use_dof, ['depth_of_field']);
  removeIfDisabled(cleanOptions, options.use_blur_style, ['blur_style']);
  removeIfDisabled(cleanOptions, options.use_color_grading, ['color_grade']);
  removeIfDisabled(cleanOptions, options.use_lighting, ['lighting']);

  if (!options.use_motion_animation) {
    removeProps(cleanOptions, [
      'duration_seconds',
      'fps',
      'motion_strength',
      'camera_motion',
      'motion_direction',
      'frame_interpolation',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_duration, ['duration_seconds']);
  }

  if (!options.use_enhancement_safety) {
    removeProps(cleanOptions, [
      'prevent_deformities',
      'upscale',
      'safety_filter',
      'keep_typography_details',
      'quality_booster',
      'enhance_object_reflections',
      'keep_key_details',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_safety_filter, [
      'safety_filter',
    ]);
    removeIfDisabled(cleanOptions, options.use_quality_booster, [
      'quality_booster',
    ]);
  }

  if (!options.use_face_enhancements) {
    removeProps(cleanOptions, [
      'add_same_face',
      'dont_change_face',
      'subject_gender',
      'makeup_style',
      'character_mood',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_subject_gender, [
      'subject_gender',
    ]);
    removeIfDisabled(cleanOptions, options.use_makeup_style, ['makeup_style']);
    removeIfDisabled(cleanOptions, options.use_character_mood, [
      'character_mood',
    ]);
  }

  removeIfDisabled(cleanOptions, options.use_signature, ['signature']);

  if (!options.use_settings_location) {
    removeProps(cleanOptions, [
      'year',
      'environment',
      'location',
      'time_of_year',
      'season',
      'atmosphere_mood',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_environment, ['environment']);
    removeIfDisabled(cleanOptions, options.use_location, ['location']);
  }

  removeIfDisabled(cleanOptions, options.use_season, ['season']);
  removeIfDisabled(cleanOptions, options.use_time_of_year, ['time_of_year']);
  removeIfDisabled(cleanOptions, options.use_atmosphere_mood, [
    'atmosphere_mood',
  ]);
  removeIfDisabled(cleanOptions, options.use_subject_mood, ['subject_mood']);

  if (!options.use_sword_type) {
    removeProps(cleanOptions, ['sword_type', 'sword_vibe']);
  }

  removeIfDisabled(cleanOptions, options.use_upscale_factor, ['upscale']);

  if (!options.use_dnd_section) {
    removeProps(cleanOptions, [
      'dnd_character_race',
      'dnd_character_class',
      'dnd_character_background',
      'dnd_character_alignment',
      'dnd_monster_type',
      'dnd_environment',
      'dnd_magic_school',
      'dnd_item_type',
    ]);
  } else {
    removeIfDisabled(cleanOptions, options.use_dnd_character_race, [
      'dnd_character_race',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_character_class, [
      'dnd_character_class',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_character_background, [
      'dnd_character_background',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_character_alignment, [
      'dnd_character_alignment',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_monster_type, [
      'dnd_monster_type',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_environment, [
      'dnd_environment',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_magic_school, [
      'dnd_magic_school',
    ]);
    removeIfDisabled(cleanOptions, options.use_dnd_item_type, [
      'dnd_item_type',
    ]);
  }

  removeProps(cleanOptions, [
    'use_dimensions',
    'use_signature',
    'use_motion_animation',
    'use_enhancement_safety',
    'use_settings_location',
    'use_season',
    'use_atmosphere_mood',
    'use_subject_mood',
    'use_sword_type',
    'use_style_preset',
    'use_negative_prompt',
    'use_camera_composition',
  ]);
  delete (cleanOptions as { image_count?: number }).image_count;

  Object.keys(cleanOptions).forEach((k) => {
    if ((cleanOptions as Record<string, unknown>)[k] === false) {
      delete (cleanOptions as Record<string, unknown>)[k];
    }
  });

  return JSON.stringify(cleanOptions, null, 2);
}
