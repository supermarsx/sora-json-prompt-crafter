import { DARK_MODE } from './lib/storage-keys';

try {
  const val = localStorage.getItem(DARK_MODE);
  if (val === null || val === 'true') {
    document.documentElement.classList.add('dark');
  }
} catch {
  document.documentElement.classList.add('dark');
}
