import { metadataSchema, validateMetadata } from './video-schema';

describe('validateMetadata', () => {
  it('returns trimmed data when valid', () => {
    expect(validateMetadata({ name: ' a ', description: '' })).toEqual({
      ok: true,
      data: { name: 'a', description: '' },
    });
  });

  it('returns one message per invalid field', () => {
    const res = validateMetadata({ name: '', description: 'x'.repeat(501) });
    expect(res).toMatchObject({ ok: false });
    if (!res.ok) {
      expect(res.errors.name).toBe('validation.nameRequired');
      expect(res.errors.description).toBe('validation.descriptionMax');
    }
  });
});

describe('metadataSchema', () => {
  it('accepts valid input and trims it', () => {
    expect(metadataSchema.parse({ name: '  Trip ', description: ' fun ' })).toEqual({
      name: 'Trip',
      description: 'fun',
    });
  });

  it('allows an empty description', () => {
    expect(metadataSchema.safeParse({ name: 'a', description: '' }).success).toBe(true);
  });

  it('rejects an empty or whitespace name', () => {
    expect(metadataSchema.safeParse({ name: '   ', description: '' }).success).toBe(false);
  });

  it('rejects a description over 500 characters', () => {
    expect(metadataSchema.safeParse({ name: 'a', description: 'x'.repeat(501) }).success).toBe(false);
  });
});
