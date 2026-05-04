/**
 * @file routes/api.reviews.tsx
 * @description Review submission endpoint. In production this posts to the
 * configured reviews service webhook so reviews are moderated outside the UI.
 */
import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = {
    productId: String(formData.get('productId') ?? ''),
    rating: Number(formData.get('rating') ?? 0),
    title: String(formData.get('title') ?? '').trim(),
    body: String(formData.get('body') ?? '').trim(),
    author: String(formData.get('author') ?? '').trim(),
  };

  if (!payload.productId || !payload.title || !payload.body || !payload.author || payload.rating < 1 || payload.rating > 5) {
    return json({success: false, message: 'Please complete every review field.'}, {status: 400});
  }

  const webhookUrl = context.env.REVIEWS_WEBHOOK_URL || context.env.RUFLOW_ORDER_WEBHOOK_URL;
  if (!webhookUrl) {
    return json({
      success: false,
      message: 'Review moderation service is not configured.',
    }, {status: 503});
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({event: 'review.submitted', review: payload}),
  });

  if (!response.ok) {
    return json({success: false, message: 'The review service could not accept this review.'}, {status: 502});
  }

  return json({
    success: true,
    message: 'Thank you. Your review was submitted for moderation.',
  });
}
