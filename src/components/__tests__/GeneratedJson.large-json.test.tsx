import { render, act } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';

function createLargeJson(lines = 1000) {
  const body = Array.from({ length: lines }, (_, i) => `"k${i}":${i}`).join(',');
  return `{${body}}`;
}

describe('GeneratedJson large JSON rendering', () => {
  test('virtualizes large output', () => {
    const json = createLargeJson(1000);
    const { container } = render(
      <GeneratedJson json={json} trackingEnabled={false} />,
    );
    const wrapper = container.querySelector(
      '[data-testid="json-container"]',
    ) as HTMLDivElement;
    Object.defineProperty(wrapper, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    const rows = container.querySelectorAll('[data-testid="json-row"]');
    expect(rows.length).toBeLessThan(200);
  });
});

