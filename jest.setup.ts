Object.defineProperty(globalThis, 'import', { value: {} });
Object.defineProperty(globalThis.import, 'meta', { value: { env: {} } });
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Provide minimal fetch and Cache API stubs for tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).fetch = jest.fn((url: string) => {
  const match = url.match(/\/locales\/(.*)\.json$/);
  const locale = match ? match[1] : 'en-US';
  const file = path.resolve(__dirname, `src/locales/${locale}.json`);
  if (!fs.existsSync(file)) {
    return Promise.reject(new Error('Not Found'));
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return Promise.resolve({
    json: async () => data,
    clone: function () {
      return this;
    },
  });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).caches = {
  match: jest.fn().mockResolvedValue(undefined),
  open: jest.fn().mockResolvedValue({ put: jest.fn() }),
};

// Initialize i18next for component tests
import { changeLanguageAsync } from './src/i18n';
void changeLanguageAsync('en-US');
