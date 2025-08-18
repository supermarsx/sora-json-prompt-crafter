import { exportAppData, importAppData } from '../storage';
import { CURRENT_JSON, JSON_HISTORY, DARK_MODE } from '../storage-keys';

describe('exportAppData/importAppData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('round trips application data', () => {
    const history = [{ id: 1, date: 'today', json: '{"a":1}' }];
    localStorage.setItem(CURRENT_JSON, 'test');
    localStorage.setItem(JSON_HISTORY, JSON.stringify(history));
    localStorage.setItem(DARK_MODE, JSON.stringify(true));

    const exported = exportAppData();
    expect(exported.currentJson).toBe('test');
    expect(exported.jsonHistory).toHaveLength(1);
    expect(exported.preferences[DARK_MODE]).toBe(true);

    localStorage.clear();
    importAppData(exported);

    expect(localStorage.getItem(CURRENT_JSON)).toBe('test');
    expect(JSON.parse(localStorage.getItem(JSON_HISTORY) || '[]')).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(DARK_MODE) || 'false')).toBe(true);
  });
});
