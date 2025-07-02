// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [
  /middleware-manifest\.json$/,
  /build-manifest\.json$/,
  /app-build-manifest\.json$/,
  /prerender-manifest\.json$/,
  /react-loadable-manifest\.json$/,
],
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});
