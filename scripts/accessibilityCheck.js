import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const htmlPath = 'dist/index.html';
let html;
try {
  html = readFileSync(htmlPath, 'utf8');
} catch {
  console.error('Build output not found:', htmlPath);
  process.exit(1);
}
const dom = new JSDOM(html);
global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
import('axe-core').then(({ default: axe }) => {
  axe.run(global.document, {}, (err, results) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (results.violations.length) {
      console.log('Accessibility violations found:', results.violations.length);
      results.violations.forEach((v) => {
        console.log(`- ${v.id}: ${v.help}`);
      });
      process.exitCode = 1;
    } else {
      console.log('No accessibility violations found.');
    }
  });
});
