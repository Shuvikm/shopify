/**
 * @file ProductForm.tsx
 * @description Variant selector + quantity picker + Add to Cart for the PDP.
 *
 * Architecture:
 * - Pure client component (uses `useFetcher` for AJAX cart add)
 * - Derives available/unavailable variants without full re-render
 * - Communicates selected variant back to parent via URL search params
 *   (keeps Remix's URL-as-state philosophy)
 * - `QuickAddButton` handles the actual cart mutation
 */
import {useSearchParams, useNavigation} from '@remix-run/react';
import {useMemo, useState} from 'react';
import type {ProductType, ProductVariantType} from '~/graphql/ProductQuery';
import {getVariantUrl, formatMoney, isOnSale, cn} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';

interface ProductFormProps {
  product: ProductType;
}

export function ProductForm({product}: ProductFormProps) {
  const {variants, options, selectedVariant} = product;
  const [quantity, setQuantity] = useState(1);
  const [params] = useSearchParams();

  // Build a map: "OptionName:OptionValue" → variant
  const variantMap = useMemo(() => {
    const map = new Map<string, ProductVariantType>();
    for (const v of variants.nodes) {
      const key = v.selectedOptions.map((o) => `${o.name}:${o.value}`).join('|');
      map.set(key, v);
    }
    return map;
  }, [variants]);

  /**
   * Determine if a given option value is available
   * given the currently selected other options.
   */
  function isOptionAvailable(optionName: string, optionValue: string): boolean {
    const testOptions = options.map((opt) => ({
      name: opt.name,
      value: opt.name === optionName ? optionValue : (params.get(opt.name) ?? opt.values[0]),
    }));
    const key = testOptions.map((o) => `${o.name}:${o.value}`).join('|');
    const variant = variantMap.get(key);
    return variant?.availableForSale ?? false;
  }

  const onSale =
    selectedVariant && selectedVariant.compareAtPrice
      ? isOnSale(selectedVariant.price, selectedVariant.compareAtPrice)
      : false;

  const soldOut = selectedVariant ? !selectedVariant.availableForSale : false;

  return (
    <div className="space-y-6">
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-neutral-900">
          {selectedVariant
            ? formatMoney(selectedVariant.price)
            : formatMoney(product.priceRange.minVariantPrice)}
        </span>
        {onSale && selectedVariant?.compareAtPrice && (
          <>
            <span className="text-lg text-neutral-400 line-through">
              {formatMoney(selectedVariant.compareAtPrice)}
            </span>
            <span className="badge-sale">Sale</span>
          </>
        )}
        {soldOut && <span className="badge-sold-out">Sold Out</span>}
      </div>

      {/* Option Selectors */}
      {options.map((option) => {
        const currentValue = params.get(option.name) ?? option.values[0];

        return (
          <fieldset key={option.name} className="space-y-2">
            <legend className="text-sm font-semibold text-neutral-700">
              {option.name}:{' '}
              <span className="font-normal text-neutral-500">{currentValue}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const available = isOptionAvailable(option.name, value);
                const isSelected = currentValue === value;
                const variantUrl = getVariantUrl({
                  handle: product.handle,
                  selectedOptions: options.map((o) => ({
                    name: o.name,
                    value: o.name === option.name ? value : (params.get(o.name) ?? o.values[0]),
                  })),
                  searchParams: params,
                });

                return (
                  <a
                    key={value}
                    href={variantUrl}
                    aria-label={`${option.name}: ${value}${!available ? ' (unavailable)' : ''}`}
                    className={cn(
                      'relative inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-md border text-sm font-medium transition-all duration-150',
                      isSelected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm'
                        : 'border-neutral-200 text-neutral-700 hover:border-brand-300 hover:text-brand-600',
                      !available && 'opacity-40 cursor-not-allowed line-through',
                    )}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={(e) => {
                      if (!available) e.preventDefault();
                    }}
                  >
                    {value}
                    {/* Diagonal "sold out" line */}
                    {!available && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                        <svg className="absolute inset-0 w-full h-full text-neutral-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3 pt-2">
        {/* Quantity */}
        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
          <button
            type="button"
            aria-label="Decrease quantity"
            id="pdp-qty-decrease"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
          >
            −
          </button>
          <span
            className="w-10 text-center text-sm font-semibold text-neutral-900 select-none"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            id="pdp-qty-increase"
            disabled={quantity >= (selectedVariant?.quantityAvailable ?? 99)}
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 transition-colors"
          >
            +
          </button>
        </div>

        {/* Add to Cart */}
        <QuickAddButton
          variantId={selectedVariant?.id ?? ''}
          quantity={quantity}
          disabled={soldOut || !selectedVariant}
          className="flex-1 btn-primary btn-lg"
        >
          {soldOut ? 'Sold Out' : 'Add to Cart'}
        </QuickAddButton>
      </div>

      {/* Description */}
      {product.descriptionHtml && (
        <div
          className="prose prose-sm prose-neutral max-w-none border-t border-neutral-100 pt-6"
          dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
        />
      )}
    </div>
  );
}
