import type {
  ShotTypeOption,
  CameraAngleOption,
  CompositionRulesOption,
  CameraTypeOption,
  LensTypeOption,
  ApertureOption,
  BlurStyleOption,
  DepthOfFieldOption,
} from '@/data/cameraPresets';
import type { LightingOption } from '@/data/lightingOptions';
import type { ColorGradingOption } from '@/data/colorGradingOptions';
import type { MaterialOption } from '@/data/materialOptions';
import type {
  SubjectGenderOption,
  MakeupStyleOption,
  CharacterMoodOption,
} from '@/data/faceOptions';
import type { QualityBoosterOption } from '@/data/enhancementOptions';

export interface SoraOptions {
  /**
   * Primary text prompt describing the desired output.
   * Accepts free-form text.
   */
  prompt: string;

  /**
   * Text listing attributes to avoid in the output.
   * Only used when {@link use_negative_prompt} is true.
   */
  negative_prompt: string;

  /**
   * Enables inclusion of {@link negative_prompt} in generation.
   */
  use_negative_prompt: boolean;

  /**
   * Random seed for reproducibility. Use `null` for a random seed.
   * Integer value.
   */
  seed: number | null;

  /**
   * Number of diffusion steps to run.
   * Higher values may yield finer detail. Unit: steps.
   */
  steps: number;

  /**
   * Classifier-free guidance scale controlling prompt adherence.
   * Typically between 0 and 20.
   */
  guidance_scale: number;

  /**
   * Output width in pixels. Requires {@link use_dimensions}.
   */
  width?: number;

  /**
   * Output height in pixels. Requires {@link use_dimensions}.
   */
  height?: number;

  /**
   * Toggles manual width and height via {@link width} and {@link height}.
   */
  use_dimensions: boolean;

  /**
   * Output aspect ratio when explicit dimensions are disabled.
   * Valid values: '16:9', '21:9', '4:3', '1:1', '9:16'.
   * Used when {@link use_dimensions_format} is true.
   */
  aspect_ratio: '16:9' | '21:9' | '4:3' | '1:1' | '9:16';

  /**
   * Rescales the guidance scale to reduce artifacts.
   * Value between 0 and 1.
   */
  cfg_rescale: number;

  /**
   * Preset style selection used when {@link use_style_preset} is true.
   */
  style_preset: {
    /** Category of the style preset. */
    category: string;
    /** Name of the style within the category. */
    style: string;
  };

  /**
   * Enables application of {@link style_preset}.
   */
  use_style_preset: boolean;

  /**
   * Desired quality level of the output.
   * Must be one of the listed string presets from 'defective' to 'low'.
   */
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

  /**
   * Sampling temperature controlling randomness. Higher is more varied.
   */
  temperature: number;

  /**
    * Desired color dynamic range. Requires {@link use_dynamic_range}.
    */
  dynamic_range: 'SDR' | 'HDR';

  /**
   * File format for the generated output. Used when {@link use_output_format}.
   */
  output_format: 'png' | 'jpg' | 'webp';

  /**
   * Length of generated animation in seconds. Requires {@link use_duration}.
   */
  duration_seconds: number;

  /**
   * Frames per second for animation. Extended range allowed when {@link extended_fps} is true.
   */
  fps: number;

  /**
   * Strength of motion for animations. Requires {@link use_motion_strength}.
   */
  motion_strength: number;

  /**
   * Style of camera motion, e.g. pan or tilt. Used with {@link use_motion_animation}.
   */
  camera_motion: string;

  /**
   * Direction of camera movement. Valid values: 'forward', 'backward', 'left', 'right', 'up', 'down'.
   * Used when {@link use_motion_animation}.
   */
  motion_direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';

  /**
   * Camera angle preset. Applied when {@link use_camera_angle} is true.
   */
  camera_angle: CameraAngleOption;

  /**
   * Shot type preset (e.g., close-up). Controlled by {@link use_shot_type}.
   */
  shot_type: ShotTypeOption;

  /**
   * Primary subject focus position. Enabled with {@link use_subject_focus}.
   */
  subject_focus: 'center' | 'left' | 'right' | 'top' | 'bottom';

  /**
   * Composition rules to apply. Requires {@link use_camera_composition}.
   */
  composition_rules: CompositionRulesOption[];

  /**
   * Lighting preset used when {@link use_lighting} is true.
   */
  lighting: LightingOption;

  /**
   * Color grading preset applied when {@link use_color_grading}.
   */
  color_grade: ColorGradingOption;

  /**
   * Depth of field setting. Enabled by {@link use_dof}.
   */
  depth_of_field: DepthOfFieldOption;

  /**
   * Lens type selection. Controlled by {@link use_lens_type}.
   */
  lens_type: LensTypeOption;

  /**
   * Frame interpolation style for animations.
   * Valid values: 'smooth', 'realistic', or 'sharp'.
   */
  frame_interpolation: 'smooth' | 'realistic' | 'sharp';

