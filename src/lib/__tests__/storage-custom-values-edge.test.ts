import {
  addCustomValue,
  getCustomValues,
  mergeCustomValues,
  removeCustomValue,
  updateCustomValue,
} from '../storage';

describe('custom values edge cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('mergeCustomValues appends stored values to base', () => {
    addCustomValue('lighting', 'neon');
    addCustomValue('lighting', 'soft');
    const merged = mergeCustomValues('lighting', ['default', 'studio']);
    expect(merged).toEqual(['default', 'studio', 'neon', 'soft']);
  });

  test('removeCustomValue deletes key when last value removed', () => {
    addCustomValue('material', 'wood');
    removeCustomValue('material', 'wood');
    expect(getCustomValues()).toEqual({});
  });

  test('updateCustomValue replaces existing value and dedupes', () => {
    addCustomValue('camera', 'dslr');
    addCustomValue('camera', 'dslr');
    updateCustomValue('camera', 'dslr', 'mirrorless');
    expect(getCustomValues()).toEqual({ camera: ['mirrorless'] });
  });

  test('updateCustomValue is a no-op when old value missing', () => {
    addCustomValue('style', 'cinematic');
    updateCustomValue('style', 'missing', 'nope');
    expect(getCustomValues()).toEqual({ style: ['cinematic'] });
  });
});
