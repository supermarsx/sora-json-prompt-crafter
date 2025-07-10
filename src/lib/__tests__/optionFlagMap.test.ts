import { OPTION_FLAG_MAP } from '../optionFlagMap';
import { DEFAULT_OPTIONS } from '../defaultOptions';

describe('OPTION_FLAG_MAP', () => {
  test('every flag exists on DEFAULT_OPTIONS', () => {
    for (const flag of Object.values(OPTION_FLAG_MAP)) {
      expect(flag in DEFAULT_OPTIONS).toBe(true);
    }
  });

  test('returns correct flag for lighting', () => {
    expect(OPTION_FLAG_MAP.lighting).toBe('use_lighting');
  });

  test('returns correct flag for secondary_material', () => {
    expect(OPTION_FLAG_MAP.secondary_material).toBe('use_secondary_material');
  });

  test('returns correct flag for dnd_character_race', () => {
    expect(OPTION_FLAG_MAP.dnd_character_race).toBe('use_dnd_character_race');
  });

  test('returns undefined for nonexistent key', () => {
    // @ts-expect-error - property does not exist
    expect(OPTION_FLAG_MAP.nonexistent).toBeUndefined();
  });
});
