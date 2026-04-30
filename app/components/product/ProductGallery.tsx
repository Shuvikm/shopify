/**
 * @file ProductGallery.tsx
 * @description Image gallery for the Product Detail Page.
 *
 * Features:
 * - Thumbnail rail + large hero image
 * - Lazy-loaded via native `loading="lazy"`
 * - Keyboard-accessible thumbnail navigation
 * - Smooth fade transition between images
 * - Renders from `product.images.nodes` or `product.media.nodes`
 */
import {useState, useCallback} from 'react';
import {cn} from '~/lib/utils';

interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  /** If provided, scroll the gallery to the image matching this variant. */
  selectedVariantImage?: GalleryImage | null;
}

export function ProductGallery({images, selectedVariantImage}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If a variant image is provided and differs from current, focus it
  const activeImage = selectedVariantImage
    ? images.find((img) => img.url === selectedVariantImage.url) ?? images[activeIndex]
    : images[activeIndex];

  const handleThumbnailClick = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  if (!images.length) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
        <span className="text-neutral-400 text-sm">No images</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnail Rail */}
      {images.length > 1 && (
        <div
          className="hidden sm:flex flex-col gap-2 w-16 shrink-0"
          role="listbox"
          aria-label="Product images"
        >
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              role="option"
              aria-selected={idx === activeIndex}
              aria-label={img.altText ?? `Product image ${idx + 1}`}
              onClick={() => handleThumbnailClick(idx)}
              className={cn(
                'w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0',
                idx === activeIndex
                  ? 'border-brand-500 shadow-sm'
                  : 'border-transparent hover:border-neutral-200',
              )}
            >
              <img
                src={img.url}
                alt={img.altText ?? ''}
                width={64}
                height={64}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Hero Image */}
      <div className="flex-1 min-w-0">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50">
          <img
            key={activeImage?.url}
            src={activeImage?.url}
            alt={activeImage?.altText ?? ''}
            width={activeImage?.width ?? 800}
            height={activeImage?.height ?? 800}
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="flex sm:hidden justify-center gap-1.5 mt-3" aria-hidden="true">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleThumbnailClick(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  idx === activeIndex ? 'bg-brand-500 w-4' : 'bg-neutral-300',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
