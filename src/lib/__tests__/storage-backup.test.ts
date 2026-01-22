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
  CUSTOM_CSS,
  CUSTOM_JS,
  ACTION_LABELS_ENABLED,
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

  test('exports only non-empty custom CSS/JS', () => {
    localStorage.setItem(CUSTOM_CSS, '');
    localStorage.setItem(CUSTOM_JS, 'alert("hi")');
    const exported = exportAppData();
    expect(exported.preferences[CUSTOM_CSS]).toBeUndefined();
    expect(exported.preferences[CUSTOM_JS]).toBe('alert("hi")');
  });

  test('importAppData ignores non-object input', () => {
    localStorage.setItem(CURRENT_JSON, 'keep');
    importAppData(null as unknown as object);
    expect(localStorage.getItem(CURRENT_JSON)).toBe('keep');
  });

  test('importAppData stores preferences and custom code', () => {
    importAppData({
      currentJson: null,
      jsonHistory: [],
      preferences: {
        [ACTION_LABELS_ENABLED]: true,
        [CUSTOM_CSS]: 'body{color:red;}',
        [CUSTOM_JS]: 'console.log("ok")',
      },
      sectionPresets: {},
      presets: {},
      customValues: {},
    });
    expect(localStorage.getItem(ACTION_LABELS_ENABLED)).toBe('true');
    expect(localStorage.getItem(CUSTOM_CSS)).toBe('body{color:red;}');
    expect(localStorage.getItem(CUSTOM_JS)).toBe('console.log("ok")');
  });
});