  /**
   * Upscaling factor for output resolution. Requires {@link use_upscale_factor}.
   */
  upscale: number;

  /**
   * Safety filter level for content. Used when {@link use_safety_filter}.
   */
  safety_filter: 'strict' | 'moderate' | 'off';

  /**
   * Primary material the subject is made of. Enabled by {@link use_material}.
   */
  made_out_of: MaterialOption;

  /**
   * Environment or setting description. Requires {@link use_environment}.
   */
  environment: string;

  /**
   * Enables the {@link signature} field.
   */
  use_signature: boolean;

  /**
   * Signature text to embed, used when {@link use_signature} is true.
   */
  signature?: string;

  /**
   * Blur technique to apply. Controlled by {@link use_blur_style}.
   */
  blur_style: BlurStyleOption;

  /**
   * Camera aperture setting (f-stop). Requires {@link use_aperture}.
   */
  aperture: ApertureOption;

  /**
   * Master flag enabling motion-related fields like {@link fps} and {@link motion_strength}.
   */
  use_motion_animation: boolean;

  /**
   * Enables safety enhancements such as {@link enhance_object_reflections}.
   */
  use_enhancement_safety: boolean;

  /**
   * Camera model or type in use.
   */
  camera_type: CameraTypeOption;

  /**
   * Toggles location-specific settings.
   */
  use_settings_location: boolean;

  /**
   * Year setting for contextual generation. Requires {@link use_year}.
   */
  year: number;

  /**
   * Enables the {@link season} field.
   */
  use_season: boolean;

  /**
   * Season descriptor such as "winter". Used when {@link use_season}.
   */
  season?: string;

  /**
   * Enables the {@link atmosphere_mood} field.
   */
  use_atmosphere_mood: boolean;

  /**
   * Overall atmosphere or mood setting. Used when {@link use_atmosphere_mood} is true.
   */
  atmosphere_mood?: string;

  /**
   * Enables {@link subject_mood}.
   */
  use_subject_mood: boolean;

  /**
   * Mood of the main subject. Applies when {@link use_subject_mood} is true.
   */
  subject_mood?: string;

  /**
   * Enables the {@link sword_type} field.
   */
  use_sword_type: boolean;

  /**
   * Type of sword in the scene. Requires {@link use_sword_type}.
   */
  sword_type?: string;

  /**
   * Additional sword vibe or feel. Requires {@link use_sword_details}.
   */
  sword_vibe?: string;

  /**
   * Master flag enabling fundamental settings like dimensions and quality.
   */
  use_core_settings: boolean;

  /**
   * When true, dimensions are specified via {@link width} and {@link height}; otherwise {@link aspect_ratio} is used.
   */
  use_dimensions_format: boolean;

  /**
   * Enables {@link lighting} adjustments.
   */
  use_lighting: boolean;

  /**
   * Enables {@link made_out_of} material selection.
   */
  use_material: boolean;

  /**
   * Enables {@link secondary_material} field.
   */
  use_secondary_material: boolean;

  /**
   * Optional secondary material when {@link use_secondary_material} is true.
   */
  secondary_material?: MaterialOption;

  /**
   * Enables {@link color_grade} adjustments.
   */
  use_color_grading: boolean;

  /**
   * Enables {@link environment} settings.
   */
  use_environment: boolean;

  /**
   * Enables the {@link time_of_year} field.
   */
  use_time_of_year: boolean;

  /**
   * Specific time of year (e.g., "spring"). Requires {@link use_time_of_year}.
   */
  time_of_year?: string;

  /**
   * Enables {@link character_mood}.
   */
  use_character_mood: boolean;

  /**
   * Character mood setting used when {@link use_character_mood} is true.
   */
  character_mood?: CharacterMoodOption;

  /**
   * Enables sword detail fields such as {@link sword_vibe}.
   */
  use_sword_details: boolean;

  /**
   * Attempts to avoid anatomical deformities.
   */
  prevent_deformities: boolean;

  /**
   * Enables {@link upscale} factor adjustments.
   */
  use_upscale_factor: boolean;

  /**
   * Enables {@link safety_filter}.
   */
  use_safety_filter: boolean;

  /**
   * Preserves typography details in generated text.
   */
  keep_typography_details: boolean;

  /**
   * Enables facial enhancement related fields.
   */
  use_face_enhancements: boolean;

  /**
   * Adds additional faces matching the main face. Requires {@link use_face_enhancements}.
   */
  add_same_face: boolean;

  /**
   * Prevents alterations to detected faces. Requires {@link use_face_enhancements}.
   */
  dont_change_face: boolean;

  /**
   * Enables {@link subject_gender}.
   */
  use_subject_gender: boolean;

  /**
   * Gender of the main subject. Used when {@link use_subject_gender} is true.
   */
  subject_gender?: SubjectGenderOption;

