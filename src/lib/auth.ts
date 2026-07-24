import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { ADMIN_CREDENTIALS } from '@/data/settings';

const SECRET = new TextEncoder().encode('ora-parfum-secret-key-2024');
const COOKIE_NAME = 'ora_admin_token';

export async function createToken(): Promise<string> {
  const token = await new SignJWT({ username: ADMIN_CREDENTIALS.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);
  return token;
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return await verifyToken(token);
  } catch {
    return false;
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = await createToken();
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}
