import { reducer } from '../use-toast'

const baseToast = {
  id: '1',
  title: 'Hello',
  description: 'World',
  open: true,
}

describe('use-toast reducer', () => {
  test('ADD_TOAST adds a toast', () => {
    const state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: baseToast })
    expect(state.toasts).toEqual([baseToast])
  })

  test('UPDATE_TOAST updates an existing toast', () => {
    const state = reducer(
      { toasts: [baseToast] },
      { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' } }
    )
    expect(state.toasts[0].title).toBe('Updated')
  })

  test('DISMISS_TOAST closes toast and REMOVE_TOAST removes it', () => {
    let state = { toasts: [baseToast] }
    state = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' })
    expect(state.toasts[0].open).toBe(false)
    state = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' })
    expect(state.toasts).toHaveLength(0)
  })
})
