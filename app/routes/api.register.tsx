import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import * as bcrypt from 'bcrypt-ts';
import {registerSchema} from '~/lib/validators';
import {signToken} from '~/lib/jwt.server';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const contentType = request.headers.get('content-type') ?? '';
  let raw: Record<string, unknown>;

  if (contentType.includes('application/json')) {
    raw = await request.json().catch(() => ({}));
  } else {
    const form = await request.formData();
    raw = {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
      name: String(form.get('name') ?? '') || undefined,
      phone: String(form.get('phone') ?? '') || undefined,
    };
  }

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return json({error: 'Validation failed', details: parsed.error.flatten()}, {status: 400});
  }

  const {email, password, name, phone} = parsed.data;

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const db = await getPrisma();

    const existing = await db.user.findUnique({where: {email}});
    if (existing) {
      return json({error: 'An account with this email already exists.'}, {status: 400});
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        password: hashed,
        name: name ?? null,
        verified: true,
        profile: phone ? {create: {phone}} : undefined,
      },
    });

    const token = await signToken({userId: user.id, email: user.email});

    const {session} = context as any;
    session.set('userId', user.id);

    return json(
      {
        ok: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.profile?.phone ?? null,
        },
      },
      {headers: {'Set-Cookie': await session.commit()}},
    );
  } catch (error) {
    console.error('Registration error:', error);
    return json({error: 'Registration failed. Please try again.'}, {status: 500});
  }
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
