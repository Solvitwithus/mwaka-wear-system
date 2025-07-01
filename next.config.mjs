// next.config.mjs
import nextPWA from 'next-pwa';
import { join } from 'path';

const isDev = process.env.NODE_ENV === 'development';

const withPWA = nextPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA(nextConfig);
