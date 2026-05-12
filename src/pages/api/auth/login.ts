import type { APIRoute } from 'astro';
import { checkCredentials, setSessionCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const user = String(form.get('user') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!user || !password) {
    return redirect('/admin/login?error=missing', 303);
  }

  if (!checkCredentials(user, password)) {
    return redirect('/admin/login?error=invalid', 303);
  }

  setSessionCookie(cookies, user);
  return redirect('/admin', 303);
};
