import {
  exportAppData,
  importAppData,
  addCustomValue,
  getCustomValues,
} from '../storage';
import {
  CURRENT_JSON,
  JSON_HISTORY,
  DARK_MODE,
  PRESETS,
  CUSTOM_VALUES,
} from '../storage-keys';
import {
  importCustomPresets,
  exportCurrentPresets,
  resetPresetCollections,
} from '../presetLoader';

describe('exportAppData/importAppData', () => {
  beforeEach(() => {
    localStorage.clear();
    resetPresetCollections();
  });

  test('round trips application data', () => {
    const history = [{ id: 1, date: 'today', json: '{"a":1}' }];
    localStorage.setItem(CURRENT_JSON, 'test');
    localStorage.setItem(JSON_HISTORY, JSON.stringify(history));
    localStorage.setItem(DARK_MODE, JSON.stringify(true));

    importCustomPresets({ stylePresets: { foo: ['bar'] } });
    addCustomValue('color', 'red');

    const exported = exportAppData();
    expect(exported.currentJson).toBe('test');
    expect(exported.jsonHistory).toHaveLength(1);
    expect(exported.preferences[DARK_MODE]).toBe(true);
    expect(exported.presets.stylePresets?.foo).toEqual(['bar']);
    expect(exported.customValues).toEqual({ color: ['red'] });

    localStorage.clear();
    resetPresetCollections();
    importAppData(exported);

    expect(localStorage.getItem(CURRENT_JSON)).toBe('test');
    expect(JSON.parse(localStorage.getItem(JSON_HISTORY) || '[]')).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(DARK_MODE) || 'false')).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(PRESETS) || '{}').stylePresets.foo,
    ).toEqual(['bar']);
    expect(JSON.parse(localStorage.getItem(CUSTOM_VALUES) || '{}')).toEqual({
      color: ['red'],
    });
    expect(exportCurrentPresets().stylePresets?.foo).toEqual(['bar']);
    expect(getCustomValues()).toEqual({ color: ['red'] });
  });
});
