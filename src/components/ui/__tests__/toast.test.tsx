import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, Toast, ToastViewport, ToastClose } from '../toast';

function ToastExample() {
  const [open, setOpen] = React.useState(true);
  return (
    <ToastProvider>
      <Toast open={open} onOpenChange={setOpen}>
        <div>Toast message</div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

describe('Toast component', () => {
  test('renders and dismisses', () => {
    render(<ToastExample />);

    expect(screen.getByText('Toast message')).toBeDefined();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByText('Toast message')).toBeNull();
  });
});
