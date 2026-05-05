// Superseded by api.auth.send-otp.tsx — redirect all traffic there.
import {redirect, type ActionFunctionArgs} from '@remix-run/server-runtime';
export async function action(_args: ActionFunctionArgs) {
  return redirect('/api/auth/send-otp', {status: 308});
}
