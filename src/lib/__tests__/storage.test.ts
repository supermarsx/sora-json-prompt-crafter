import { safeGet, safeSet, safeRemove } from '../storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test('safeGet returns default for missing key', () => {
    expect(safeGet('missing', 'def')).toBe('def');
  });

  test('safeGet returns default when JSON.parse throws', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('bad', '{oops');
    expect(safeGet('bad', 'fallback', { json: true })).toBe('fallback');
    expect(warnSpy).toHaveBeenCalled();
  });

  test('safeGet parses JSON when present', () => {
    localStorage.setItem('obj', '{"a":1}');
    expect(safeGet<{ a: number }>('obj', null, { json: true })).toEqual({ a: 1 });
  });

  test('safeSet logs warning when setItem fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });
    expect(safeSet('k', 'v')).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('safeSet returns true when setItem succeeds', () => {
    const spy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});
    expect(safeSet('k', 'v')).toBe(true);
    expect(spy).toHaveBeenCalledWith('k', 'v');
  });

  test('safeSet logs warning when value is not string and json is false', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(safeSet('k', { a: 1 })).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('safeRemove logs warning when removeItem fails', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('fail');
    });
    expect(safeRemove('k')).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('safeRemove returns true when removeItem succeeds', () => {
    const spy = jest
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {});
    expect(safeRemove('k')).toBe(true);
    expect(spy).toHaveBeenCalledWith('k');
  });


  test('safeSet stringifies value when json option is true', () => {
    const spy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});
    expect(safeSet('obj', { a: 1 }, { json: true })).toBe(true);
    expect(spy).toHaveBeenCalledWith('obj', '{"a":1}');
  });

  test('safeSet logs warning when setItem fails with json option', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('fail');
    });
    expect(safeSet('k', { a: 1 }, { json: true })).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});
