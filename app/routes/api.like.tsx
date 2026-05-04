import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
// import {prisma} from '~/lib/db.server';


export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const userId = session.get('userId');

  if (!userId) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  const formData = await request.formData();
  const productId = formData.get('productId') as string;
  const action = formData.get('action') as 'like' | 'unlike';

  if (!productId) {
    return json({error: 'Product ID is required'}, {status: 400});
  }

  try {
    return json({success: true, liked: action === 'like'});
    /*
    if (action === 'unlike') {
      await prisma.like.deleteMany({
        where: {
          userId,
          productId,
        },
      });
      return json({success: true, liked: false});
    } else {
      // Check if already liked
      const existing = await prisma.like.findFirst({
        where: {userId, productId}
      });
      
      if (!existing) {
        await prisma.like.create({
          data: {
            userId,
            productId,
          },
        });
      }
      return json({success: true, liked: true});
    }
    */

  } catch (error) {
    console.error('Like action error:', error);
    return json({error: 'Something went wrong'}, {status: 500});
  }
}
