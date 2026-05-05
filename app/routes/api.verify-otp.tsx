// Superseded by api.auth.verify-otp.tsx — redirect all traffic there.
import {redirect, type ActionFunctionArgs} from '@remix-run/server-runtime';
export async function action(_args: ActionFunctionArgs) {
  return redirect('/api/auth/verify-otp', {status: 308});
}
