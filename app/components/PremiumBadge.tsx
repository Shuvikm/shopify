/**
 * @file components/PremiumBadge.tsx
 * @description Premium badge component for featured products/homepage
 */
import {cn} from '~/lib/utils';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function PremiumBadge({size = 'md', className, showText = true}: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100',
        'border-2 border-yellow-500 shadow-lg',
        'rounded-full font-black text-yellow-900',
        'animate-pulse',
        sizeClasses[size],
        className,
      )}
      title="Premium Product"
    >
      ✨
      {showText && size === 'lg' && (
        <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold whitespace-nowrap">
          PREMIUM
        </span>
      )}
    </div>
  );
}

interface PremiumBannerProps {
  className?: string;
}

export function PremiumBanner({className}: PremiumBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200',
        'border-t-4 border-b-4 border-yellow-600',
        'py-4 px-6 text-center',
        'shadow-xl',
        className,
      )}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-black text-yellow-900 mb-2 flex items-center justify-center gap-3">
          ✨ PREMIUM COLLECTION ✨
        </h2>
        <p className="text-yellow-800 font-semibold text-sm md:text-base">
          Exclusive products selected for quality and excellence
        </p>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-2 left-4 text-2xl animate-bounce">✨</div>
      <div className="absolute top-2 right-4 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>
        ⭐
      </div>
    </div>
  );
}
