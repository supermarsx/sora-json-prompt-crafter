import { render } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import { act } from 'react';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

function setup(containerHeight = 100, scrollHeight = 200) {
  const utils = render(<GeneratedJson json='{"a":1}' trackingEnabled={true} />);
  const container = utils.container.querySelector(
    '[data-testid="json-container"]',
  ) as HTMLDivElement;
  Object.defineProperty(container, 'clientHeight', {
    configurable: true,
    value: containerHeight,
  });
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
  const outer = utils.container.querySelector(
    '[data-testid="json-outer"]',
  ) as HTMLDivElement;
  Object.defineProperty(outer, 'clientHeight', {
    configurable: true,
    value: containerHeight,
  });
  Object.defineProperty(outer, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  outer.scrollTop = scrollHeight - containerHeight;
  return { ...utils, outer };
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

  test('highlights json diffs briefly and scrolls when at bottom', () => {
    const { outer, rerender, container } = setup();

    Object.defineProperty(outer, 'scrollHeight', {
      configurable: true,
      value: 202,
    });

    act(() => {
      rerender(<GeneratedJson json='{"a":1,"b":2}' trackingEnabled={true} />);
    });

    const updatedOuter = container.querySelector(
      '[data-testid="json-outer"]',
    ) as HTMLDivElement;

    expect(trackEvent).toHaveBeenCalledWith(true, AnalyticsEvent.JsonChanged);
    expect(updatedOuter.scrollTop).toBe(
      updatedOuter.scrollHeight - updatedOuter.clientHeight,
    );
    const added = updatedOuter.querySelectorAll('span.animate-highlight');
    expect(added.length).toBeGreaterThan(0);
    expect(added[0].textContent).toBe(',"b":2');
    const token = updatedOuter.querySelector('[style]');
    expect(token).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });
});
