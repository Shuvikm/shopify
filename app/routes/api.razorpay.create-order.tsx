import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';
import {calculateCheckoutTotals, normalizeCoupon} from '~/lib/checkout';
import {withTimeout} from '~/lib/async.server';
import {createPendingOrder, savePendingOrder} from '~/lib/orders.server';
import {createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured} from '~/lib/razorpay.server';

async function readPayload(request: Request) {
  const contentType = request.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return request.json().catch(() => ({}));
  }

  const formData = await request.formData();
  return {
    email: formData.get('email'),
    phone: formData.get('phone'),
    couponCode: formData.get('couponCode'),
  };
}

function isValidEmail(email: string): boolean {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function action({request, context}: ActionFunctionArgs) {
  if (!isRazorpayConfigured(context.env)) {
    return json({error: 'Razorpay is not configured on the server.'}, {status: 503});
  }

  const payload = await readPayload(request);
  const email = String(payload.email ?? '').trim();
  const phone = String(payload.phone ?? '').trim();
  const couponCode = normalizeCoupon(String(payload.couponCode ?? ''));

  if (!email && !phone) {
    return json({error: 'Enter an email or phone number for order updates.'}, {status: 400});
  }

  if (!isValidEmail(email)) {
    return json({error: 'Enter a valid email address.'}, {status: 400});
  }

  const cart = await withTimeout(context.cart.get(), 5000, 'checkout cart');
  const lines = (cart as any)?.lines?.nodes ?? [];

  if (!Array.isArray(lines) || lines.length === 0) {
    return json({error: 'Your cart is empty.'}, {status: 400});
  }

  const totals = calculateCheckoutTotals((cart as any)?.cost, couponCode);
  if (totals.total <= 0) {
    return json({error: 'Cart total must be greater than zero.'}, {status: 400});
  }

  try {
    const receipt = `cart-${String((cart as any)?.id ?? crypto.randomUUID()).slice(-32)}`;
    const razorpayOrder = await createRazorpayOrder({
      env: context.env,
      amount: totals.total,
      currencyCode: totals.currencyCode,
      receipt,
      notes: {
        email,
        phone,
        couponCode,
        cartId: String((cart as any)?.id ?? ''),
      },
    });

    const order = createPendingOrder({
      cart: cart as any,
      razorpayOrderId: razorpayOrder.id,
      customer: {email: email || undefined, phone: phone || undefined},
      couponCode,
    });

    savePendingOrder(context.session, order);

    return json(
      {
        keyId: getRazorpayKeyId(context.env),
        merchantOrderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error) {
    console.error('Razorpay create order error:', error);
    return json({error: 'Could not create Razorpay order.'}, {status: 502});
  }
}
