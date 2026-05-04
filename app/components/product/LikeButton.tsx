import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {cn} from '~/lib/utils';

interface LikeButtonProps {
  productId: string;
  isInitialLiked?: boolean;
  className?: string;
}

export function LikeButton({productId, isInitialLiked = false, className}: LikeButtonProps) {
  const fetcher = useFetcher<{liked: boolean; error?: string}>();
  const [isLiked, setIsLiked] = useState(isInitialLiked);

  useEffect(() => {
    if (fetcher.data && fetcher.data.liked !== undefined) {
      setIsLiked(fetcher.data.liked);
    }
  }, [fetcher.data]);

  const toggleLike = () => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('action', isLiked ? 'unlike' : 'like');
    fetcher.submit(formData, {method: 'POST', action: '/api/like'});
    // Optimistic update
    setIsLiked(!isLiked);
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleLike();
      }}
      className={cn(
        'transition-all duration-300 transform active:scale-75',
        isLiked ? 'text-red-500' : 'text-neutral-300 hover:text-red-400',
        className
      )}
    >
      <HeartIcon filled={isLiked} />
    </button>
  );
}

function HeartIcon({filled}: {filled: boolean}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill={filled ? "currentColor" : "none"} 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}
