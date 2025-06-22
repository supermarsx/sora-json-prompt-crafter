import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('boom')
  }
  return <div>child content</div>
}

describe('ErrorBoundary', () => {
  test('shows fallback and resets on Try Again', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeTruthy()

    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    )

    const button = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(button)

    expect(screen.queryByText(/something went wrong/i)).toBeNull()
    expect(screen.getByText('child content')).toBeTruthy()
  })
})
