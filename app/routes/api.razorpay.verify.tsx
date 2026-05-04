import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import {
  clearPendingOrder,
  getPendingOrder,
  markOrderPaid,
  saveStoredOrder,
} from '~/lib/orders.server';
import {verifyRazorpaySignature} from '~/lib/razorpay.server';
import {sendOrderNotifications} from '~/lib/notifications.server';
import {withTimeout} from '~/lib/async.server';

export async function action({request, context}: ActionFunctionArgs) {
  const payload = await request.json().catch(() => ({}));
  const merchantOrderId = String(payload.merchantOrderId ?? '');
  const razorpayOrderId = String(payload.razorpay_order_id ?? '');
  const razorpayPaymentId = String(payload.razorpay_payment_id ?? '');
  const razorpaySignature = String(payload.razorpay_signature ?? '');

  if (!merchantOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return json({error: 'Missing Razorpay verification fields.'}, {status: 400});
  }

  const pendingOrder = getPendingOrder(context.session);
  if (!pendingOrder || pendingOrder.id !== merchantOrderId || pendingOrder.payment.razorpayOrderId !== razorpayOrderId) {
    return json({error: 'Payment session expired. Please start checkout again.'}, {status: 409});
  }

  const verified = await verifyRazorpaySignature({
    env: context.env,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!verified) {
    return json({error: 'Razorpay signature verification failed.'}, {status: 400});
  }

  const paidOrder = markOrderPaid(pendingOrder, {
    razorpayPaymentId,
    razorpaySignature,
  });

  saveStoredOrder(context.session, paidOrder);
  clearPendingOrder(context.session);

  const cart = await withTimeout(context.cart.get(), 5000, 'paid cart').catch(() => null);
  const lineIds = ((cart as any)?.lines?.nodes ?? []).map((line: any) => line.id).filter(Boolean);
  if (lineIds.length > 0) {
    await context.cart.removeLines(lineIds).catch((error: unknown) => {
      console.error('Unable to clear paid cart:', error);
    });
  }

  context.waitUntil(sendOrderNotifications(context.env, paidOrder));

  return json(
    {
      ok: true,
      orderId: paidOrder.id,
      orderNumber: paidOrder.orderNumber,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}
