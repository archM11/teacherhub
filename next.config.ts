import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/teacherhub',
  assetPrefix: '/teacherhub/'
};

export default nextConfig;
