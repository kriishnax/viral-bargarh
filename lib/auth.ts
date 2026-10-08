import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'development-only-secret-change-me');
const COOKIE = 'vb_admin_session';

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function createSession(user: { id: string; email: string; role: string }) {
  const token = await new SignJWT({ sub: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secret);
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession() {
  try {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return payload as { sub: string; email: string; role: string };
  } catch { return null; }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.sub || !['ADMIN', 'EDITOR'].includes(session.role)) throw new Error('UNAUTHORIZED');
  return session;
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' });
}
