import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import * as bcrypt from 'bcrypt-ts';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {email, password, name} = await request.json();

  if (!email || !password) {
    return json({error: 'Email and password are required'}, {status: 400});
  }

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const prisma = await getPrisma();

    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
      return json({error: 'User already exists'}, {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {email, password: hashedPassword, name},
    });

    const {session} = context;
    session.set('userId', user.id);

    return json(
      {message: 'User registered successfully', user: {id: user.id, email: user.email, name: user.name}},
      {headers: {'Set-Cookie': await session.commit()}},
    );
  } catch (error) {
    console.error('Registration error:', error);
    return json({error: 'Internal server error'}, {status: 500});
  }
}
