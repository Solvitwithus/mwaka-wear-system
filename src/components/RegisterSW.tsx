'use client';

import { useEffect } from 'react';
import { requestForToken } from '@/lib/firebase';

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleLoad = () => {
        // Register existing PWA service worker (/sw.js)
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((reg) => {
            console.log('✅ PWA SW registered: ', reg);
            return navigator.serviceWorker.ready;
          })
          .then((registration) => {
            console.log('✅ PWA SW ready');
          })
          .catch((err) => console.error('❌ PWA SW registration failed: ', err));

        // Register Firebase service worker (/firebase-messaging-sw.js)
        navigator.serviceWorker
          .register('/firebase-messaging-sw.js', { scope: '/firebase/' })
          .then((reg) => {
            console.log('✅ Firebase SW registered: ', reg);
            // Request FCM token after Firebase SW registration
            requestForToken().then((token) => {
              if (token) {
                console.log('✅ FCM Token:', token);
              } else {
                console.log('No FCM token available.');
              }
            });
            return navigator.serviceWorker.ready;
          })
          .then((registration) => {
            console.log('✅ Firebase SW ready');
          })
          .catch((err) => console.error('❌ Firebase SW registration failed: ', err));
      };

      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return null;
}