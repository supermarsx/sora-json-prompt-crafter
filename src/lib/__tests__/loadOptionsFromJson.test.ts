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

  test('returns null for invalid options object', () => {
    const bad = JSON.stringify({ steps: 'ten' });
    expect(loadOptionsFromJson(bad)).toBeNull();
  });

  test('returns null when unknown keys are present', () => {
    const json = JSON.stringify({ prompt: 'ok', unknown_key: 'nope' });
    expect(loadOptionsFromJson(json)).toBeNull();
  });

  test('returns null when style_preset shape is invalid', () => {
    const json = JSON.stringify({ style_preset: { category: 'test' } });
    expect(loadOptionsFromJson(json)).toBeNull();
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

  test('enables flags for signature, gender, and makeup', () => {
    const json = JSON.stringify({
      signature: 'Jane Doe',
      subject_gender: 'female',
      makeup_style: 'gothic',
    });
    const result = loadOptionsFromJson(json)!;
    expect(result.use_signature).toBe(true);
    expect(result.signature).toBe('Jane Doe');
    expect(result.use_subject_gender).toBe(true);
    expect(result.subject_gender).toBe('female');
    expect(result.use_makeup_style).toBe(true);
    expect(result.makeup_style).toBe('gothic');
  });

  test('ignores dangerous keys to prevent prototype pollution', () => {
    const json = '{"constructor":{"prototype":{"polluted":"yes"}}}';
    const result = loadOptionsFromJson(json);
    expect(result).not.toBeNull();
    const typed = result as unknown as Record<string, unknown>;
    expect(typed['polluted']).toBeUndefined();
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });
});
