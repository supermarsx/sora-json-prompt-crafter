import { render, act } from '@testing-library/react';
import Dashboard from '../Dashboard';

let updater: (path: string, value: unknown) => void = () => {};

jest.mock('../HistoryPanel', () => ({ __esModule: true, default: () => null }));
jest.mock('../ShareModal', () => ({
  __esModule: true,
  ShareModal: () => null,
}));
jest.mock('../ImportModal', () => ({ __esModule: true, default: () => null }));
jest.mock('../Footer', () => ({ __esModule: true, default: () => null }));
jest.mock('../DisclaimerModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../ProgressBar', () => ({
  __esModule: true,
  ProgressBar: () => null,
  default: () => null,
}));

jest.mock('../ControlPanel', () => ({
  __esModule: true,
  ControlPanel: ({
    updateNestedOptions,
  }: {
    updateNestedOptions: (path: string, value: unknown) => void;
  }) => {
    updater = updateNestedOptions;
    return null;
  },
}));

jest.mock('@/hooks/use-single-column', () => ({
  __esModule: true,
  useIsSingleColumn: jest.fn(() => false),
}));
jest.mock('@/hooks/use-dark-mode', () => ({
  __esModule: true,
  useDarkMode: jest.fn(() => [false, jest.fn()] as const),
}));
jest.mock('@/hooks/use-tracking', () => ({
  __esModule: true,
  useTracking: jest.fn(() => [true, jest.fn()] as const),
}));
jest.mock('@/hooks/use-action-history', () => ({
  __esModule: true,
  useActionHistory: jest.fn(() => []),
}));
jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));
jest.mock('@/components/ui/sonner-toast', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve({}),
  }) as unknown as typeof fetch;
  window.matchMedia = jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }) as unknown as typeof window.matchMedia;
});

test('updateNestedOptions handles missing objects', async () => {
  localStorage.setItem('currentJson', '{"style_preset":"bad"}');
  render(<Dashboard />);
  await act(async () => {
    updater('style_preset.category', 'cinematic');
    await Promise.resolve();
  });
});

test('updateNestedOptions warns and skips __proto__ or constructor keys', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  render(<Dashboard />);
  const before = localStorage.getItem('currentJson');
  await act(async () => {
    updater('__proto__.foo', 'bar');
    await Promise.resolve();
  });
  expect(localStorage.getItem('currentJson')).toBe(before);
  expect(warnSpy).toHaveBeenCalledWith(
    'Blocked unsafe property name: __proto__',
  );
  warnSpy.mockClear();
  await act(async () => {
    updater('constructor.foo', 'bar');
    await Promise.resolve();
  });
  expect(localStorage.getItem('currentJson')).toBe(before);
  expect(warnSpy).toHaveBeenCalledWith(
    'Blocked unsafe property name: constructor',
  );
  warnSpy.mockRestore();
});
