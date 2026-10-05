import { metadataSchema } from './schema';

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
