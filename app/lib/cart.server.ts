/**
 * @file cart.server.ts
 * @description Thin cart helpers — call directly on `context.cart`.
 * Using `as unknown` to side-step the HydrogenCart | HydrogenCartCustom union.
 */
import type {CartLineInput, CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';

type AnyCart = {
  addLines: (lines: CartLineInput[]) => Promise<unknown>;
  updateLines: (lines: CartLineUpdateInput[]) => Promise<unknown>;
  removeLines: (lineIds: string[]) => Promise<unknown>;
  updateDiscountCodes: (codes: string[]) => Promise<unknown>;
};

export async function addToCart(cart: unknown, lines: CartLineInput[]) {
  await (cart as AnyCart).addLines(lines);
}

export async function updateCartLine(cart: unknown, lines: CartLineUpdateInput[]) {
  await (cart as AnyCart).updateLines(lines);
}

export async function removeCartLine(cart: unknown, lineIds: string[]) {
  await (cart as AnyCart).removeLines(lineIds);
}

export async function updateDiscountCode(cart: unknown, codes: string[]) {
  await (cart as AnyCart).updateDiscountCodes(codes);
}
