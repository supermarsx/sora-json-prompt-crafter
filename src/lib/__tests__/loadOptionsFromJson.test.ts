import { loadOptionsFromJson } from '../loadOptionsFromJson';
import { OPTION_FLAG_MAP } from '../optionFlagMap';

describe('loadOptionsFromJson', () => {
  test('returns merged options and enables flags for valid JSON', () => {
    const json = JSON.stringify({ prompt: 'test', width: 512 });
    const result = loadOptionsFromJson(json);
    expect(result).not.toBeNull();
    expect(result!.prompt).toBe('test');
    expect(result!.width).toBe(512);
    expect(result!.use_dimensions_format).toBe(true);
    expect(result!.use_dimensions).toBe(true);
  });

  test('returns null for invalid JSON', () => {
    const bad = '{ invalid json';
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(loadOptionsFromJson(bad)).toBeNull();
    spy.mockRestore();
  });

  test('normalizes composition_rules from snake_case', () => {
    const json = JSON.stringify({ composition_rules: ['rule_of_thirds'] });
    const result = loadOptionsFromJson(json);
    expect(result!.composition_rules).toEqual(['rule of thirds']);
  });

  test('sets lighting flag when lighting provided', () => {
    const json = JSON.stringify({ lighting: 'studio' });
    const result = loadOptionsFromJson(json)!;
    const flag = OPTION_FLAG_MAP.lighting;
    expect(result[flag as keyof typeof result]).toBe(true);
    expect(result.lighting).toBe('studio');
  });

  test('sets secondary material flag when secondary_material provided', () => {
    const json = JSON.stringify({ secondary_material: 'metal' });
    const result = loadOptionsFromJson(json)!;
    const flag = OPTION_FLAG_MAP.secondary_material;
    expect(result[flag as keyof typeof result]).toBe(true);
    expect(result.secondary_material).toBe('metal');
  });

  test('sets dnd flags when dnd field provided', () => {
    const json = JSON.stringify({ dnd_character_race: 'elf' });
    const result = loadOptionsFromJson(json)!;
    const flag = OPTION_FLAG_MAP.dnd_character_race;
    expect(result[flag as keyof typeof result]).toBe(true);
    expect(result.use_dnd_section).toBe(true);
    expect(result.dnd_character_race).toBe('elf');
  });
});
