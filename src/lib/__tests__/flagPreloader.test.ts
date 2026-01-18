describe('preloadFlags', () => {
  const originalWindow = global.window;
  const originalImage = global.Image;
  const originalFunction = global.Function;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    global.window = originalWindow;
    global.Image = originalImage;
    global.Function = originalFunction;
    jest.restoreAllMocks();
  });

  test('no-ops when window is undefined', async () => {
    global.window = undefined as unknown as Window;
    const imageMock = jest.fn(() => ({}));
    global.Image = imageMock as unknown as typeof Image;

    const { preloadFlags } = await import('../flagPreloader');
    preloadFlags();

    expect(imageMock).not.toHaveBeenCalled();
  });

  test('no-ops when glob is unavailable', async () => {
    const imageMock = jest.fn(() => ({}));
    global.Image = imageMock as unknown as typeof Image;
    global.Function = jest
      .fn()
      .mockImplementation(() => () => ({})) as unknown as FunctionConstructor;

    const { preloadFlags } = await import('../flagPreloader');
    preloadFlags();

    expect(imageMock).not.toHaveBeenCalled();
  });

  test('preloads each flag once when glob exists', async () => {
    const instances: { src?: string }[] = [];
    const imageMock = jest.fn(() => {
      const img: { src?: string } = {};
      instances.push(img);
      return img;
    });
    global.Image = imageMock as unknown as typeof Image;

    const modules = {
      '/flags/en-US.svg': '/flags/en-US.svg',
      '/flags/es-ES.svg': '/flags/es-ES.svg',
    };
    const globMock = jest.fn(() => modules);
    global.Function = jest
      .fn()
      .mockImplementation(() => () => ({ glob: globMock })) as unknown as FunctionConstructor;

    const { preloadFlags } = await import('../flagPreloader');
    preloadFlags();
    preloadFlags();

    expect(globMock).toHaveBeenCalledWith('/flags/*.svg', {
      as: 'url',
      eager: true,
    });
    expect(imageMock).toHaveBeenCalledTimes(Object.keys(modules).length);
    expect(instances.map((i) => i.src)).toEqual(Object.values(modules));
  });
});
