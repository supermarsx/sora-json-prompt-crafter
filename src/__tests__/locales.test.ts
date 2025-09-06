import fs from 'fs';
import path from 'path';

describe('locale key parity', () => {
  const localesDir = path.join(__dirname, '..', 'locales');
  const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
  const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf-8'));

  const flatten = (obj: any, prefix = ''): Record<string, true> => {
    const out: Record<string, true> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(out, flatten(value, newKey));
      } else {
        out[newKey] = true;
      }
    }
    return out;
  };

  const baseKeys = flatten(enUS);

  for (const file of files.filter((f) => f !== 'en-US.json')) {
    test(`${file} matches en-US keys`, () => {
      const data = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf-8'));
      const keys = flatten(data);
      for (const key of Object.keys(baseKeys)) {
        expect(keys[key]).toBe(true);
      }
    });
  }
});
