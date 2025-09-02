import { addCustomValue, exportCustomValues, importCustomValues, getCustomValues } from '../storage';

describe('custom values import/export', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('exportCustomValues returns stored values', () => {
    addCustomValue('color', 'red');
    addCustomValue('color', 'blue');
    addCustomValue('size', 'large');
    const exported = exportCustomValues();
    expect(exported).toEqual({ color: ['red', 'blue'], size: ['large'] });
  });

  test('importCustomValues restores values', () => {
    const data = { theme: ['dark', 'light'] };
    importCustomValues(data);
    expect(getCustomValues()).toEqual(data);
  });
});
