let presetLoaderModule: typeof import('../presetLoader');
let importCustomPresets: typeof import('../presetLoader').importCustomPresets;
let loadCustomPresetsFromUrl: typeof import('../presetLoader').loadCustomPresetsFromUrl;

beforeEach(async () => {
  jest.restoreAllMocks();
  jest.resetModules();
  presetLoaderModule = await import('../presetLoader');
  ({ importCustomPresets, loadCustomPresetsFromUrl } = presetLoaderModule);
});

describe('importCustomPresets', () => {
  test('merges presets without duplicates', async () => {
    const { stylePresets } = await import('../../data/stylePresets');
    const cam = await import('../../data/cameraPresets');
    const loc = await import('../../data/locationPresets');
    const dnd = await import('../../data/dndPresets');

    const origStyleLen = stylePresets['Classic Art & Painting'].length;
    const origShotLen = cam.shotTypeOptions.length;
    const origEnvLen = loc.environmentOptions.length;
    const origRaceLen = dnd.characterRaceOptions.length;

    importCustomPresets({
      stylePresets: {
        'Classic Art & Painting': ['oil painting', 'new style'],
        Extra: ['unique'],
      },
      cameraPresets: { shotTypeOptions: ['wide', 'unique shot'] },
      locationPresets: { environmentOptions: ['forest', 'space'] },
      dndPresets: { characterRaceOptions: ['human', 'merfolk'] },
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

    expect(dnd.characterRaceOptions).toContain('merfolk');
    expect(dnd.characterRaceOptions).toHaveLength(origRaceLen + 1);
  });
});

describe('loadCustomPresetsFromUrl', () => {
  test('loads presets from URL', async () => {
    const data = { stylePresets: { Foo: ['bar'] } };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(data),
    }) as unknown as typeof fetch;
    const { stylePresets } = await import('../../data/stylePresets');

    await presetLoaderModule.loadCustomPresetsFromUrl('http://example.com');

    expect(fetch).toHaveBeenCalledWith('http://example.com');
    expect(stylePresets.Foo).toEqual(['bar']);
  });

  test('rejects when fetch fails', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network')) as unknown as typeof fetch;

    const spy = jest.spyOn(presetLoaderModule, 'importCustomPresets');

    await expect(loadCustomPresetsFromUrl('bad')).rejects.toThrow(
      'Failed to load custom presets: Error: network',
    );
    expect(spy).not.toHaveBeenCalled();
  });

  test('rejects when response json fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error('invalid')),
    }) as unknown as typeof fetch;

    const spy = jest.spyOn(presetLoaderModule, 'importCustomPresets');

    await expect(loadCustomPresetsFromUrl('oops')).rejects.toThrow(
      'Failed to load custom presets: Error: invalid',
    );
    expect(spy).not.toHaveBeenCalled();
  });

  test('rejects when parsed JSON is invalid', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue('not json'),
    }) as unknown as typeof fetch;

    const spy = jest.spyOn(presetLoaderModule, 'importCustomPresets');

    await expect(loadCustomPresetsFromUrl('oops')).rejects.toThrow(
      'Failed to load custom presets:',
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
