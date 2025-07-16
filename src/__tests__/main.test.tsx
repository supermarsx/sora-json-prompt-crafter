import { jest } from '@jest/globals';

const mockRender = jest.fn();
const createRootMock = jest.fn(() => ({ render: mockRender }));

jest.mock('react-dom/client', () => ({
  __esModule: true,
  createRoot: createRootMock,
}));

jest.mock('../index.css', () => '');

import App from '../App';

describe('main entry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    jest.resetModules();
    createRootMock.mockClear();
    mockRender.mockClear();
  });

  test('mounts App to root element', async () => {
    await import('../main');
    expect(createRootMock).toHaveBeenCalledWith(
      document.getElementById('root'),
    );
    expect(mockRender).toHaveBeenCalledTimes(1);
    const [[element]] = mockRender.mock.calls;
    expect(typeof element.type).toBe('function');
    expect(element.type.name).toBe('App');
  });
});
