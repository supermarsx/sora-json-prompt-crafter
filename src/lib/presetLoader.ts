import { stylePresets } from '@/data/stylePresets';
import * as cameraPresets from '@/data/cameraPresets';
import {
  environmentOptions,
  locationOptions,
  seasonOptions,
  atmosphereMoodOptions,
} from '@/data/locationPresets';
import * as dndPresets from '@/data/dndPresets';

export interface CustomPresetData {
  stylePresets?: Record<string, string[]>;
  cameraPresets?: Partial<typeof cameraPresets>;
  locationPresets?: {
    environmentOptions?: string[];
    locationOptions?: string[];
    seasonOptions?: string[];
    atmosphereMoodOptions?: string[];
  };
  dndPresets?: Partial<typeof dndPresets>;
}

export function importCustomPresets(data: string | CustomPresetData): void {
  const obj: CustomPresetData =
    typeof data === 'string' ? JSON.parse(data) : data;

  if (obj.stylePresets) {
    for (const [cat, styles] of Object.entries(obj.stylePresets)) {
      if (!Array.isArray(styles)) continue;
      if (stylePresets[cat]) {
        stylePresets[cat].push(
          ...styles.filter((s) => !stylePresets[cat].includes(s)),
        );
      } else {
        stylePresets[cat] = styles;
      }
    }
  }

  if (obj.cameraPresets) {
    for (const [key, arr] of Object.entries(obj.cameraPresets)) {
      const target = (cameraPresets as Record<string, string[]>)[
        key as keyof typeof cameraPresets
      ];
      if (Array.isArray(arr) && Array.isArray(target)) {
        (cameraPresets as Record<string, string[]>)[
          key as keyof typeof cameraPresets
        ] = Array.from(new Set([...target, ...arr]));
      }
    }
  }

  if (obj.locationPresets) {
    if (obj.locationPresets.environmentOptions) {
      environmentOptions.push(
        ...obj.locationPresets.environmentOptions.filter(
          (e) => !environmentOptions.includes(e),
        ),
      );
    }
    if (obj.locationPresets.locationOptions) {
      locationOptions.push(
        ...obj.locationPresets.locationOptions.filter(
          (e) => !locationOptions.includes(e),
        ),
      );
    }
    if (obj.locationPresets.seasonOptions) {
      seasonOptions.push(
        ...obj.locationPresets.seasonOptions.filter(
          (e) => !seasonOptions.includes(e),
        ),
      );
    }
    if (obj.locationPresets.atmosphereMoodOptions) {
      atmosphereMoodOptions.push(
        ...obj.locationPresets.atmosphereMoodOptions.filter(
          (e) => !atmosphereMoodOptions.includes(e),
        ),
      );
    }
  }

  if (obj.dndPresets) {
    for (const [key, arr] of Object.entries(obj.dndPresets)) {
      const target = (dndPresets as Record<string, string[]>)[
        key as keyof typeof dndPresets
      ];
      if (Array.isArray(arr) && Array.isArray(target)) {
        (dndPresets as Record<string, string[]>)[
          key as keyof typeof dndPresets
        ] = Array.from(new Set([...target, ...arr]));
      }
    }
  }
}

export async function loadCustomPresetsFromUrl(url: string) {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error('Failed to load custom presets: ' + err);
  }

  if (!res.ok) {
    throw new Error(
      `Failed to load custom presets: HTTP ${res.status} ${res.statusText || ''}`.trim(),
    );
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('Failed to load custom presets: invalid JSON: ' + err);
  }

  try {
    importCustomPresets(json);
  } catch (err) {
    throw new Error('Failed to load custom presets: ' + err);
  }
}
