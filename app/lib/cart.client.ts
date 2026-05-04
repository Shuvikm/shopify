/**
 * @file app/lib/cart.client.ts
 * @description Client-side cart utilities and fetch helpers.
 * Use these when you need to directly interact with cart from the client.
 */

/**
 * Safe fetch wrapper for cart operations
 * @param action - The cart action type (ADD_TO_CART, UPDATE_CART, etc.)
 * @param body - FormData or object with cart data
 */
export async function fetchCart(action: string, body: Record<string, any>) {
  const formData = new FormData();
  formData.append('cartAction', action);
  
  Object.entries(body).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, String(v)));
    } else {
      formData.append(key, String(value));
    }
  });

  const response = await fetch('/cart', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cart action failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Add single item to cart
 */
export async function addItemToCart(variantId: string, quantity: number = 1) {
  return fetchCart('ADD_TO_CART', {
    variantId,
    quantity,
  });
}

/**
 * Add multiple items at once
 */
export async function addBulkToCart(items: Array<{variantId: string; quantity: number}>) {
  const body: Record<string, any> = {};
  items.forEach((item, index) => {
    body[`variantId_${index}`] = item.variantId;
    body[`quantity_${index}`] = item.quantity;
  });
  return fetchCart('ADD_TO_CART', body);
}

/**
 * Update cart line quantity
 */
export async function updateCartLineQuantity(lineId: string, quantity: number) {
  return fetchCart('UPDATE_CART', {lineId, quantity});
}

/**
 * Remove item from cart
 */
export async function removeFromCart(lineId: string) {
  return fetchCart('REMOVE_CART_LINE', {lineId});
}

/**
 * Apply or remove discount code
 */
export async function applyDiscount(discountCode: string) {
  return fetchCart('UPDATE_DISCOUNT', {discountCode});
}
