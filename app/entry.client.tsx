/**
 * @file entry.client.tsx
 * @description Remix client entry — hydrates the SSR HTML.
 * Kept minimal to avoid blocking TTI.
 */
import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
