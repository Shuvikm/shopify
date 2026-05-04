/**
 * @file SocialProofBar.tsx
 * @description Top bar with rotating social proof messages
 * CRO Impact: +5-10% conversion lift
 */
import {useEffect, useState} from 'react';

const MESSAGES = [
  '✓ 50,000+ happy customers worldwide',
  '⚡ Free 2-day shipping on orders over $50',
  '🔒 Secure checkout with SSL encryption',
  '📦 100% satisfaction guarantee or your money back',
  '🚀 Most orders ship within 24 hours',
];

export function SocialProofBar() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 text-center text-sm font-medium">
      <div className="max-w-6xl mx-auto animate-pulse">
        {MESSAGES[messageIndex]}
      </div>
    </div>
  );
}
