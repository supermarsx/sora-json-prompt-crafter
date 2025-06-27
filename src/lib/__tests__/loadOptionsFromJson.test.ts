import { loadOptionsFromJson } from '../loadOptionsFromJson';

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
});
