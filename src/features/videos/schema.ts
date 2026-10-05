import { z } from 'zod';

export const metadataSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(60, 'Max 60 characters'),
  description: z.string().trim().max(500, 'Max 500 characters'),
});

export type Metadata = z.infer<typeof metadataSchema>;

export type Video = Metadata & {
  id: number;
  uri: string;
  startSec: number;
  createdAt: string;
};

export const CLIP_SECONDS = 5;
