import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'
import DisclaimerModal from '../DisclaimerModal'

describe('DisclaimerModal', () => {
  const originalFetch = global.fetch
  let warnSpy: jest.SpyInstance
  beforeEach(() => {
    jest.restoreAllMocks()
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    global.fetch = originalFetch
    warnSpy.mockRestore()
  })

  test('renders fetched text on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('loaded text'),
    } as Response)

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />)

    expect(await screen.findByText('loaded text')).toBeDefined()
  })

  test('renders fallback text on fetch failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('fail'))

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />)

    expect(
      await screen.findByText('Failed to load disclaimer.')
    ).toBeDefined()
  })

  test('renders fallback text when response not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('loaded text'),
    } as Response)

    render(<DisclaimerModal open={true} onOpenChange={() => {}} />)

    expect(
      await screen.findByText('Failed to load disclaimer.')
    ).toBeDefined()
  })
})
