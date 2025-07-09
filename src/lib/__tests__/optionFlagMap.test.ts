import { OPTION_FLAG_MAP } from '../optionFlagMap';

describe('OPTION_FLAG_MAP', () => {
  test('returns correct flag for lighting', () => {
    expect(OPTION_FLAG_MAP.lighting).toBe('use_lighting');
  });

  test('returns correct flag for secondary_material', () => {
    expect(OPTION_FLAG_MAP.secondary_material).toBe('use_secondary_material');
  });

  test('returns correct flag for camera_angle', () => {
    expect(OPTION_FLAG_MAP.camera_angle).toBe('use_camera_composition');
  });

  test('returns undefined for nonexistent key', () => {
    // @ts-expect-error - property does not exist
    expect(OPTION_FLAG_MAP.nonexistent).toBeUndefined();
  });
});
