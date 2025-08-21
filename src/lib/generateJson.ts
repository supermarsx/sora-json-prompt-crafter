import type { SoraOptions } from '@/lib/soraOptions';
import { OPTION_FLAG_MAP } from './optionFlagMap';

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
 * Generate a JSON string containing only the enabled Sora options.
 *
 * @param options - The full set of options selected by the user.
 * @returns A formatted JSON string representing the active options.
 */
export function generateJson(options: SoraOptions): string {
  const cleanOptions = { ...options };

  // Remove flags and extended properties from the output
  Object.keys(cleanOptions).forEach((key) => {
    if (key.startsWith('use_') || key.startsWith('extended_')) {
      delete (cleanOptions as Record<string, unknown>)[key];
    }
  });

  // Generic removal based on OPTION_FLAG_MAP
  for (const [optionKey, flagKey] of Object.entries(OPTION_FLAG_MAP)) {
    if (!(options as Record<string, unknown>)[flagKey]) {
      delete (cleanOptions as Record<string, unknown>)[optionKey];
    }
  }

  // Special cases that depend on multiple flags or sections
  if (options.use_dimensions_format && !options.use_dimensions) {
    removeProps(cleanOptions, ['width', 'height']);
  }

  if (!options.use_material) {
    removeProps(cleanOptions, ['secondary_material']);
  }

  if (!options.use_camera_composition) {
    removeProps(cleanOptions, ['lens_type']);
  }

  if (!options.use_motion_animation) {
    removeProps(cleanOptions, ['duration_seconds']);
  }

  if (!options.use_enhancement_safety) {
    removeProps(cleanOptions, ['upscale', 'safety_filter', 'quality_booster']);
  }

  if (!options.use_face_enhancements) {
    removeProps(cleanOptions, ['subject_gender', 'makeup_style', 'character_mood']);
  }

  if (!options.use_settings_location) {
    removeProps(cleanOptions, [
      'environment',
      'location',
      'time_of_year',
      'season',
      'atmosphere_mood',
    ]);
  }

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
  }

  delete (cleanOptions as { image_count?: number }).image_count;

  // Remove any boolean fields explicitly set to false
  Object.keys(cleanOptions).forEach((k) => {
    if ((cleanOptions as Record<string, unknown>)[k] === false) {
      delete (cleanOptions as Record<string, unknown>)[k];
    }
  });

  return JSON.stringify(cleanOptions, null, 2);
}
