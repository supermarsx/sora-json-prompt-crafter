import { jest } from '@jest/globals';

const sampleXml = `<?xml version="1.0"?><coverage><project><metrics statements="20" coveredstatements="17"/></project></coverage>`;
const writeFileSyncMock = jest.fn();

jest.mock('fs', () => ({
  __esModule: true,
  readFileSync: jest.fn(() => sampleXml),
  writeFileSync: writeFileSyncMock,
}));

const makeBadgeMock = jest.fn(() => '<svg>badge</svg>');
jest.mock('badge-maker', () => ({
  __esModule: true,
  makeBadge: makeBadgeMock,
}));

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
});
