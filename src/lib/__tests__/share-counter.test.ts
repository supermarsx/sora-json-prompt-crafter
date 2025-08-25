jest.mock('../storage', () => ({
  safeGet: jest.fn(),
  safeSet: jest.fn(),
}));

jest.mock('../analytics', () => {
  const actual = jest.requireActual('../analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

jest.mock('@/components/ui/sonner-toast', () => ({
  toast: { success: jest.fn() },
}));

jest.mock('@/i18n', () => ({
  __esModule: true,
  default: { t: jest.fn() },
}));

import { trackShare } from '../share-counter';
import { AnalyticsEvent } from '../analytics';
import { SHARE_COUNT, SHARE_MILESTONES } from '../storage-keys';
import { trackEvent } from '../analytics';
import { safeGet, safeSet } from '../storage';
import { toast } from '@/components/ui/sonner-toast';
import i18n from '@/i18n';

describe('trackShare', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('increments share count and persists', () => {
    (safeGet as jest.Mock).mockImplementation((key: string) => {
      if (key === SHARE_COUNT) return 0;
      if (key === SHARE_MILESTONES) return [];
    });

    trackShare(true, AnalyticsEvent.ShareButton);

    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareButton);
    expect(safeSet).toHaveBeenNthCalledWith(1, SHARE_COUNT, 1, true);
    expect(safeSet).toHaveBeenNthCalledWith(2, SHARE_MILESTONES, [], true);
  });

  test('triggers milestone events when threshold reached', () => {
    (safeGet as jest.Mock).mockImplementation((key: string) => {
      if (key === SHARE_COUNT) return 4;
      if (key === SHARE_MILESTONES) return [];
    });

    trackShare(true, AnalyticsEvent.ShareButton);

    expect(trackEvent).toHaveBeenNthCalledWith(
      1,
      true,
      AnalyticsEvent.ShareButton,
    );
    expect(trackEvent).toHaveBeenNthCalledWith(2, true, AnalyticsEvent.Share5);
    expect(toast.success).toHaveBeenCalled();
    expect(i18n.t).toHaveBeenCalledWith('milestoneReached', { threshold: 5 });
    expect(safeSet).toHaveBeenNthCalledWith(1, SHARE_COUNT, 5, true);
    expect(safeSet).toHaveBeenNthCalledWith(2, SHARE_MILESTONES, [5], true);
  });

  test('logs error when storage fails', () => {
    (safeGet as jest.Mock).mockImplementation(() => {
      throw new Error('fail');
    });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    trackShare(true, AnalyticsEvent.ShareButton);

    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.ShareButton);
    expect(errorSpy).toHaveBeenCalledWith(
      'Share counter: There was an error.',
    );
    expect(safeSet).not.toHaveBeenCalled();
  });
});

