import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/beta',
        destination: '/founder',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
