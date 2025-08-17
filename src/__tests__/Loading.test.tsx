import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading', () => {
  test('renders spinner', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
