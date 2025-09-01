import { saveSectionPreset, getSectionPresets, removeSectionPreset } from '@/lib/storage';

describe('section presets', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('save and apply preset', () => {
    const values = { foo: 'bar' };
    saveSectionPreset('test', { name: 'MyPreset', values });
    const presets = getSectionPresets();
    expect(presets.test[0].values).toEqual(values);
    const apply = jest.fn();
    apply(presets.test[0].values);
    expect(apply).toHaveBeenCalledWith(values);
  });

  test('remove preset', () => {
    saveSectionPreset('test', { name: 'MyPreset', values: { foo: 'bar' } });
    removeSectionPreset('test', 'MyPreset');
    const presets = getSectionPresets();
    expect(presets.test).toEqual([]);
  });
});
