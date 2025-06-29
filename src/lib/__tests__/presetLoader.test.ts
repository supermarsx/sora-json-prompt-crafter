let importCustomPresets: typeof import('../presetLoader').importCustomPresets;
let loadCustomPresetsFromUrl: typeof import('../presetLoader').loadCustomPresetsFromUrl;

beforeEach(async () => {
  jest.resetModules();
  ({ importCustomPresets, loadCustomPresetsFromUrl } = await import(
    '../presetLoader'
  ));
});

describe('importCustomPresets', () => {
  test('merges presets without duplicates', async () => {
    const { stylePresets } = await import('../../data/stylePresets');
    const cam = await import('../../data/cameraPresets');
    const loc = await import('../../data/locationPresets');

    const origStyleLen = stylePresets['Classic Art & Painting'].length;
    const origShotLen = cam.shotTypeOptions.length;
    const origEnvLen = loc.environmentOptions.length;

    importCustomPresets({
      stylePresets: {
        'Classic Art & Painting': ['oil painting', 'new style'],
        Extra: ['unique'],
      },
      cameraPresets: { shotTypeOptions: ['wide', 'unique shot'] },
      locationPresets: { environmentOptions: ['forest', 'space'] },
    });

    expect(stylePresets['Classic Art & Painting']).toContain('new style');
    expect(stylePresets['Classic Art & Painting']).toHaveLength(
      origStyleLen + 1,
    );
    expect(stylePresets.Extra).toEqual(['unique']);

    expect(cam.shotTypeOptions).toContain('unique shot');
    expect(cam.shotTypeOptions).toHaveLength(origShotLen + 1);

    expect(loc.environmentOptions).toContain('space');
    expect(loc.environmentOptions).toHaveLength(origEnvLen + 1);
  });
});

describe('loadCustomPresetsFromUrl', () => {
  test('loads presets from URL', async () => {
    const data = { stylePresets: { Foo: ['bar'] } };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(data),
    }) as unknown as typeof fetch;

    const { stylePresets } = await import('../../data/stylePresets');

    await loadCustomPresetsFromUrl('http://example.com');

    expect(fetch).toHaveBeenCalledWith('http://example.com');
    expect(stylePresets.Foo).toEqual(['bar']);
  });

  test('rejects when fetch fails', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network')) as unknown as typeof fetch;

    await expect(loadCustomPresetsFromUrl('bad')).rejects.toThrow('network');
  });
});
