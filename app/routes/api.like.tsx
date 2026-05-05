import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const userId = session.get('userId');
  if (!userId) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  const {productId, action: likeAction} = await request.json();

  if (!productId) {
    return json({error: 'Product ID is required'}, {status: 400});
  }

  try {
    const {getPrisma} = await import('~/lib/db.server');
    const prisma = await getPrisma();

    if (likeAction === 'unlike') {
      await prisma.like.deleteMany({where: {userId, productId}});
      return json({success: true, liked: false});
    }

    const existing = await prisma.like.findFirst({where: {userId, productId}});
    if (!existing) {
      await prisma.like.create({data: {userId, productId}});
    }
    return json({success: true, liked: true});
  } catch (error) {
    console.error('Like action error:', error);
    return json({error: 'Something went wrong'}, {status: 500});
  }
}
