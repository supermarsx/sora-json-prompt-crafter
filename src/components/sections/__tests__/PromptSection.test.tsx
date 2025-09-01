import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n';
import { PromptSection } from '../PromptSection';
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions';

describe('PromptSection', () => {
  test('calls updateOptions when prompts change', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      prompt: 'initial prompt',
      negative_prompt: 'initial negative',
      use_negative_prompt: true,
    };
    render(
      <PromptSection
        options={options}
        updateOptions={updateOptions}
        trackingEnabled={false}
      />,
    );
    const promptInput = screen.getByLabelText(/^prompt$/i);
    fireEvent.change(promptInput, { target: { value: 'new prompt' } });
    expect(updateOptions).toHaveBeenCalledWith({ prompt: 'new prompt' });

    const negativeInput = screen.getByRole('textbox', {
      name: /negative prompt/i,
    });
    fireEvent.change(negativeInput, { target: { value: 'new negative' } });
    expect(updateOptions).toHaveBeenCalledWith({
      negative_prompt: 'new negative',
    });
  });

  test('negative prompt toggle enables textarea', () => {
    const updateOptions = jest.fn();
    const options = { ...DEFAULT_OPTIONS, use_negative_prompt: false };
    const { rerender } = render(
      <PromptSection
        options={options}
        updateOptions={updateOptions}
        trackingEnabled={false}
      />,
    );

    const textarea = screen.getByRole('textbox', { name: /negative prompt/i });
    expect(textarea.hasAttribute('disabled')).toBe(true);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(updateOptions).toHaveBeenCalledWith({ use_negative_prompt: true });

    rerender(
      <PromptSection
        options={{ ...options, use_negative_prompt: true }}
        updateOptions={updateOptions}
        trackingEnabled={false}
      />,
    );
    expect(
      screen.getByRole('textbox', { name: /negative prompt/i }).hasAttribute(
        'disabled',
      ),
    ).toBe(false);
  });

  test('reset button restores default prompt values', () => {
    const updateOptions = jest.fn();
    const options = {
      ...DEFAULT_OPTIONS,
      prompt: 'custom prompt',
      negative_prompt: 'custom negative',
      use_negative_prompt: false,
    };
    render(
      <PromptSection
        options={options}
        updateOptions={updateOptions}
        trackingEnabled={false}
      />,
    );
    const resetButton = screen.getByRole('button', { name: /^reset$/i });
    fireEvent.click(resetButton);
    expect(updateOptions).toHaveBeenCalledWith({
      prompt: DEFAULT_OPTIONS.prompt,
      negative_prompt: DEFAULT_OPTIONS.negative_prompt,
      use_negative_prompt: DEFAULT_OPTIONS.use_negative_prompt,
    });
  });
});
