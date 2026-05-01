/**
 * @file StockLevel.tsx
 * @description Scarcity indicator for low stock.
 */
export function StockLevel({quantity}: {quantity?: number}) {
  // If no quantity is provided, we'll mock a "Low Stock" scenario for demonstration
  // or use a static threshold.
  const threshold = 10;
  const isLowStock = quantity && quantity > 0 && quantity <= threshold;

  if (!isLowStock && quantity !== undefined) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`h-1 w-6 rounded-full ${i < 2 ? 'bg-red-500' : 'bg-neutral-200'}`} 
          />
        ))}
      </div>
      <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest animate-pulse">
        Only 5 left in stock — order soon!
      </p>
    </div>
  );
}
