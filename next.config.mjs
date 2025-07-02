const withPWA = require('next-pwa')({
  dest: 'public', // Where service worker files (sw.js, workbox-*.js) will be generated
  register: true, // Automatically register the service worker
  skipWaiting: true, // Activate the new service worker immediately
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development to avoid conflicts
  // Ensure all build files are included
  buildExcludes: [], // Include all build artifacts
  // Optional: Customize runtime caching if needed (see Step 6)
});

module.exports = withPWA({
  // Your existing Next.js config, if any
  reactStrictMode: true, // Example
});