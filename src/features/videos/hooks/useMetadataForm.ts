import { useState } from 'react';

import { validateMetadata, type Metadata, type MetadataErrors } from '@/features/videos/schema';

/** Form state + validation. The returned object matches the props of `MetadataForm`. */
export function useMetadataForm(initial: Metadata | undefined, onValid: (m: Metadata) => void) {
  const [name, onChangeName] = useState(initial?.name ?? '');
  const [description, onChangeDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<MetadataErrors>({});

  const onSubmit = () => {
    const res = validateMetadata({ name, description });
    setErrors(res.ok ? {} : res.errors);
    if (res.ok) onValid(res.data);
  };

  return { name, description, errors, onChangeName, onChangeDescription, onSubmit };
}
