import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading', () => {
  test('renders spinner and text', async () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(await screen.findByText('Loading...')).toBeTruthy();
  });
});
