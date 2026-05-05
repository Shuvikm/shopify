import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import * as bcrypt from 'bcrypt-ts';
import {loginSchema} from '~/lib/validators';
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
    };
  }

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return json({error: 'Validation failed', details: parsed.error.flatten()}, {status: 400});
  }

  const {email, password} = parsed.data;

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const db = await getPrisma();

    const user = await db.user.findUnique({where: {email}});
    if (!user) {
      return json({error: 'Invalid email or password.'}, {status: 401});
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return json({error: 'Invalid email or password.'}, {status: 401});
    }

    const token = await signToken({userId: user.id, email: user.email});

    const {session} = context as any;
    session.set('userId', user.id);

    return json(
      {
        ok: true,
        message: 'Login successful.',
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
    console.error('Login error:', error);
    return json({error: 'Login failed. Please try again.'}, {status: 500});
  }
}

export async function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
