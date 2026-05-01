/**
 * @file routes/api.reviews.tsx
 * @description API route to handle review submissions.
 * Since we don't have a backend DB, this simulates a successful submission.
 */
import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const rating = formData.get('rating');
  const title = formData.get('title');
  const body = formData.get('body');
  const author = formData.get('author');

  console.log('New Review Submission:', {rating, title, body, author});

  // In a real app, you would send this to a reviews platform like Judge.me, Yotpo,
  // or your own database via a Metaobject update (if using Shopify Admin API).
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return json({
    success: true,
    message: 'Thank you! Your review has been submitted for moderation.',
  });
}
