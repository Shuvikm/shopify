import {json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Form, Link, useActionData, useNavigation} from '@remix-run/react';
// import bcrypt from 'bcryptjs';

// import {prisma} from '~/lib/db.server';

import {createUserSession, getCustomerAccessToken} from '~/lib/session.server';

export async function loader({request}: LoaderFunctionArgs) {
  const customerAccessToken = await getCustomerAccessToken(request);
  if (customerAccessToken) return redirect('/account');
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return json({error: 'Email and password are required'}, {status: 400});
  }

  try {
    const existingUser = null; // await prisma.user.findUnique({where: {email}});

    if (existingUser) {
      return json({error: 'User already exists'}, {status: 400});
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password; // Plain text mock for now

    const user = { id: 'mock-id', name, email };
    /*
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    */



    const {session} = context;
    session.set('userId', user.id);
    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });

  } catch (error) {
    console.error('Signup error:', error);
    return json({error: 'Something went wrong'}, {status: 500});
  }
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black text-neutral-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-500 font-medium">
            Join shopifyb and start shopping
          </p>
        </div>
        <Form className="mt-8 space-y-6" method="POST">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-neutral-700 uppercase tracking-widest mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-200 placeholder-neutral-400 text-neutral-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">
              {actionData.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-black bg-[#f6c90e] hover:bg-[#f6c90e]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f6c90e] transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'SIGN UP'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/account/login" className="font-bold text-neutral-900 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
