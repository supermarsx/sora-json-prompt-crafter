import { render, screen, fireEvent } from '@testing-library/react'
import { PromptSection } from '../PromptSection'
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions'

describe('PromptSection', () => {
  test('calls updateOptions when prompts change', () => {
    const updateOptions = jest.fn()
    const options = {
      ...DEFAULT_OPTIONS,
      prompt: 'initial prompt',
      negative_prompt: 'initial negative',
      use_negative_prompt: true,
    }
    render(
      <PromptSection
        options={options}
        updateOptions={updateOptions}
        trackingEnabled={false}
      />
    )
    const promptInput = screen.getByLabelText(/^prompt$/i)
    fireEvent.change(promptInput, { target: { value: 'new prompt' } })
    expect(updateOptions).toHaveBeenCalledWith({ prompt: 'new prompt' })

    const negativeInput = screen.getByLabelText(/^negative prompt$/i)
    fireEvent.change(negativeInput, { target: { value: 'new negative' } })
    expect(updateOptions).toHaveBeenCalledWith({ negative_prompt: 'new negative' })
  })
})
