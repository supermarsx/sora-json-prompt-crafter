import { render, screen } from '@testing-library/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

// Helper render wrapper not needed as these components are simple.

describe('basic ui components render', () => {
  test('Button renders children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeDefined();
  });

  test('Alert renders title and description', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeDefined();
    expect(screen.getByText('Heads up')).toBeDefined();
    expect(screen.getByText('Something happened')).toBeDefined();
  });

  test('Toggle renders provided text', () => {
    render(<Toggle aria-label="toggle">Toggle me</Toggle>);
    expect(screen.getByText('Toggle me')).toBeDefined();
  });

  test('Input accepts placeholder', () => {
    render(<Input placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toBeDefined();
  });

  test('Textarea accepts placeholder', () => {
    render(<Textarea placeholder="notes" />);
    expect(screen.getByPlaceholderText('notes')).toBeDefined();
  });

  test('Switch renders with role', () => {
    render(<Switch aria-label="switch" />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  test('Checkbox toggles role', () => {
    render(<Checkbox aria-label="check" />);
    expect(screen.getByRole('checkbox')).toBeDefined();
  });
});
