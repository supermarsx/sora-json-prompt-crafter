import { jest } from '@jest/globals';

const readFileSyncMock = jest.fn();
const writeFileSyncMock = jest.fn();

jest.mock('fs', () => ({
  __esModule: true,
  readFileSync: readFileSyncMock,
  writeFileSync: writeFileSyncMock,
}));

const makeBadgeMock = jest.fn(() => '<svg>badge</svg>');
jest.mock('badge-maker', () => ({
  __esModule: true,
  makeBadge: makeBadgeMock,
}));

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe('generateCoverageBadge', () => {
  const cases = [
    { pct: '95', statements: 20, covered: 19, color: 'brightgreen' },
    { pct: '85', statements: 20, covered: 17, color: 'green' },
    { pct: '65', statements: 20, covered: 13, color: 'yellow' },
  ];

  test.each(cases)(
    'creates badge for $pct%',
    async ({ pct, statements, covered, color }) => {
      const xml = `<?xml version="1.0"?><coverage><project><metrics statements="${statements}" coveredstatements="${covered}"/></project></coverage>`;
      readFileSyncMock.mockReturnValueOnce(xml);
      await import('../generateCoverageBadge.js');
      expect(makeBadgeMock).toHaveBeenCalledWith({
        label: 'coverage',
        message: `${pct}%`,
        color,
        style: 'for-the-badge',
      });
      expect(writeFileSyncMock).toHaveBeenCalledWith(
        'coverage.svg',
        '<svg>badge</svg>',
      );
    },
  );

  test('exits with code 1 when coverage file is missing', async () => {
    readFileSyncMock.mockImplementationOnce(() => {
      throw new Error('no file');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit:${code}`);
    }) as never);
    await expect(import('../generateCoverageBadge.js')).rejects.toThrow(
      'exit:1',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Coverage file not found:',
      'coverage/clover.xml',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('exits with code 1 when coverage xml cannot be parsed', async () => {
    readFileSyncMock.mockReturnValueOnce('<coverage></coverage>');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(((
      code?: number,
    ) => {
      throw new Error(`exit:${code}`);
    }) as never);
    await expect(import('../generateCoverageBadge.js')).rejects.toThrow(
      'exit:1',
    );
    expect(errorSpy).toHaveBeenCalledWith('Unable to parse coverage metrics');
    expect(exitSpy).toHaveBeenCalledWith(1);
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
