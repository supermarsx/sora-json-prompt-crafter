import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { execSync } from 'child_process';

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
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.VITE_COMMIT_DATE': JSON.stringify(commitDate),
  },
}));
