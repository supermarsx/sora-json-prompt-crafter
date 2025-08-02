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
    const getRegistration = jest.fn().mockResolvedValue({ update });
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistration },
    });
    const { result } = renderHook(() => useUpdateCheck());
    await act(async () => {
      await result.current();
    });
    expect(getRegistration).toHaveBeenCalled();
    expect(update).toHaveBeenCalled();
  });
});
