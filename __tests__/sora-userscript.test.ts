import { jest } from '@jest/globals';

const USERSCRIPT_PATH = '../public/sora-userscript.user.js';

describe('sora-userscript', () => {
  const originalPostMessage = window.postMessage;
  let mockPostMessage: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    mockPostMessage = jest.fn();
    Object.defineProperty(window, 'postMessage', {
      value: mockPostMessage,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    Object.defineProperty(window, 'postMessage', {
      value: originalPostMessage,
      writable: true,
    });
    Object.defineProperty(window, 'opener', { value: null, writable: true });
  });

  test('notifyReady posts readiness and debug ping', async () => {
    document.head.innerHTML = '<meta name="sora-json-prompt-crafter" />';

    await import(USERSCRIPT_PATH);

    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'SORA_USERSCRIPT_READY', version: expect.any(String) },
      '*',
    );
    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'SORA_DEBUG_PING' },
      '*',
    );
  });

  test('fills textarea on INSERT_SORA_JSON and acknowledges', async () => {
    document.head.innerHTML = '<meta property="og:title" content="Sora">';
    const opener = { postMessage: jest.fn() } as unknown as WindowProxy;
    Object.defineProperty(window, 'opener', { value: opener, writable: true });

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    await import(USERSCRIPT_PATH);

    const source = { postMessage: jest.fn() } as MessageEventSource;
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'INSERT_SORA_JSON', json: { foo: 'bar' } },
        origin: 'https://crafter.local',
        source,
      }),
    );

    expect(textarea.value).toBe(JSON.stringify({ foo: 'bar' }, null, 2));
    expect(source.postMessage).toHaveBeenCalledWith(
      { type: 'INSERT_SORA_JSON_ACK' },
      '*',
    );
  });

  test('logs and exits on unrelated pages', async () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    await import(USERSCRIPT_PATH);

    expect(debugSpy).toHaveBeenCalledWith(
      `[Sora Injector] Not a Sora or Crafter page on host ${window.location.hostname}, exiting`,
    );
    debugSpy.mockRestore();
  });

  test('reapplies JSON on focus if cleared', async () => {
    document.head.innerHTML = '<meta property="og:title" content="Sora">';

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    await import(USERSCRIPT_PATH);

    const source = { postMessage: jest.fn() } as MessageEventSource;
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'INSERT_SORA_JSON', json: { foo: 'bar' } },
        origin: 'https://crafter.local',
        source,
      }),
    );

    expect(textarea.value).toBe(JSON.stringify({ foo: 'bar' }, null, 2));

    textarea.value = '';
    textarea.dispatchEvent(new Event('focus'));
    textarea.dispatchEvent(new Event('blur'));

    expect(textarea.value).toBe(JSON.stringify({ foo: 'bar' }, null, 2));
  });

  test('stops notify interval on ACK from opener', async () => {
    document.head.innerHTML = '<meta name="sora-json-prompt-crafter" />';
    const opener = { postMessage: jest.fn() } as unknown as WindowProxy;
    Object.defineProperty(window, 'opener', { value: opener, writable: true });
    const clearSpy = jest.spyOn(global, 'clearInterval');

    await import(USERSCRIPT_PATH);

    expect(mockPostMessage).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(250);
    expect(mockPostMessage).toHaveBeenCalledTimes(4);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'SORA_USERSCRIPT_ACK' },
        origin: 'https://sora.local',
        source: opener,
      }),
    );

    expect(clearSpy).toHaveBeenCalled();

    jest.advanceTimersByTime(250);
    expect(mockPostMessage).toHaveBeenCalledTimes(4);

    clearSpy.mockRestore();
  });

  test('logs debug pong message', async () => {
    document.head.innerHTML = '<meta name="sora-json-prompt-crafter" />';
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});

    await import(USERSCRIPT_PATH);
    debugSpy.mockClear();

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'SORA_DEBUG_PONG' },
        origin: 'https://crafter.local',
      }),
    );

    expect(debugSpy).toHaveBeenCalledWith(
      '[Sora Injector] Debug pong received',
    );
  });
});
