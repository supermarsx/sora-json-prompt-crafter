import { render } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  test('centers progress bar and applies text-center to wrapper', () => {
    const { getByRole } = render(<Loading />);
    const wrapper = getByRole('status');
    const progress = getByRole('progressbar');

    expect(wrapper.classList.contains('text-center')).toBe(true);
    expect(progress.classList.contains('mx-auto')).toBe(true);
  });
});
