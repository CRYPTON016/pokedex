import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // TODO: Fix TypeScript errors and remove this
  typescript: {
    ignoreBuildErrors: true,
  },
  // TODO: Fix TypeScript errors and remove this
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pokeapi.co',
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com',
      },
    ],
  },
};

export default nextConfig;
