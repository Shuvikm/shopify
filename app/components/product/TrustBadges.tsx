/**
 * @file TrustBadges.tsx
 * @description Small icons to build trust on the PDP.
 */
export function TrustBadges() {
  const badges = [
    {icon: '🔒', label: 'Secure Checkout'},
    {icon: '🚚', label: 'Free Shipping Over $100'},
    {icon: '🔄', label: '30-Day Easy Returns'},
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-100 pt-6 mt-6">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          <span className="text-lg">{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
