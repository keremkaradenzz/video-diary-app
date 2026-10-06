// Intl formatters are expensive to create, so they are built once and shared by every list row.
const short = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' });
const long = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatDate = (iso: string) => short.format(new Date(iso));
export const formatDateTime = (iso: string) => long.format(new Date(iso));
