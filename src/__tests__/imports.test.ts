import { jest } from '@jest/globals';

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => null,
}));

import Dashboard from '@/components/Dashboard';
import { ActionBar } from '@/components/ActionBar';
import BulkFileImportModal from '@/components/BulkFileImportModal';
import { useToast, toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

describe('module imports', () => {
  test('components and hooks are defined', () => {
    expect(typeof Dashboard).toBe('function');
    expect(typeof ActionBar).toBe('function');
    expect(typeof BulkFileImportModal).toBe('function');
    expect(typeof useToast).toBe('function');
    expect(typeof toast).toBe('function');
    expect(typeof useIsMobile).toBe('function');
  });
});
