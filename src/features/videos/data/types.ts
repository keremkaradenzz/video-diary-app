import type { Metadata, MetadataErrors } from './schema';

/** A saved clip as stored in SQLite (see src/db). */
export type Video = Metadata & {
  id: number;
  uri: string;
  startSec: number;
  createdAt: string;
};

/** What `useMetadataForm` returns and `MetadataForm` renders. */
export type MetadataFormFields = {
  name: string;
  description: string;
  errors: MetadataErrors;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onSubmit: () => void;
};
