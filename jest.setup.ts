Object.defineProperty(globalThis, 'import', { value: {} });
Object.defineProperty(globalThis.import, 'meta', { value: { env: {} } });
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Provide minimal fetch and Cache API stubs for tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enUs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'src/locales/en-US.json'), 'utf-8'),
);

(globalThis as any).fetch = jest.fn().mockResolvedValue({
  json: async () => enUs,
  clone: function () {
    return this;
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).caches = {
  match: jest.fn().mockResolvedValue(undefined),
  open: jest.fn().mockResolvedValue({ put: jest.fn() }),
};

// Initialize i18next for component tests
import { changeLanguageAsync } from './src/i18n';
void changeLanguageAsync('en-US');
