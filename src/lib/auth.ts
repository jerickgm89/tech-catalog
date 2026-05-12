import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'tc_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function getEnv(key: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  if (fromImport !== undefined) return fromImport;
  return process.env[key];
}

function getSecret(): string {
  const secret = getEnv('SESSION_SECRET');
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET no configurado (mínimo 16 caracteres recomendado).',
    );
  }
  return secret;
}

function toBase64Url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(
    input.replace(/-/g, '+').replace(/_/g, '/') + pad,
    'base64',
  );
}

function sign(data: string, secret: string): string {
  return toBase64Url(createHmac('sha256', secret).update(data).digest());
}

interface SessionPayload {
  u: string;
  exp: number;
}

export function createSessionToken(user: string): string {
  const secret = getSecret();
  const payload: SessionPayload = {
    u: user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const data = toBase64Url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const signature = sign(data, secret);
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;

  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return null;
  }

  const expectedSig = sign(data, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(fromBase64Url(data).toString('utf8'));
  } catch {
    return null;
  }
  if (!payload?.u || typeof payload.exp !== 'number') return null;
  if (payload.exp * 1000 < Date.now()) return null;
  return payload;
}

export function setSessionCookie(cookies: AstroCookies, user: string): void {
  const token = createSessionToken(user);
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export function getSession(cookies: AstroCookies): SessionPayload | null {
  const raw = cookies.get(COOKIE_NAME)?.value;
  return verifySessionToken(raw);
}

export function checkCredentials(user: string, password: string): boolean {
  const expectedUser = getEnv('ADMIN_USER');
  const expectedPassword = getEnv('ADMIN_PASSWORD');
  if (!expectedUser || !expectedPassword) return false;

  const u1 = Buffer.from(user);
  const u2 = Buffer.from(expectedUser);
  const p1 = Buffer.from(password);
  const p2 = Buffer.from(expectedPassword);
  if (u1.length !== u2.length || p1.length !== p2.length) return false;
  return timingSafeEqual(u1, u2) && timingSafeEqual(p1, p2);
}
