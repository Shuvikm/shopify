import {useSearchParams} from '@remix-run/react';
import {useMemo, useState} from 'react';
import type {ProductType, ProductVariantType} from '~/graphql/ProductQuery';
import {getVariantUrl, formatMoney, isOnSale, cn} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';
import {TrustBadges} from './TrustBadges';
import {StickyAddToCart} from './StickyAddToCart';

interface ProductFormProps {
  product: ProductType;
}

export function ProductForm({product}: ProductFormProps) {
  const {variants} = product;
  const options = product.options ?? [];
  const selectedVariant = product.selectedVariant ?? variants?.nodes?.[0] ?? null;
  const [quantity, setQuantity] = useState(1);
  const [params] = useSearchParams();

  const variantMap = useMemo(() => {
    const map = new Map<string, ProductVariantType>();
    for (const v of (variants?.nodes ?? [])) {
      const key = (v.selectedOptions ?? []).map((o) => `${o.name}:${o.value}`).join('|');
      map.set(key, v);
    }
    return map;
  }, [variants]);

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
    <div className="space-y-12">
      {/* Price Section */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-brand-accent">Price</p>
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-light text-brand-primary">
            {selectedVariant
              ? formatMoney(selectedVariant.price)
              : formatMoney(product.priceRange.minVariantPrice)}
          </span>
          {onSale && selectedVariant?.compareAtPrice && (
            <span className="text-lg text-neutral-300 line-through font-light">
              {formatMoney(selectedVariant.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Option Selectors */}
      <div className="space-y-8">
        {options.map((option) => {
          const currentValue = params.get(option.name) ?? option.values[0];

          return (
            <fieldset key={option.name} className="space-y-4">
              <legend className="text-[10px] uppercase tracking-[0.25em] text-brand-accent mb-4">
                {option.name} — <span className="text-brand-primary">{currentValue}</span>
              </legend>
              <div className="flex flex-wrap gap-4">
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
                      className={cn(
                        'relative flex items-center justify-center min-w-[3rem] h-12 px-4 border text-[11px] uppercase tracking-widest transition-all duration-500',
                        isSelected
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-brand-primary/10 text-brand-primary hover:border-brand-primary',
                        !available && 'opacity-20 cursor-not-allowed',
                      )}
                      onClick={(e) => {
                        if (!available) e.preventDefault();
                      }}
                    >
                      {value}
                    </a>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {/* Quantity + Add to Cart */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center border border-brand-primary/10 h-14">
            <button
              type="button"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-full flex items-center justify-center text-brand-primary hover:bg-neutral-50 disabled:opacity-20 transition-all"
            >
              −
            </button>
            <span className="w-10 text-center text-xs font-medium text-brand-primary">
              {quantity}
            </span>
            <button
              type="button"
              disabled={quantity >= (selectedVariant?.quantityAvailable ?? 99)}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-12 h-full flex items-center justify-center text-brand-primary hover:bg-neutral-50 disabled:opacity-20 transition-all"
            >
              +
            </button>
          </div>

          <QuickAddButton
            variantId={selectedVariant?.id ?? ''}
            quantity={quantity}
            disabled={soldOut || !selectedVariant}
            className="flex-1 bg-brand-primary text-white h-14 text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent transition-all duration-700 shadow-xl shadow-brand-primary/5"
          >
            {soldOut ? 'Currently Unavailable' : 'Add to Selection'}
          </QuickAddButton>
        </div>
      </div>

      <StickyAddToCart product={product} />
      <TrustBadges />

      {/* Description */}
      {product.descriptionHtml && (
        <div className="space-y-4 pt-12 border-t border-brand-primary/5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-brand-accent">The Details</p>
          <div
            className="prose prose-sm prose-neutral max-w-none font-light leading-relaxed text-neutral-600"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          />
        </div>
      )}
    </div>
  );
}
