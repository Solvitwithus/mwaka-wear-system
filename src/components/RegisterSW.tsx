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
            return navigator.serviceWorker.ready;
          })
          .then((registration) => {
            console.log('SW ready');
          })
          .catch((err) => console.error('❌ SW registration failed: ', err));
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}