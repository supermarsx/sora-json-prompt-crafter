import { render } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';
import { trackEvent } from '@/lib/analytics';
import { act } from 'react';

jest.mock('@/lib/analytics', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
}));

function setup(containerHeight = 100, scrollHeight = 200) {
  const utils = render(<GeneratedJson json='{"a":1}' trackingEnabled={true} />);
  const div = utils.container.firstChild as HTMLDivElement;
  Object.defineProperty(div, 'clientHeight', {
    configurable: true,
    value: containerHeight,
  });
  Object.defineProperty(div, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  div.scrollTop = scrollHeight - containerHeight;
  return { ...utils, div };
}

describe('GeneratedJson', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (trackEvent as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('highlights json diffs briefly and scrolls when at bottom', () => {
    const { div, rerender } = setup();

    Object.defineProperty(div, 'scrollHeight', {
      configurable: true,
      value: 202,
    });

    act(() => {
      rerender(<GeneratedJson json='{"a":1,"b":2}' trackingEnabled={true} />);
    });

    expect(trackEvent).toHaveBeenCalledWith(true, 'json_changed');
    expect(div.scrollTop).toBe(202);
    const added = div.querySelectorAll('span.animate-highlight');
    expect(added.length).toBeGreaterThan(0);
    expect(added[0].textContent).toBe(',"b":2');
    const token = div.querySelector('pre span span');
    expect(token).toBeTruthy();
    expect(token?.getAttribute('style')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(div.querySelectorAll('span.animate-highlight').length).toBe(0);
  });
});
