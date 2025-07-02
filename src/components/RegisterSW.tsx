'use client';

import { useEffect } from 'react';

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('✅ SW registered: ', reg);
            return navigator.serviceWorker.ready; // Wait for the service worker to be ready
          })
          .then((registration) => {
            console.log('SW ready');
          })
          .catch((err) => console.error('❌ SW registration failed: ', err));
      };

      window.addEventListener('load', handleLoad);

      // Cleanup event listener
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return null;
}