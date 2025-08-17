import { z } from 'zod';
import { DEFAULT_OPTIONS } from './defaultOptions';
import type { SoraOptions } from './soraOptions';

const extraShape = {
  signature: z.string(),
  season: z.string(),
  atmosphere_mood: z.string(),
  subject_mood: z.string(),
  sword_type: z.string(),
  sword_vibe: z.string(),
  secondary_material: z.string(),
  character_mood: z.string(),
  subject_gender: z.string(),
  makeup_style: z.string(),
  quality_booster: z.string(),
  black_and_white_preset: z.string(),
  time_of_year: z.string(),
  location: z.string(),
  special_effects: z.array(z.string()),
  lut_preset: z.string(),
  dnd_character_race: z.string(),
  dnd_character_class: z.string(),
  dnd_character_background: z.string(),
  dnd_character_alignment: z.string(),
  dnd_monster_type: z.string(),
  dnd_environment: z.string(),
  dnd_magic_school: z.string(),
  dnd_item_type: z.string(),
} as const;

/**
 * Generates a Zod schema that mirrors the runtime type of the provided value.
 *
 * This helper is used to build a validation schema for {@link SoraOptions}
 * by inspecting the default option values and creating an equivalent
 * {@link z.ZodTypeAny} instance for each. It supports primitives, arrays,
 * objects and `null` values.
 *
 * @param value - The example value used to determine the schema type.
 * @returns A Zod schema capable of validating values of the same type as `value`.
 */
function schemaFor(value: unknown): z.ZodTypeAny {
  if (typeof value === 'string') return z.string();
  if (typeof value === 'number') return z.number();
  if (typeof value === 'boolean') return z.boolean();
  if (Array.isArray(value)) return z.array(z.any());
  if (value === null) return z.null();
  if (typeof value === 'object') return z.record(z.any());
  return z.any();
}

const shape: Record<string, z.ZodTypeAny> = {};
for (const [key, value] of Object.entries(DEFAULT_OPTIONS)) {
  if (key === 'seed') {
    shape[key] = z.union([z.number(), z.null()]);
  } else if (key === 'style_preset') {
    shape[key] = z.object({ category: z.string(), style: z.string() });
  } else if (key === 'composition_rules') {
    shape[key] = z.array(z.string());
  } else {
    shape[key] = schemaFor(value);
  }
}
Object.entries(extraShape).forEach(([k, s]) => {
  shape[k] = s;
});

export const partialOptionsSchema = z.object(shape).partial().strict();
export type PartialSoraOptions = z.infer<typeof partialOptionsSchema>;

/**
 * Validates whether the supplied object adheres to the
 * {@link partialOptionsSchema} structure.
 *
 * The function acts as a type guard, allowing callers to narrow the type of
 * `obj` to `Partial<SoraOptions>` when the schema validation succeeds.
 *
 * @param obj - The value to validate against `partialOptionsSchema`.
 * @returns `true` if `obj` is a valid `Partial<SoraOptions>`, otherwise `false`.
 */
export function isValidOptions(obj: unknown): obj is Partial<SoraOptions> {
  return partialOptionsSchema.safeParse(obj).success;
}
