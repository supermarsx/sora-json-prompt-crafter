import { jest } from '@jest/globals';

const readFileSyncMock = jest.fn(() => '<html></html>');
const JSDOMMock = jest.fn().mockImplementation(() => ({
  window: { document: {}, Node: class {}, Element: class {} },
}));
interface AxeResults {
  violations: { id: string; help: string }[];
}
const runMock = jest.fn(
  (
    doc: Document,
    opts: unknown,
    cb: (err: unknown, results: AxeResults) => void,
  ) => {
    cb(null, { violations: [{ id: 'foo', help: 'bar' }] });
  },
);

jest.mock('fs', () => ({ __esModule: true, readFileSync: readFileSyncMock }));
jest.mock('jsdom', () => ({ __esModule: true, JSDOM: JSDOMMock }));
jest.mock('axe-core', () => ({ __esModule: true, default: { run: runMock } }));

describe('accessibilityCheck', () => {
  test('reports violations and exits with code 1', async () => {
    process.exitCode = 0;
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await import('../accessibilityCheck.js');
    await new Promise((r) => process.nextTick(r));
    expect(runMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      'Accessibility violations found:',
      expect.any(Number),
    );
    expect(process.exitCode).toBe(1);
    logSpy.mockRestore();
  });
});
