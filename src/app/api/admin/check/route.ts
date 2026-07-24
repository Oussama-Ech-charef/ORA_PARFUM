import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const isAuthenticated = await getSession();
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
