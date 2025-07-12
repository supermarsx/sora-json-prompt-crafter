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

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  // clean globals modified by the script
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).window;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).document;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).Node;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (global as any).Element;
});

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

  test('logs success when no violations are found', async () => {
    process.exitCode = 0;
    runMock.mockImplementationOnce((doc, opts, cb) => {
      cb(null, { violations: [] });
    });
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await import('../accessibilityCheck.js');
    await new Promise((r) => process.nextTick(r));
    expect(runMock).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('No accessibility violations found.');
    expect(process.exitCode).toBe(0);
    logSpy.mockRestore();
  });

  test('exits with code 1 when HTML file cannot be read', async () => {
    readFileSyncMock.mockImplementationOnce(() => {
      throw new Error('no file');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit:${code}`);
    }) as never);
    await expect(import('../accessibilityCheck.js')).rejects.toThrow('exit:1');
    expect(errorSpy).toHaveBeenCalledWith(
      'Build output not found:',
      'dist/index.html',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
