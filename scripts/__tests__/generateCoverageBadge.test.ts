import { jest } from '@jest/globals';

const sampleXml = `<?xml version="1.0"?><coverage><project><metrics statements="20" coveredstatements="17"/></project></coverage>`;
const readFileSyncMock = jest.fn(() => sampleXml);
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
  test('creates badge with correct percent and color', async () => {
    await import('../generateCoverageBadge.js');
    expect(makeBadgeMock).toHaveBeenCalledWith({
      label: 'coverage',
      message: '85%',
      color: 'green',
      style: 'for-the-badge',
    });
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'coverage.svg',
      '<svg>badge</svg>',
    );
  });

  test('exits with code 1 when coverage file is missing', async () => {
    readFileSyncMock.mockImplementationOnce(() => {
      throw new Error('no file');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(((code?: number) => {
        throw new Error(`exit:${code}`);
      }) as never);
    await expect(import('../generateCoverageBadge.js')).rejects.toThrow('exit:1');
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
    const exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(((code?: number) => {
        throw new Error(`exit:${code}`);
      }) as never);
    await expect(import('../generateCoverageBadge.js')).rejects.toThrow('exit:1');
    expect(errorSpy).toHaveBeenCalledWith('Unable to parse coverage metrics');
    expect(exitSpy).toHaveBeenCalledWith(1);
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
