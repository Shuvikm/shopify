import {cn} from '~/lib/utils';
import {useWishlist} from '~/hooks/useWishlist';


interface LikeButtonProps {
  productId: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_SIZE = {sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6'};

export function LikeButton({productId, className, showLabel = false, size = 'md'}: LikeButtonProps) {
  const {isWishlisted, toggle} = useWishlist();
  const liked = isWishlisted(productId);


  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={liked ? 'Unlike' : 'Like'}
      aria-pressed={liked}
      className={cn(
        'relative flex items-center gap-1 group transition-transform active:scale-90',
        className,
      )}
    >
      {/* Ripple on like */}
      {liked && (
        <span className="absolute inset-0 rounded-full animate-ping bg-rose-400/20 pointer-events-none" />
      )}

      <svg
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        className={cn(
          ICON_SIZE[size],
          'transition-all duration-300',
          liked
            ? 'fill-rose-500 stroke-rose-500 scale-110 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
            : 'fill-transparent stroke-neutral-400 group-hover:stroke-rose-400 group-hover:scale-110',
        )}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {showLabel && (
        <span className={cn(
          'text-[10px] font-bold uppercase tracking-wide transition-colors',
          liked ? 'text-rose-500' : 'text-neutral-400 group-hover:text-rose-400',
        )}>
          {liked ? 'Liked' : 'Like'}
        </span>
      )}
    </button>
  );
}
