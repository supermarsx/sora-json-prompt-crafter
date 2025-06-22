import { render } from '@testing-library/react'
import { jest } from '@jest/globals'
import NotFound from '@/pages/NotFound'

// Mock useLocation from react-router-dom to return a specific path
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/missing-page' }),
  Navigate: () => null
}))

describe('NotFound page', () => {
  test('logs error with the attempted path', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(<NotFound />)

    expect(errorSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/missing-page'
    )

    errorSpy.mockRestore()
  })
})
