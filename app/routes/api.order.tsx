import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {session} = context;
  const userId = session.get('userId');
  if (!userId) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  const {total, status = 'pending'} = await request.json();

  if (!total || typeof total !== 'number') {
    return json({error: 'Valid total is required'}, {status: 400});
  }

  return json({order: {id: crypto.randomUUID(), userId, total, status, createdAt: new Date().toISOString()}});
}
