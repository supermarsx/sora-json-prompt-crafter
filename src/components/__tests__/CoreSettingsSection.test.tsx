import { render, screen, fireEvent } from '@testing-library/react'
import { CoreSettingsSection } from '../sections/CoreSettingsSection'
import { DEFAULT_OPTIONS } from '@/lib/defaultOptions'

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('CoreSettingsSection', () => {
  test('calls updateOptions when seed changes', () => {
    const updateOptions = jest.fn()
    render(
      <CoreSettingsSection
        options={DEFAULT_OPTIONS}
        updateOptions={updateOptions}
        isEnabled={true}
        onToggle={() => {}}
      />
    )
    const seedInput = screen.getByLabelText(/seed/i)
    fireEvent.change(seedInput, { target: { value: '42' } })
    expect(updateOptions).toHaveBeenCalledWith({ seed: 42 })
  })

  test('respects isEnabled prop', () => {
    const updateOptions = jest.fn()
    const onToggle = jest.fn()
    const { container } = render(
      <CoreSettingsSection
        options={DEFAULT_OPTIONS}
        updateOptions={updateOptions}
        isEnabled={false}
        onToggle={onToggle}
      />
    )
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.getAttribute('data-state')).toBe('unchecked')
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledWith(true)
    expect(container.querySelector('.opacity-50.pointer-events-none')).toBeTruthy()
  })
})
