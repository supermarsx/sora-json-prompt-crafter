import { ActionBar } from '@/components/ActionBar';
import ImportModal from '@/components/ImportModal';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { useDarkModeToggleVisibility } from '@/hooks/use-dark-mode-toggle-visibility';
import { useIsMobile } from '@/hooks/use-mobile';

describe('path alias resolution', () => {
  test('components import via @ alias', () => {
    expect(ActionBar).toBeDefined();
    expect(ImportModal).toBeDefined();
  });

  test('hooks import via @ alias', () => {
    expect(typeof useDarkMode).toBe('function');
    expect(typeof useDarkModeToggleVisibility).toBe('function');
    expect(typeof useIsMobile).toBe('function');
  });
});
