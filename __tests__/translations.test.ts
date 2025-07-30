import fs from 'fs';
import path from 'path';

describe('locale completeness', () => {
  const localesDir = path.resolve(__dirname, '../src/locales');
  const referencePath = path.join(localesDir, 'en-US.json');
  const reference = JSON.parse(fs.readFileSync(referencePath, 'utf-8')) as Record<string, unknown>;
  const referenceKeys = Object.keys(reference);

  test('all locale files contain every key from en-US.json', () => {
    const reports: string[] = [];
    const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      if (file === 'en-US.json') continue;
      const localeData = JSON.parse(
        fs.readFileSync(path.join(localesDir, file), 'utf-8'),
      ) as Record<string, unknown>;
      const missing = referenceKeys.filter((key) => !(key in localeData));
      if (missing.length > 0) {
        reports.push(`${file}: ${missing.join(', ')}`);
      }
    }
    if (reports.length > 0) {
      fail(`Missing translation keys:\n${reports.join('\n')}`);
    }
  });
});
