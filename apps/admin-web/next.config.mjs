/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Transpile shared packages from monorepo
  transpilePackages: ['@shared/types'],
};

export default nextConfig;
