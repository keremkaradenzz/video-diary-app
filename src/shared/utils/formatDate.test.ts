import { formatDate, formatDateTime } from './formatDate';

describe('formatDate', () => {
  const iso = '2026-10-05T09:44:00.000Z';

  it('formats an ISO string as a short date', () => {
    expect(formatDate(iso)).toMatch(/2026|26/);
  });

  it('adds the time in the long format', () => {
    expect(formatDateTime(iso).length).toBeGreaterThan(formatDate(iso).length);
  });
});
