import { z } from 'zod';

export const NAME_MAX = 60;
export const DESCRIPTION_MAX = 500;

export const metadataSchema = z.object({
  // Messages are i18n keys (see src/i18n); the form translates them for display.
  name: z.string().trim().min(1, 'validation.nameRequired').max(NAME_MAX, 'validation.nameMax'),
  description: z.string().trim().max(DESCRIPTION_MAX, 'validation.descriptionMax'),
});

export type ValidationKey = 'validation.nameRequired' | 'validation.nameMax' | 'validation.descriptionMax';

export type Metadata = z.infer<typeof metadataSchema>;
export type MetadataErrors = Partial<Record<keyof Metadata, ValidationKey>>;

/** Pure validation used by the form hook; first error key per field. */
export function validateMetadata(
  input: { name: string; description: string },
): { ok: true; data: Metadata } | { ok: false; errors: MetadataErrors } {
  const res = metadataSchema.safeParse(input);
  if (res.success) return { ok: true, data: res.data };
  const f = res.error.flatten().fieldErrors;
  return {
    ok: false,
    errors: { name: f.name?.[0] as ValidationKey, description: f.description?.[0] as ValidationKey },
  };
}
