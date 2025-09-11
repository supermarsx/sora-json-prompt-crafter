import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PresetDropdown } from '../PresetDropdown';
import i18n from '@/i18n';

jest.mock('@/lib/storage', () => ({
  getSectionPresets: jest.fn(),
  saveSectionPreset: jest.fn(),
  removeSectionPreset: jest.fn(),
}));

const { getSectionPresets, removeSectionPreset } =
  jest.requireMock('@/lib/storage');

function openDeleteMenu() {
  fireEvent.keyDown(screen.getByRole('button', { name: i18n.t('presets') }), {
    key: 'Enter',
  });
  const trigger = screen.getByText('foo');
  fireEvent.pointerMove(trigger);
  fireEvent.keyDown(trigger, { key: 'Enter' });
  return screen.getByText(i18n.t('delete'));
}

describe('PresetDropdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (getSectionPresets as jest.Mock).mockReturnValue({
      test: [{ name: 'foo', values: {} }],
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('requires confirmation before deletion', () => {
    render(
      <PresetDropdown
        sectionKey="test"
        currentValues={{}}
        onApply={() => {}}
      />, 
    );

    const del = openDeleteMenu();
    fireEvent.click(del);
    expect(removeSectionPreset).not.toHaveBeenCalled();
    fireEvent.click(del);
    expect(removeSectionPreset).toHaveBeenCalledWith('test', 'foo');
  });

  test('confirmation resets after timeout', () => {
    render(
      <PresetDropdown
        sectionKey="test"
        currentValues={{}}
        onApply={() => {}}
      />, 
    );

    const del = openDeleteMenu();
    fireEvent.click(del);
    act(() => {
      jest.advanceTimersByTime(1600);
    });
    fireEvent.click(del);
    expect(removeSectionPreset).not.toHaveBeenCalled();
    fireEvent.click(del);
    expect(removeSectionPreset).toHaveBeenCalledWith('test', 'foo');
  });
});

