import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import * as bcrypt from 'bcrypt-ts';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {email, password} = await request.json();

  if (!email || !password) {
    return json({error: 'Email and password are required'}, {status: 400});
  }

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const prisma = await getPrisma();

    const user = await prisma.user.findUnique({where: {email}});
    if (!user) return json({error: 'Invalid credentials'}, {status: 401});

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return json({error: 'Invalid credentials'}, {status: 401});

    const {session} = context;
    session.set('userId', user.id);

    return json(
      {message: 'Login successful', user: {id: user.id, email: user.email, name: user.name}},
      {headers: {'Set-Cookie': await session.commit()}},
    );
  } catch (error) {
    console.error('Login error:', error);
    return json({error: 'Internal server error'}, {status: 500});
  }
}
