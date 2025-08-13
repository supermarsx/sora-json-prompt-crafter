import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src/locales');
const destDir = path.resolve('public/locales');

fs.mkdirSync(destDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  if (file.endsWith('.json')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
  }
}
