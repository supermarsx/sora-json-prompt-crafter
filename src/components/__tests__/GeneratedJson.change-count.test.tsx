import { render, act } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';
import { trackEvent, AnalyticsEvent } from '@/lib/analytics';
import {
  JSON_CHANGE_COUNT,
  JSON_CHANGE_MILESTONES,
} from '@/lib/storage-keys';

jest.mock('@/lib/analytics', () => {
  const actual = jest.requireActual('@/lib/analytics');
  return { __esModule: true, ...actual, trackEvent: jest.fn() };
});

describe('GeneratedJson change counter', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    (trackEvent as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function renderComponent(json: string) {
    return render(<GeneratedJson json={json} trackingEnabled={true} />);
  }

  test('persists change count across renders', () => {
    localStorage.setItem(JSON_CHANGE_COUNT, '5');
    localStorage.setItem(JSON_CHANGE_MILESTONES, '[]');
    const { rerender, unmount } = renderComponent('{}');
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_COUNT) || '0'),
    ).toBe(6);

    act(() => {
      rerender(<GeneratedJson json='{"a":1}' trackingEnabled={true} />);
    });
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_COUNT) || '0'),
    ).toBe(7);

    unmount();

    const { rerender: rerender2 } = renderComponent('{"a":1}');
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_COUNT) || '0'),
    ).toBe(8);
    act(() => {
      rerender2(<GeneratedJson json='{"a":2}' trackingEnabled={true} />);
    });
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_COUNT) || '0'),
    ).toBe(9);
  });

  test('emits milestone events once', () => {
    localStorage.setItem(JSON_CHANGE_COUNT, '249');
    localStorage.setItem(JSON_CHANGE_MILESTONES, '[]');
    const { rerender } = renderComponent('{}');

    act(() => {
      rerender(<GeneratedJson json='{"a":1}' trackingEnabled={true} />);
    });

    let calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.JsonChanged250,
    );
    expect(calls.length).toBe(1);
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_MILESTONES) || '[]'),
    ).toEqual([250]);

    (trackEvent as jest.Mock).mockClear();

    act(() => {
      rerender(<GeneratedJson json='{"a":2}' trackingEnabled={true} />);
    });

    calls = (trackEvent as jest.Mock).mock.calls.filter(
      (c) => c[1] === AnalyticsEvent.JsonChanged250,
    );
    expect(calls.length).toBe(0);
    expect(
      JSON.parse(localStorage.getItem(JSON_CHANGE_MILESTONES) || '[]'),
    ).toEqual([250]);
  });
});

