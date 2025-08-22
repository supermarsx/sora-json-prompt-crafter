Object.defineProperty(globalThis, 'import', { value: {} });
Object.defineProperty(globalThis.import, 'meta', {
  value: { env: { BASE_URL: '/' } },
});
declare global {
  var __BASE_URL__: string;
}
globalThis.__BASE_URL__ = '/';
import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

jest.mock('@testing-library/react', () => {
  const actual = jest.requireActual('@testing-library/react');
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(TooltipProvider, { delayDuration: 0 }, children);
  return {
    ...actual,
    render: (ui: React.ReactElement, options?: Parameters<typeof actual.render>[1]) =>
      actual.render(ui, { wrapper, ...options }),
  };
});

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
    ok: true,
    status: 200,
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
void (async () => {
  const { changeLanguageAsync } = await import('./src/i18n');
  await changeLanguageAsync('en-US');
})();
