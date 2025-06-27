import { readFileSync, writeFileSync } from 'fs';
import { makeBadge } from 'badge-maker';

const xmlPath = 'coverage/clover.xml';
let xml;
try {
  xml = readFileSync(xmlPath, 'utf8');
} catch {
  console.error('Coverage file not found:', xmlPath);
  process.exit(1);
}
const match = xml.match(
  /<metrics[^>]*statements="(\d+)"[^>]*coveredstatements="(\d+)"/,
);
if (!match) {
  console.error('Unable to parse coverage metrics');
  process.exit(1);
}
const statements = Number(match[1]);
const covered = Number(match[2]);
const percentage = statements === 0 ? 0 : (covered / statements) * 100;
const pct = percentage.toFixed(2).replace(/\.00$/, '');
const color =
  percentage >= 90
    ? 'brightgreen'
    : percentage >= 80
      ? 'green'
      : percentage >= 60
        ? 'yellow'
        : 'red';
const svg = makeBadge({
  label: 'coverage',
  message: `${pct}%`,
  color,
  style: 'for-the-badge',
});
writeFileSync('coverage.svg', svg);
console.log(`Coverage badge generated: ${pct}%`);
