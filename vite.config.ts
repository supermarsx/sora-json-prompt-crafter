import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { execSync } from 'child_process';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import { USERSCRIPT_VERSION } from './src/version';

let commitHash = 'dev';
let commitDate = 'dev';

try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  commitDate = execSync('git show -s --date=format:%y%m%d --format=%cd')
    .toString()
    .trim();
} catch (error) {
  console.warn('Git not available, using default values for commit info');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envBase = process.env.BASE_URL;
  const base = envBase && envBase.startsWith('/') ? envBase : '/';
  return {
  server: {
    host: '::',
    port: 8080,
  },
  base,
  plugins: [
    react(),
    VitePWA({
      srcDir: 'public',
      filename: 'sw.js',
      strategies: 'injectManifest',
      injectRegister: false,
      includeManifestIcons: false,
    }),
    mode === 'development' && componentTagger(),
    {
      name: 'inject-userscript-meta',
      apply: 'build',
      writeBundle() {
        const file = path.resolve(__dirname, 'dist/sora-userscript.user.js');
        if (fs.existsSync(file)) {
          let code = fs.readFileSync(file, 'utf8');
          code = code
            .replace(/__USERSCRIPT_VERSION__/g, USERSCRIPT_VERSION)
            .replace(
              /const DEBUG = false;/,
              `const DEBUG = ${mode === 'development' ? 'true' : 'false'};`,
            );
          fs.writeFileSync(file, code);
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_COMMIT_DATE': JSON.stringify(commitDate),
    __BASE_URL__: JSON.stringify(base),
  },
  };
});
