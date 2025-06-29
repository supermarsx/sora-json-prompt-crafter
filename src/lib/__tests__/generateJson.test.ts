import { generateJson } from '../generateJson';
import { DEFAULT_OPTIONS } from '../defaultOptions';

function parse(json: string) {
  return JSON.parse(json) as Record<string, unknown>;
}

describe('generateJson', () => {
  test('includes negative_prompt when enabled', () => {
    const opts = { ...DEFAULT_OPTIONS, use_negative_prompt: true };
    const obj = parse(generateJson(opts));
    expect(obj.negative_prompt).toBeDefined();
  });

  test('omits negative_prompt when disabled', () => {
    const opts = { ...DEFAULT_OPTIONS, use_negative_prompt: false };
    const obj = parse(generateJson(opts));
    expect(obj.negative_prompt).toBeUndefined();
  });

  test('omits all dimension fields when format disabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: false,
    };
    const obj = parse(generateJson(opts));
    expect(obj.width).toBeUndefined();
    expect(obj.height).toBeUndefined();
    expect(obj.aspect_ratio).toBeUndefined();
    expect(obj.output_format).toBeUndefined();
  });

  test('keeps aspect ratio when dimensions disabled but format enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_dimensions_format: true,
      use_dimensions: false,
    };
    const obj = parse(generateJson(opts));
    expect(obj.width).toBeUndefined();
    expect(obj.height).toBeUndefined();
    expect(obj.aspect_ratio).toBeDefined();
  });

  test('removes style_preset when toggled off', () => {
    const opts = { ...DEFAULT_OPTIONS, use_style_preset: false };
    const obj = parse(generateJson(opts));
    expect(obj.style_preset).toBeUndefined();
  });

  test('removes material fields when use_material is false', () => {
    const opts = { ...DEFAULT_OPTIONS, use_material: false };
    const obj = parse(generateJson(opts));
    expect(obj.made_out_of).toBeUndefined();
    expect(obj.secondary_material).toBeUndefined();
  });

  test('removes motion fields when use_motion_animation is false', () => {
    const opts = { ...DEFAULT_OPTIONS, use_motion_animation: false };
    const obj = parse(generateJson(opts));
    expect(obj.duration_seconds).toBeUndefined();
    expect(obj.fps).toBeUndefined();
    expect(obj.motion_strength).toBeUndefined();
    expect(obj.camera_motion).toBeUndefined();
    expect(obj.motion_direction).toBeUndefined();
    expect(obj.frame_interpolation).toBeUndefined();
  });

  test('keeps material and motion fields when enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_material: true,
      use_secondary_material: true,
      secondary_material: 'wood',
      use_motion_animation: true,
      use_duration: true,
    };
    const obj = parse(generateJson(opts));
    expect(obj.made_out_of).toBeDefined();
    expect(obj.secondary_material).toBeDefined();
    expect(obj.duration_seconds).toBeDefined();
    expect(obj.fps).toBeDefined();
    expect(obj.motion_strength).toBeDefined();
    expect(obj.camera_motion).toBeDefined();
    expect(obj.motion_direction).toBeDefined();
    expect(obj.frame_interpolation).toBeDefined();
  });

  test('includes dnd fields when section and flags enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_dnd_section: true,
      use_dnd_character_race: true,
      dnd_character_race: 'elf',
      use_dnd_character_class: true,
      dnd_character_class: 'wizard',
      use_dnd_character_background: true,
      dnd_character_background: 'noble',
      use_dnd_character_alignment: true,
      dnd_character_alignment: 'chaotic good',
      use_dnd_monster_type: true,
      dnd_monster_type: 'dragon',
      use_dnd_environment: true,
      dnd_environment: 'dungeon',
      use_dnd_magic_school: true,
      dnd_magic_school: 'evocation',
      use_dnd_item_type: true,
      dnd_item_type: 'sword',
    };
    const obj = parse(generateJson(opts));
    expect(obj.dnd_character_race).toBeDefined();
    expect(obj.dnd_character_class).toBeDefined();
    expect(obj.dnd_character_background).toBeDefined();
    expect(obj.dnd_character_alignment).toBeDefined();
    expect(obj.dnd_monster_type).toBeDefined();
    expect(obj.dnd_environment).toBeDefined();
    expect(obj.dnd_magic_school).toBeDefined();
    expect(obj.dnd_item_type).toBeDefined();
  });

  test('removes location related fields when settings location disabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_settings_location: false,
      environment: 'desert',
      use_environment: true,
      location: 'cave',
      use_location: true,
      use_season: true,
      season: 'summer',
      use_atmosphere_mood: true,
      atmosphere_mood: 'gloomy',
      use_time_of_year: true,
      time_of_year: 'holidays',
    };
    const obj = parse(generateJson(opts));
    expect(obj.environment).toBeUndefined();
    expect(obj.location).toBeUndefined();
    expect(obj.time_of_year).toBeUndefined();
    expect(obj.season).toBeUndefined();
    expect(obj.atmosphere_mood).toBeUndefined();
    expect(obj.year).toBeUndefined();
  });

  test('includes time_of_year when enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_settings_location: true,
      use_time_of_year: true,
      time_of_year: 'spring festival',
    };
    const obj = parse(generateJson(opts));
    expect(obj.time_of_year).toBe('spring festival');
  });

  test('handles sword type with dnd section enabled', () => {
    const opts = {
      ...DEFAULT_OPTIONS,
      use_sword_type: true,
      sword_type: 'longsword',
      sword_vibe: 'ancient',
      use_dnd_section: true,
      use_dnd_character_race: true,
      dnd_character_race: 'human',
    };
    const obj = parse(generateJson(opts));
    expect(obj.sword_type).toBeDefined();
    expect(obj.dnd_character_race).toBeDefined();
  });
});
