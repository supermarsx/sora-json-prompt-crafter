import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const enPath = 'src/locales/en-US.json';
const enData = JSON.parse(readFileSync(enPath, 'utf8'));
const enKeys = Object.keys(enData);

for (const file of globSync('src/locales/*.json')) {
  if (file === enPath) continue;
  const data = JSON.parse(readFileSync(file, 'utf8'));
  let changed = false;
  for (const key of enKeys) {
    if (!(key in data)) {
      data[key] = enData[key];
      changed = true;
    }
  }
  if (changed) {
    const ordered = Object.fromEntries(enKeys.map((k) => [k, data[k]]));
    writeFileSync(file, JSON.stringify(ordered, null, 2) + '\n');
    console.log(`Updated ${file}`);
  }
}
