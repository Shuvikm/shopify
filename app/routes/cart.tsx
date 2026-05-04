/**
 * @file routes/cart.tsx
 * @description Remix action handler for cart mutations and standalone cart page.
 */
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/server-runtime';
import {json} from '@remix-run/server-runtime';
import {Link, useLoaderData} from '@remix-run/react';
import {addToCart, updateCartLine, removeCartLine, updateDiscountCode} from '~/lib/cart.server';
import {CartLineItem} from '~/components/cart/CartLineItem';
import {CartSummary} from '~/components/cart/CartSummary';
import {withTimeout} from '~/lib/async.server';

function ensureShopifyGid(value: FormDataEntryValue | null): string {
  const id = String(value ?? '');
  if (!id.startsWith('gid://shopify/ProductVariant/')) {
    throw new Response('Invalid Shopify variant ID.', {status: 400});
  }
  return id;
}

function safeQuantity(value: FormDataEntryValue | null): number {
  const quantity = Number(value ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const cartAction = String(formData.get('cartAction') ?? '');
  const {cart} = context;

  const headers = new Headers();
  const syncCartIdHeader = (result: unknown) => {
    const cartId = (result as {cart?: {id?: string}})?.cart?.id;
    if (!cartId) return;
    const cartHeaders = context.cart.setCartId(cartId);
    const setCookie = cartHeaders.get('Set-Cookie');
    if (setCookie) headers.append('Set-Cookie', setCookie);
  };

  try {
    switch (cartAction) {
      case 'ADD_TO_CART': {
        const variantIds = formData.getAll('variantId');
        const quantities = formData.getAll('quantity');

        const lines = variantIds.map((id, index) => ({
          merchandiseId: ensureShopifyGid(id),
          quantity: safeQuantity(quantities[index] ?? null),
        }));

        if (lines.length === 0) {
          return json({ok: false, error: 'No variant selected.'}, {status: 400});
        }

        const result = await addToCart(cart as unknown, lines);
        syncCartIdHeader(result);
        return json({ok: true}, {headers});
      }

      case 'UPDATE_CART': {
        const lineId = String(formData.get('lineId') ?? '');
        const quantity = safeQuantity(formData.get('quantity'));
        if (!lineId) return json({ok: false, error: 'Missing cart line ID.'}, {status: 400});

        const result = await updateCartLine(cart as unknown, [{id: lineId, quantity}]);
        syncCartIdHeader(result);
        return json({ok: true}, {headers});
      }

      case 'REMOVE_CART_LINE': {
        const lineId = String(formData.get('lineId') ?? '');
        if (!lineId) return json({ok: false, error: 'Missing cart line ID.'}, {status: 400});

        const result = await removeCartLine(cart as unknown, [lineId]);
        syncCartIdHeader(result);
        return json({ok: true}, {headers});
      }

      case 'UPDATE_DISCOUNT': {
        const discountCode = String(formData.get('discountCode') ?? '').trim();
        const result = await updateDiscountCode(cart as unknown, discountCode ? [discountCode] : []);
        syncCartIdHeader(result);
        return json({ok: true}, {headers});
      }

      default:
        return json({ok: false, error: `Unknown cartAction: ${cartAction}`}, {status: 400});
    }
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Cart action error:', error);
    return json({ok: false, error: 'Cart could not be updated.'}, {status: 500});
  }
}

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const cartData = await withTimeout(context.cart.get(), 5000, 'cart loader');
    return json({cart: cartData});
  } catch (error) {
    console.error('Cart loader error:', error);
    return json({cart: null});
  }
}

export default function CartPage() {
  const {cart} = useLoaderData<typeof loader>();
  const cartAny = cart as any;
  const lines: unknown[] = cartAny?.lines?.nodes ?? [];

  return (
    <div className="container mx-auto py-12 px-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-neutral-500 mb-6">Your cart is empty.</p>
          <Link to="/collections/all" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {lines.map((line) => (
              <CartLineItem key={(line as {id: string}).id} line={line as Parameters<typeof CartLineItem>[0]['line']} />
            ))}
          </div>

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
