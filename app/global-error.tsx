'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Replaces the root layout, so it carries its own minimal styling without the app's CSS.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '1.5rem',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, sans-serif',
          color: '#1a1410',
          background: '#c08552',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            maxWidth: '32rem',
            padding: '2.5rem 2rem 2rem',
            boxShadow: '0 1px 1px rgb(40 20 5 / 0.18), 0 14px 22px -12px rgb(40 20 5 / 0.55)',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ color: '#463a30', marginTop: '0.75rem', marginBottom: 0 }}>
            We&apos;ve been notified. Please reload the page.
          </p>
        </div>
      </body>
    </html>
  );
}
