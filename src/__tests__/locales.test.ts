import { execFile } from 'node:child_process';
import path from 'node:path';

describe('locale key parity', () => {
  test('all locale files match en-US keys', (done) => {
    execFile(
      'node',
      ['scripts/check-locales.mjs'],
      { cwd: path.resolve(__dirname, '..', '..') },
      (error) => {
        done(error ?? undefined);
      },
    );
  });
});
