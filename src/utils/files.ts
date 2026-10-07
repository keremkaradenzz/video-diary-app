import { File, Paths } from 'expo-file-system';

/**
 * Deletes `uri` if it lives in the app's cache directory (picker copies, trim leftovers).
 * Anything outside the cache, such as a gallery original, is never touched. Best effort: a failure
 * to clean up must not fail the action that triggered it.
 */
export function deleteIfCached(uri: string) {
  if (uri.startsWith(Paths.cache.uri)) deleteFile(uri);
}

/** Best-effort delete, e.g. of a trimmed clip whose database row could not be saved. */
export function deleteFile(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // ignore
  }
}
