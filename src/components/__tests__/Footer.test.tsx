import { render, screen, fireEvent } from '@testing-library/react';
import type React from 'react';
import i18n from '@/i18n';
import fs from 'fs';
import ts from 'typescript';

interface GlobalVariables {
  __COMMIT_HASH__?: string;
  __COMMIT_DATE__?: string;
}

function loadFooter() {
  const tsCode = fs.readFileSync(require.resolve('../Footer.tsx'), 'utf8');
  const replaced = tsCode
    .replace(/import.meta.env.VITE_COMMIT_HASH/g, 'globalThis.__COMMIT_HASH__')
    .replace(/import.meta.env.VITE_COMMIT_DATE/g, 'globalThis.__COMMIT_DATE__');
  const js = ts.transpileModule(replaced, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: 'react-jsx' },
  }).outputText;
  const module: {
    exports: { default?: React.FC<{ onShowDisclaimer: () => void }> };
  } = {
    exports: {},
  };
  const fn = new Function('require', 'module', 'exports', js);
  fn(require, module, module.exports);
  return module.exports.default as React.FC<{ onShowDisclaimer: () => void }>;
}

let Footer: React.FC<{ onShowDisclaimer: () => void }>;

describe('Footer', () => {
  beforeEach(() => {
    (globalThis as GlobalVariables).__COMMIT_HASH__ = 'abcd123';
    (globalThis as GlobalVariables).__COMMIT_DATE__ = '2024-06-01';
    Footer = loadFooter();
  });

  afterEach(() => {
    delete (globalThis as GlobalVariables).__COMMIT_HASH__;
    delete (globalThis as GlobalVariables).__COMMIT_DATE__;
  });

  test('renders commit hash and date', () => {
    render(<Footer onShowDisclaimer={() => {}} />);
    expect(
      screen.getByText(
        i18n.t('versionInfo', { commit: 'abcd123', date: '2024-06-01' }),
      ),
    ).toBeTruthy();
  });

  test('calls onShowDisclaimer when Disclaimer clicked', () => {
    const onShowDisclaimer = jest.fn();
    render(<Footer onShowDisclaimer={onShowDisclaimer} />);
    const button = screen.getByRole('button', { name: i18n.t('disclaimer') });
    expect(button.getAttribute('title')).toBe(i18n.t('disclaimer'));
    fireEvent.click(button);
    expect(onShowDisclaimer).toHaveBeenCalledTimes(1);
  });
});
