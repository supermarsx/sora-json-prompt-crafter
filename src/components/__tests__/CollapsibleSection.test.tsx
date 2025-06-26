import { render, screen, fireEvent } from '@testing-library/react'
import { CollapsibleSection } from '../CollapsibleSection'

describe('CollapsibleSection', () => {
  test('clicking header toggles visibility', () => {
    render(
      <CollapsibleSection title="Test Section">
        <div>content</div>
      </CollapsibleSection>
    )

    expect(screen.getByText('content')).toBeTruthy()

    fireEvent.click(screen.getByText('Test Section'))
    expect(screen.queryByText('content')).toBeNull()

    fireEvent.click(screen.getByText('Test Section'))
    expect(screen.getByText('content')).toBeTruthy()
  })

  test('checkbox invokes onToggle', () => {
    const onToggle = jest.fn()
    render(
      <CollapsibleSection
        title="Optional"
        isOptional
        isEnabled={false}
        onToggle={onToggle}
      >
        <div>content</div>
      </CollapsibleSection>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox.getAttribute('data-state')).toBe('unchecked')
    fireEvent.click(checkbox)
    expect(onToggle).toHaveBeenCalledWith(true)
  })
})
