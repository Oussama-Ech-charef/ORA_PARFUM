import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { products } from '@/data/products';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}
