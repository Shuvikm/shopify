/**
 * @file DeliveryEstimate.tsx
 * @description Dynamic delivery estimate based on current date.
 */
import {useMemo} from 'react';

export function DeliveryEstimate() {
  const estimate = useMemo(() => {
    const today = new Date();
    const min = new Date(today);
    const max = new Date(today);
    
    // 3-5 days delivery
    min.setDate(today.getDate() + 3);
    max.setDate(today.getDate() + 5);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${min.toLocaleDateString('en-US', options)} – ${max.toLocaleDateString('en-US', options)}`;
  }, []);

  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
      <span className="text-xl">🚀</span>
      <p className="text-xs font-medium text-green-800">
        Get it as soon as <span className="font-bold">{estimate}</span> if you order today!
      </p>
    </div>
  );
}
