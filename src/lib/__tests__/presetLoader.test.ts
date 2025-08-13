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

  test('deduplicates multiple location preset lists', async () => {
    const loc = await import('../../data/locationPresets');

    const origEnvLen = loc.environmentOptions.length;
    const origLocLen = loc.locationOptions.length;
    const origSeasonLen = loc.seasonOptions.length;
    const origMoodLen = loc.atmosphereMoodOptions.length;

    importCustomPresets({
      locationPresets: {
        environmentOptions: ['forest', 'floating castle'],
        locationOptions: ['Berlin, Germany', 'El Dorado'],
        seasonOptions: ['spring', 'eternal summer'],
        atmosphereMoodOptions: ['moody', 'ecstatic'],
      },
    });

    expect(loc.environmentOptions).toContain('floating castle');
    expect(loc.environmentOptions).toHaveLength(origEnvLen + 1);
    expect(loc.locationOptions).toContain('El Dorado');
    expect(loc.locationOptions).toHaveLength(origLocLen + 1);
    expect(loc.seasonOptions).toContain('eternal summer');
    expect(loc.seasonOptions).toHaveLength(origSeasonLen + 1);
    expect(loc.atmosphereMoodOptions).toContain('ecstatic');
    expect(loc.atmosphereMoodOptions).toHaveLength(origMoodLen + 1);
  });

  test('merges dnd presets arrays without duplicates', async () => {
    const dnd = await import('../../data/dndPresets');

    const origClassLen = dnd.characterClassOptions.length;
    const origMonsterLen = dnd.monsterTypeOptions.length;

    importCustomPresets({
      dndPresets: {
        characterClassOptions: ['fighter', 'time mage'],
        monsterTypeOptions: ['dragon', 'sand worm'],
      },
    });

    expect(dnd.characterClassOptions).toContain('time mage');
    expect(dnd.characterClassOptions).toHaveLength(origClassLen + 1);
    expect(dnd.monsterTypeOptions).toContain('sand worm');
    expect(dnd.monsterTypeOptions).toHaveLength(origMonsterLen + 1);
  });
});

describe('loadCustomPresetsFromUrl', () => {
  test('loads presets from URL', async () => {
    const data = { stylePresets: { Foo: ['bar'] } };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(data),
    }) as unknown as typeof fetch;
    const { stylePresets } = await import('../../data/stylePresets');

    await presetLoaderModule.loadCustomPresetsFromUrl('http://example.com');

    expect(fetch).toHaveBeenCalledWith('http://example.com');
    expect(stylePresets.Foo).toEqual(['bar']);
  });

  test('rejects when response not OK', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }) as unknown as typeof fetch;

    await expect(loadCustomPresetsFromUrl('bad')).rejects.toThrow(
      'Failed to load custom presets: HTTP 404 Not Found',
    );
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
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new Error('invalid')),
    }) as unknown as typeof fetch;

    const spy = jest.spyOn(presetLoaderModule, 'importCustomPresets');

    await expect(loadCustomPresetsFromUrl('oops')).rejects.toThrow(
      'Failed to load custom presets: invalid JSON: Error: invalid',
    );
    expect(spy).not.toHaveBeenCalled();
  });

  test('rejects when parsed JSON is invalid', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue('not json'),
    }) as unknown as typeof fetch;

    const spy = jest.spyOn(presetLoaderModule, 'importCustomPresets');

    await expect(loadCustomPresetsFromUrl('oops')).rejects.toThrow(
      'Failed to load custom presets:',
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
