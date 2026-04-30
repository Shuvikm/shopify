/**
 * @file routes/cart.tsx
 * @description Remix action handler for all cart mutations.
 *
 * Supported `cartAction` values (posted via hidden form field):
 * - ADD_TO_CART      → adds a variant line (from QuickAddButton / ProductForm)
 * - UPDATE_CART      → updates line quantity (from CartLineItem stepper)
 * - REMOVE_CART_LINE → removes a line (from CartLineItem delete)
 * - UPDATE_DISCOUNT  → applies/removes a discount code
 *
 * Also exports a loader that renders the standalone /cart page.
 */
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import {useLoaderData} from '@remix-run/react';
import {addToCart, updateCartLine, removeCartLine, updateDiscountCode} from '~/lib/cart.server';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from '~/components/cart/CartSummary';

// ─── Action ───────────────────────────────────────────────────────────────────

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const cartAction = formData.get('cartAction') as string;
  const {cart} = context;

  switch (cartAction) {
    case 'ADD_TO_CART': {
      const variantId = formData.get('variantId') as string;
      const quantity = Number(formData.get('quantity') ?? 1);
      await addToCart(cart as unknown, [{merchandiseId: variantId, quantity}]);
      return json({ok: true});
    }

    case 'UPDATE_CART': {
      const lineId = formData.get('lineId') as string;
      const quantity = Number(formData.get('quantity'));
      await updateCartLine(cart as unknown, [{id: lineId, quantity}]);
      return json({ok: true});
    }

    case 'REMOVE_CART_LINE': {
      const lineId = formData.get('lineId') as string;
      await removeCartLine(cart as unknown, [lineId]);
      return json({ok: true});
    }

    case 'UPDATE_DISCOUNT': {
      const discountCode = formData.get('discountCode') as string;
      await updateDiscountCode(cart as unknown, discountCode ? [discountCode] : []);;
      return json({ok: true});
    }

    default:
      return json({ok: false, error: `Unknown cartAction: ${cartAction}`}, {status: 400});
  }
}

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({context}: LoaderFunctionArgs) {
  const cartData = await context.cart.get();
  return json({cart: cartData});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const {cart} = useLoaderData<typeof loader>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartAny = cart as any;
  const lines: unknown[] = cartAny?.lines?.nodes ?? [];

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-neutral-500 mb-6">Your cart is empty.</p>
          <a href="/collections/all" className="btn btn-primary btn-lg">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Line Items */}
          <div className="lg:col-span-2 space-y-4">
            {lines.map((line) => (
              <CartLineItem key={(line as {id: string}).id} line={line as Parameters<typeof CartLineItem>[0]['line']} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-neutral-100 overflow-hidden">
              <CartSummary cost={cartAny?.cost} checkoutUrl={cartAny?.checkoutUrl ?? '/cart'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
