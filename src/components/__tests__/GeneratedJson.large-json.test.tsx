import { render } from '@testing-library/react';
import GeneratedJson from '../GeneratedJson';

function createLargeJson(lines = 1000) {
  const body = Array.from({ length: lines }, (_, i) => `"k${i}":${i}`).join(',');
  return `{${body}}`;
}

describe('GeneratedJson large JSON rendering', () => {
  test('renders entire output', () => {
    const json = createLargeJson(1000);
    const { container } = render(
      <GeneratedJson json={json} trackingEnabled={false} />,
    );
    const content = container.textContent ?? '';
    expect(content.includes('"k999":999')).toBe(true);
  });
});

