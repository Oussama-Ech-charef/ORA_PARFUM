const CLEANUP_URL = '/api/cleanup';

export async function cleanupImages(
  imagesToDelete: string[],
  activeImages: string[]
): Promise<{ deleted: string[]; skipped: string[]; errors: { file: string; message: string }[] }> {
  const validToDelete = imagesToDelete.filter(
    (img) => img && img.startsWith('/uploads/')
  );

  if (validToDelete.length === 0) {
    return { deleted: [], skipped: [], errors: [] };
  }

  try {
    const res = await fetch(CLEANUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: validToDelete, activeImages }),
    });

    if (!res.ok) {
      return { deleted: [], skipped: validToDelete, errors: [{ file: 'api', message: `HTTP ${res.status}` }] };
    }

    return await res.json();
  } catch {
    return { deleted: [], skipped: validToDelete, errors: [{ file: 'network', message: 'Network error' }] };
  }
}
