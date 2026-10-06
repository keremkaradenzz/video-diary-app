import { useState } from 'react';

import { validateMetadata, type Metadata, type MetadataErrors } from '@/features/videos/model/schema';
import type { MetadataFormFields } from '@/features/videos/model/types';

/** Form state + validation. The returned object matches the props of `MetadataForm`. */
export function useMetadataForm(
  initial: Metadata | undefined,
  onValid: (m: Metadata) => void,
): MetadataFormFields {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<MetadataErrors>({});

  // Editing a field clears its error right away instead of waiting for the next submit.
  const onChangeName = (v: string) => {
    setName(v);
    setErrors((e) => ({ ...e, name: undefined }));
  };
  const onChangeDescription = (v: string) => {
    setDescription(v);
    setErrors((e) => ({ ...e, description: undefined }));
  };

  const onSubmit = () => {
    const res = validateMetadata({ name, description });
    setErrors(res.ok ? {} : res.errors);
    if (res.ok) onValid(res.data);
  };

  return { name, description, errors, onChangeName, onChangeDescription, onSubmit };
}
