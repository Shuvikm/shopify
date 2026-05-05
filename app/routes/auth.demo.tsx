import {json, redirect, type LoaderFunctionArgs} from '@remix-run/server-runtime';

// This demo route is only accessible when already logged in (root loader guards it).
// Redirect to account page instead.
export function loader({}: LoaderFunctionArgs) {
  return redirect('/account');
}

export default function AuthDemo() {
  return null;
}
