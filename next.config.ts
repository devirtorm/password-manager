import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,
  
  // Configure ESLint to not block builds in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure TypeScript to not block builds in production
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image configuration if using next/image
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Compilation optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
