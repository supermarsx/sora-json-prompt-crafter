import type { SoraOptions } from '@/lib/soraOptions'

export function generateJson(options: SoraOptions): string {
  const cleanOptions = { ...options }

  Object.keys(cleanOptions).forEach(key => {
    if (key.startsWith('use_') || key.startsWith('extended_')) {
      delete (cleanOptions as Record<string, unknown>)[key]
    }
  })

  if (!options.use_core_settings) {
    delete cleanOptions.seed
    delete cleanOptions.steps
    delete cleanOptions.guidance_scale
    delete cleanOptions.temperature
    delete cleanOptions.cfg_rescale
    delete cleanOptions.quality
  }

  if (!options.use_dimensions_format) {
    delete cleanOptions.width
    delete cleanOptions.height
    delete cleanOptions.aspect_ratio
    delete cleanOptions.output_format
    delete cleanOptions.dynamic_range
  } else if (!options.use_dimensions) {
    delete cleanOptions.width
    delete cleanOptions.height
  }

  if (!options.use_style_preset) {
    delete cleanOptions.style_preset
  }

  if (!options.use_negative_prompt) {
    delete cleanOptions.negative_prompt
  }

  if (!options.use_material) {
    delete cleanOptions.made_out_of
    delete cleanOptions.secondary_material
  } else if (!options.use_secondary_material) {
    delete cleanOptions.secondary_material
  }

  if (!options.use_camera_composition) {
    delete cleanOptions.camera_angle
    delete cleanOptions.shot_type
    delete cleanOptions.subject_focus
    delete cleanOptions.composition_rules
    delete cleanOptions.camera_type
    delete cleanOptions.lens_type
  }

  if (!options.use_aperture) {
    delete cleanOptions.aperture
  }

  if (!options.use_lens_type) {
    delete cleanOptions.lens_type
  }

  if (!options.use_dof) {
    delete cleanOptions.depth_of_field
  }

  if (!options.use_blur_style) {
    delete cleanOptions.blur_style
  }

  if (!options.use_color_grading) {
    delete cleanOptions.color_grade
  }

  if (!options.use_lighting) {
    delete cleanOptions.lighting
  }

  if (!options.use_motion_animation) {
    delete cleanOptions.duration_seconds
    delete cleanOptions.fps
    delete cleanOptions.motion_strength
    delete cleanOptions.camera_motion
    delete cleanOptions.motion_direction
    delete cleanOptions.frame_interpolation
  } else if (!options.use_duration) {
    delete cleanOptions.duration_seconds
  }

  if (!options.use_enhancement_safety) {
    delete cleanOptions.prevent_deformities
    delete cleanOptions.upscale
    delete cleanOptions.safety_filter
    delete cleanOptions.keep_typography_details
    delete cleanOptions.quality_booster
    delete cleanOptions.enhance_object_reflections
    delete cleanOptions.keep_key_details
  } else {
    if (!options.use_safety_filter) {
      delete cleanOptions.safety_filter
    }
    if (!options.use_quality_booster) {
      delete cleanOptions.quality_booster
    }
  }

  if (!options.use_face_enhancements) {
    delete cleanOptions.add_same_face
    delete cleanOptions.dont_change_face
    delete cleanOptions.subject_gender
    delete cleanOptions.makeup_style
    delete cleanOptions.character_mood
  } else {
    if (!options.use_subject_gender) {
      delete cleanOptions.subject_gender
    }
    if (!options.use_makeup_style) {
      delete cleanOptions.makeup_style
    }
    if (!options.use_character_mood) {
      delete cleanOptions.character_mood
    }
  }

  if (!options.use_signature) {
    delete cleanOptions.signature
  }

  if (!options.use_settings_location) {
    delete cleanOptions.year
    delete cleanOptions.environment
    delete cleanOptions.location
    delete cleanOptions.season
    delete cleanOptions.atmosphere_mood
  } else {
    if (!options.use_environment) {
      delete cleanOptions.environment
    }
    if (!options.use_location) {
      delete cleanOptions.location
    }
  }

  if (!options.use_season) {
    delete cleanOptions.season
  }
  if (!options.use_atmosphere_mood) {
    delete cleanOptions.atmosphere_mood
  }
  if (!options.use_subject_mood) {
    delete cleanOptions.subject_mood
  }
  if (!options.use_sword_type) {
    delete cleanOptions.sword_type
    delete cleanOptions.sword_vibe
  }
  if (!options.use_upscale_factor) {
    delete cleanOptions.upscale
  }

  if (!options.use_dnd_section) {
    delete cleanOptions.dnd_character_race
    delete cleanOptions.dnd_character_class
    delete cleanOptions.dnd_character_background
    delete cleanOptions.dnd_character_alignment
    delete cleanOptions.dnd_monster_type
    delete cleanOptions.dnd_environment
    delete cleanOptions.dnd_magic_school
    delete cleanOptions.dnd_item_type
  } else {
    if (!options.use_dnd_character_race) {
      delete cleanOptions.dnd_character_race
    }
    if (!options.use_dnd_character_class) {
      delete cleanOptions.dnd_character_class
    }
    if (!options.use_dnd_character_background) {
      delete cleanOptions.dnd_character_background
    }
    if (!options.use_dnd_character_alignment) {
      delete cleanOptions.dnd_character_alignment
    }
    if (!options.use_dnd_monster_type) {
      delete cleanOptions.dnd_monster_type
    }
    if (!options.use_dnd_environment) {
      delete cleanOptions.dnd_environment
    }
    if (!options.use_dnd_magic_school) {
      delete cleanOptions.dnd_magic_school
    }
    if (!options.use_dnd_item_type) {
      delete cleanOptions.dnd_item_type
    }
  }

  delete (cleanOptions as Record<string, unknown>).use_dimensions
  delete (cleanOptions as Record<string, unknown>).use_signature
  delete (cleanOptions as Record<string, unknown>).use_motion_animation
  delete (cleanOptions as Record<string, unknown>).use_enhancement_safety
  delete (cleanOptions as Record<string, unknown>).use_settings_location
  delete (cleanOptions as Record<string, unknown>).use_season
  delete (cleanOptions as Record<string, unknown>).use_atmosphere_mood
  delete (cleanOptions as Record<string, unknown>).use_subject_mood
  delete (cleanOptions as Record<string, unknown>).use_sword_type
  delete (cleanOptions as Record<string, unknown>).use_style_preset
  delete (cleanOptions as Record<string, unknown>).use_negative_prompt
  delete (cleanOptions as Record<string, unknown>).use_camera_composition
  delete (cleanOptions as { image_count?: number }).image_count

  Object.keys(cleanOptions).forEach(k => {
    if ((cleanOptions as Record<string, unknown>)[k] === false) {
      delete (cleanOptions as Record<string, unknown>)[k]
    }
  })

  return JSON.stringify(cleanOptions, null, 2)
}
