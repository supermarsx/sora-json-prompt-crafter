import { jest } from '@jest/globals';
import {
  mkdtempSync,
  writeFileSync,
  readFileSync,
  rmSync,
  mkdirSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const makeBadgeMock = jest.fn(() => '<svg>badge</svg>');
jest.mock('badge-maker', () => ({
  __esModule: true,
  makeBadge: makeBadgeMock,
}));

let cwd: string;

beforeEach(() => {
  jest.resetModules();
  cwd = process.cwd();
});

afterEach(() => {
  process.chdir(cwd);
});

describe('generateCoverageBadge', () => {
  test('creates badge file from coverage xml', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cov-'));
    mkdirSync(join(dir, 'coverage'));
    const xml =
      '<?xml version="1.0"?><coverage><project><metrics statements="20" coveredstatements="17"/></project></coverage>';
    writeFileSync(join(dir, 'coverage/clover.xml'), xml);
    process.chdir(dir);

    await import('../generateCoverageBadge.js');

    const svg = readFileSync(join(dir, 'coverage.svg'), 'utf8');
    expect(svg).toBe('<svg>badge</svg>');
    expect(makeBadgeMock).toHaveBeenCalledWith({
      label: 'coverage',
      message: '85%',
      color: 'green',
      style: 'for-the-badge',
    });

    rmSync(dir, { recursive: true, force: true });
  });

  test('exits with code 1 when coverage file is missing', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cov-'));
    process.chdir(dir);

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
    rmSync(dir, { recursive: true, force: true });
  });

  test('exits with code 1 when coverage xml cannot be parsed', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'cov-'));
    mkdirSync(join(dir, 'coverage'));
    writeFileSync(join(dir, 'coverage/clover.xml'), '<coverage></coverage>');
    process.chdir(dir);

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
    rmSync(dir, { recursive: true, force: true });
  });
});
