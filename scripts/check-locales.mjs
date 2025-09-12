import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function flatten(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flatten(value, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

export async function checkLocales() {
  const localesDir = path.resolve('src/locales');
  const files = (await fs.readdir(localesDir)).filter((f) => f.endsWith('.json'));
  const baseFile = 'en-US.json';
  const baseData = JSON.parse(
    await fs.readFile(path.join(localesDir, baseFile), 'utf8'),
  );
  const baseKeys = flatten(baseData).sort();
  const problems = [];

  for (const file of files) {
    if (file === baseFile) continue;
    const data = JSON.parse(
      await fs.readFile(path.join(localesDir, file), 'utf8'),
    );
    const keys = flatten(data).sort();
    const missing = baseKeys.filter((k) => !keys.includes(k));
    const extra = keys.filter((k) => !baseKeys.includes(k));
    if (missing.length || extra.length) {
      problems.push({ file, missing, extra });
    }
  }

  if (problems.length) {
    for (const { file, missing, extra } of problems) {
      console.error(`${file}:`);
      if (missing.length) console.error(`  missing: ${missing.join(', ')}`);
      if (extra.length) console.error(`  extra: ${extra.join(', ')}`);
    }
    throw new Error('Locale key mismatch');
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  checkLocales().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
