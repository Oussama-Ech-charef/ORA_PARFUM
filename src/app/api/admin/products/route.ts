import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { products } from '@/data/products';

export async function GET() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await request.json();
    return NextResponse.json({ success: true, product: data });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