  /**
   * Enables {@link makeup_style} field.
   */
  use_makeup_style: boolean;

  /**
   * Makeup style to apply when {@link use_makeup_style} is true.
   */
  makeup_style?: MakeupStyleOption;

  /**
   * Enables {@link quality_booster} option.
   */
  use_quality_booster: boolean;

  /**
   * Quality booster preset applied when {@link use_quality_booster} is true.
   */
  quality_booster?: QualityBoosterOption;

  /**
   * Enhances reflections on objects. Often tied to {@link use_enhancement_safety}.
   */
  enhance_object_reflections: boolean;

  /**
   * Maintains key scene details during generation.
   */
  keep_key_details: boolean;

  /**
   * Enables conversion to black and white. Toggles {@link black_and_white_preset}.
   */
  use_black_and_white: boolean;

  /**
   * Preset for black and white rendering. Used when {@link use_black_and_white}.
   */
  black_and_white_preset?: string;

  /**
   * Enables the {@link location} field.
   */
  use_location: boolean;

  /**
   * Specific location description. Requires {@link use_location}.
   */
  location?: string;

  /**
   * Enables {@link special_effects} list.
   */
  use_special_effects: boolean;

  /**
   * Array of special effect identifiers. Used when {@link use_special_effects}.
   */
  special_effects?: string[];

  /**
   * Enables {@link lut_preset} application.
   */
  use_lut_preset: boolean;

  /**
   * Lookup table preset for color grading. Requires {@link use_lut_preset}.
   */
  lut_preset?: string;

  /**
   * Enables the Dungeons & Dragons options section.
   */
  use_dnd_section: boolean;

  /**
   * Enables {@link dnd_character_race}.
   */
  use_dnd_character_race: boolean;

  /**
   * D&D character race. Used when {@link use_dnd_character_race} is true.
   */
  dnd_character_race?: string;

  /**
   * Enables {@link dnd_character_class}.
   */
  use_dnd_character_class: boolean;

  /**
   * D&D character class. Requires {@link use_dnd_character_class}.
   */
  dnd_character_class?: string;

  /**
   * Enables {@link dnd_character_background}.
   */
  use_dnd_character_background: boolean;

  /**
   * D&D character background. Applies when {@link use_dnd_character_background}.
   */
  dnd_character_background?: string;

  /**
   * Enables {@link dnd_character_alignment}.
   */
  use_dnd_character_alignment: boolean;

  /**
   * Alignment descriptor from D&D. Used when {@link use_dnd_character_alignment}.
   */
  dnd_character_alignment?: string;

  /**
   * Enables {@link dnd_monster_type}.
   */
  use_dnd_monster_type: boolean;

  /**
   * Type of D&D monster. Requires {@link use_dnd_monster_type}.
   */
  dnd_monster_type?: string;

  /**
   * Enables {@link dnd_environment}.
   */
  use_dnd_environment: boolean;

  /**
   * D&D environment descriptor. Applies when {@link use_dnd_environment} is true.
   */
  dnd_environment?: string;

  /**
   * Enables {@link dnd_magic_school}.
   */
  use_dnd_magic_school: boolean;

  /**
   * D&D magic school selection. Used when {@link use_dnd_magic_school}.
   */
  dnd_magic_school?: string;

  /**
   * Enables {@link dnd_item_type}.
   */
  use_dnd_item_type: boolean;

  /**
   * Type of D&D item. Applies when {@link use_dnd_item_type} is true.
   */
  dnd_item_type?: string;

  /**
   * Enables {@link camera_angle}.
   */
  use_camera_angle: boolean;

  /**
   * Enables {@link lens_type} selection.
   */
  use_lens_type: boolean;

  /**
   * Enables {@link aperture} setting.
   */
  use_aperture: boolean;

  /**
   * Enables {@link depth_of_field} control.
   */
  use_dof: boolean;

  /**
   * Enables {@link blur_style} selection.
   */
  use_blur_style: boolean;

  /**
   * Enables compositional rules via {@link composition_rules}.
   */
  use_camera_composition: boolean;

  /**
   * Enables {@link shot_type} presets.
   */
  use_shot_type: boolean;

  /**
   * Enables {@link subject_focus} option.
   */
  use_subject_focus: boolean;

  /**
   * Allows higher-than-normal motion strength values.
   * Works alongside {@link use_motion_strength}.
   */
  extended_motion_strength: boolean;

  /**
   * Enables {@link motion_strength}.
   */
  use_motion_strength: boolean;

  /**
   * Allows higher frame rates than default.
   */
  extended_fps: boolean;

  /**
   * Enables {@link duration_seconds}.
   */
  use_duration: boolean;

  /**
   * Enables {@link output_format}.
   */
  use_output_format: boolean;

  /**
   * Enables {@link dynamic_range}.
   */
  use_dynamic_range: boolean;

  /**
   * Enables the {@link year} field.
   */
  use_year: boolean;
}
