import {redirect, type LoaderFunctionArgs} from '@remix-run/server-runtime';

/**
 * OTP login auto-creates accounts on first sign-in.
 * This route simply redirects to the unified login page.
 */
export function loader(_args: LoaderFunctionArgs) {
  return redirect('/account/login');
}

export default function Signup() {
  return null;
}
