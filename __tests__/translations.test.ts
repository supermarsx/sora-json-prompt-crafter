import fs from 'fs';
import path from 'path';

describe('locale completeness', () => {
  const localesDir = path.resolve(__dirname, '../src/locales');
  const referencePath = path.join(localesDir, 'en-US.json');
  const reference = JSON.parse(
    fs.readFileSync(referencePath, 'utf-8'),
  ) as Record<string, unknown>;

  test('all locale files contain every top-level key from en-US.json', () => {
    const referenceKeys = Object.keys(reference);
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
      throw new Error(`Missing translation keys:\n${reports.join('\n')}`);
    }
  });

  test('all locale files contain DnD option translations', () => {
    const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] =>
      Object.entries(obj).flatMap(([key, value]) => {
        const pathKey = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return [pathKey, ...getKeys(value as Record<string, unknown>, pathKey)];
        }
        return [pathKey];
      });

    const referenceDnd = reference.dndOptions as Record<string, unknown>;
    const referenceKeys = getKeys(referenceDnd, 'dndOptions');
    const reports: string[] = [];
    const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      if (file === 'en-US.json') continue;
      const localeData = JSON.parse(
        fs.readFileSync(path.join(localesDir, file), 'utf-8'),
      ) as Record<string, unknown>;
      const localeDnd = localeData.dndOptions as Record<string, unknown>;
      const localeKeys = getKeys(localeDnd, 'dndOptions');
      const missing = referenceKeys.filter((key) => !localeKeys.includes(key));
      if (missing.length > 0) {
        reports.push(`${file}: ${missing.join(', ')}`);
      }
    }
    if (reports.length > 0) {
      throw new Error(`Missing DnD translation keys:\n${reports.join('\n')}`);
    }
  });
});

