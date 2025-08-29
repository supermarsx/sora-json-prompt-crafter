import { render } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { act } from 'react';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

function setup() {
  return render(<GeneratedJson json='{"a":1}' trackingEnabled={true} />);
}

describe('GeneratedJson', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (trackEvent as jest.Mock).mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('highlights json diffs briefly', () => {
    const { rerender, container } = setup();

    act(() => {
      rerender(<GeneratedJson json='{"a":1,"b":2}' trackingEnabled={true} />);
    });

    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.JsonChanged);
    const added = container.querySelectorAll('span.animate-highlight');
    expect(added.length).toBeGreaterThan(0);
    expect(added[0].textContent).toBe(',"b":2');

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
});
