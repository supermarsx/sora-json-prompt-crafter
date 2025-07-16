import { jest } from '@jest/globals';
import { USERSCRIPT_VERSION } from '../../src/version';
import type { Plugin } from 'vite';

jest.mock('vite', () => ({
  __esModule: true,
  defineConfig: (fn: unknown) => fn,
}));
jest.mock('@vitejs/plugin-react-swc', () => ({
  __esModule: true,
  default: () => ({}),
}));
jest.mock('vite-plugin-pwa', () => ({
  __esModule: true,
  VitePWA: () => ({}),
}));
jest.mock('lovable-tagger', () => ({
  __esModule: true,
  componentTagger: () => ({}),
}));
jest.mock('child_process', () => ({
  __esModule: true,
  execSync: () => '',
}));

const existsSyncMock = jest.fn();
const readFileSyncMock = jest.fn();
const writeFileSyncMock = jest.fn();

jest.mock('fs', () => ({
  __esModule: true,
  default: {
    existsSync: existsSyncMock,
    readFileSync: readFileSyncMock,
    writeFileSync: writeFileSyncMock,
  },
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
  writeFileSync: writeFileSyncMock,
}));

beforeEach(() => {
  jest.resetModules();
  existsSyncMock.mockReset();
  readFileSyncMock.mockReset();
  writeFileSyncMock.mockReset();
  existsSyncMock.mockReturnValue(true);
  readFileSyncMock.mockReturnValue(
    '// __USERSCRIPT_VERSION__\nconst DEBUG = false;\n',
  );
});

describe('inject-userscript-meta plugin', () => {
  test.each([
    ['development', 'true'],
    ['production', 'false'],
  ])('replaces placeholders in %s mode', async (mode, debugVal) => {
    const { default: configFn } = await import('../../vite.config.ts');
    const config = configFn({ mode, command: 'build' });
    const plugin = (config.plugins as Plugin[]).find(
      (p) => p.name === 'inject-userscript-meta',
    );
    plugin?.writeBundle?.();

    expect(writeFileSyncMock).toHaveBeenCalledTimes(1);
    const written = writeFileSyncMock.mock.calls[0][1] as string;
    expect(written).toContain(USERSCRIPT_VERSION);
    expect(written).toContain(`const DEBUG = ${debugVal};`);
  });
});
