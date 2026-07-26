import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getSession } from '@/lib/auth';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { images, activeImages } = await request.json();

    if (!Array.isArray(images) || !Array.isArray(activeImages)) {
      return NextResponse.json({ error: 'images and activeImages arrays required' }, { status: 400 });
    }

    const deleted: string[] = [];
    const skipped: string[] = [];
    const errors: { file: string; message: string }[] = [];

    for (const imagePath of images) {
      if (!imagePath || typeof imagePath !== 'string') continue;

      const filename = imagePath.replace(/^\//, '').replace(/^uploads\//, '');

      if (!filename || filename.includes('..')) {
        skipped.push(imagePath);
        continue;
      }

      if (activeImages.includes(imagePath)) {
        skipped.push(imagePath);
        continue;
      }

      if (filename === 'uploads' || !filename) {
        skipped.push(imagePath);
        continue;
      }

      const filePath = path.join(uploadDir, filename);

      if (!existsSync(filePath)) {
        skipped.push(imagePath);
        continue;
      }

      try {
        await unlink(filePath);
        deleted.push(imagePath);
      } catch (err) {
        errors.push({ file: imagePath, message: String(err) });
      }
    }

    return NextResponse.json({ deleted, skipped, errors });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
