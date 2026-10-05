import { z } from 'zod';

export const metadataSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Max 60 characters'),
  description: z.string().trim().max(500, 'Max 500 characters'),
});

export type Metadata = z.infer<typeof metadataSchema>;
export type MetadataErrors = Partial<Record<keyof Metadata, string>>;

/** Pure validation used by the form hook; first error message per field. */
export function validateMetadata(
  input: { name: string; description: string },
): { ok: true; data: Metadata } | { ok: false; errors: MetadataErrors } {
  const res = metadataSchema.safeParse(input);
  if (res.success) return { ok: true, data: res.data };
  const f = res.error.flatten().fieldErrors;
  return { ok: false, errors: { name: f.name?.[0], description: f.description?.[0] } };
}

export type Video = Metadata & {
  id: number;
  uri: string;
  startSec: number;
  createdAt: string;
};

export const CLIP_SECONDS = 5;
