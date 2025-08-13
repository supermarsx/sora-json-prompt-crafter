import { renderHook, act } from '@testing-library/react';
import { useUpdateCheck } from '../use-update-check';

describe('useUpdateCheck', () => {
  const originalSW = navigator.serviceWorker;

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: originalSW,
    });
    jest.clearAllMocks();
  });

  it('calls update on registration', async () => {
    const update = jest.fn().mockResolvedValue(undefined);
    const getRegistration = jest.fn().mockResolvedValue({
      update,
      active: {},
    });
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistration },
    });
    const { result } = renderHook(() => useUpdateCheck());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(getRegistration).toHaveBeenCalled();
    expect(update).toHaveBeenCalled();
  });

  it('sets updateAvailable when registration has waiting worker', async () => {
    const update = jest.fn().mockResolvedValue(undefined);
    const waiting = {};
    const getRegistration = jest.fn().mockResolvedValue({
      update,
      waiting,
      active: {},
    });
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistration },
    });
    const { result } = renderHook(() => useUpdateCheck());
    expect(result.current.updateAvailable).toBe(false);
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(result.current.updateAvailable).toBe(true);
  });

  it('skips update when registration has no active worker', async () => {
    const update = jest.fn().mockResolvedValue(undefined);
    const getRegistration = jest.fn().mockResolvedValue({ update });
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistration },
    });
    const { result } = renderHook(() => useUpdateCheck());
    await act(async () => {
      await result.current.checkForUpdate();
    });
    expect(update).not.toHaveBeenCalled();
  });
});
